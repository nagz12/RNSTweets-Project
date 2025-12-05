import {
  retryWithBackoff,
  withTimeout,
  initCircuitBreaker,
  checkCircuitBreaker,
  recordCircuitBreakerFailure,
  recordCircuitBreakerSuccess,
  getFromCache,
  setInCache,
  openRouterRateLimiter,
  safeParseJSON,
  ProductionLogger,
} from "./ai-production-utils";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const REQUEST_TIMEOUT_MS = 15000; // 15 seconds timeout
const CACHE_TTL_MS = 3600000; // 1 hour cache

const logger = new ProductionLogger({ service: "moderation" });

const DEMERIT_THRESHOLDS = {
  SUSPENSION_THRESHOLD: 50,
  HIGH_TOXICITY: { score: 0.8, points: 15 },
  MEDIUM_TOXICITY: { score: 0.5, points: 10 },
  LOW_TOXICITY: { score: 0.3, points: 5 },
};

export interface ModerationResult {
  isToxic: boolean;
  toxicityScore: number;
  reason: string;
  points: number;
  shouldBlock: boolean;
  cached?: boolean;
}
export async function moderateContent(
  content: string
): Promise<ModerationResult> {
  if (!OPENROUTER_API_KEY) {
    logger.error("OPENROUTER_API_KEY environment variable not set");
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  // Check cache first
  const cacheKey = `moderation:${Buffer.from(content).toString("base64").substring(0, 50)}`;
  const cachedResult = getFromCache<ModerationResult>(cacheKey);
  if (cachedResult) {
    logger.debug("Cache hit for moderation", { contentLength: content.length });
    return { ...cachedResult, cached: true };
  }

  // Check circuit breaker
  initCircuitBreaker("openrouter-moderation");
  if (!checkCircuitBreaker("openrouter-moderation")) {
    logger.warn("Circuit breaker OPEN for moderation service");
    return {
      isToxic: false,
      toxicityScore: 0,
      reason: "Moderation service temporarily unavailable",
      points: 0,
      shouldBlock: false,
    };
  }

  try {
    await openRouterRateLimiter.acquire(1);

    const result = await retryWithBackoff(
      async () => {
        const response = await withTimeout(
          fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-20b:free",
              messages: [
                {
                  role: "user",
                  content: `Analyze this text for toxicity and harmful content. Respond with ONLY valid JSON (no markdown, no extra text):
{
  "isToxic": boolean,
  "toxicityScore": number (0-1),
  "categories": ["list of categories like: harassment, hate_speech, violence, spam, nsfw"],
  "reason": "brief explanation"
}
Text to analyze: "${content}"`,
                },
              ],
              temperature: 0.3,
              max_tokens: 200,
            }),
          }),
          REQUEST_TIMEOUT_MS,
          "Moderation request timeout"
        );

        const text = await response.text();
        if (!response.ok) {
          logger.error("OpenRouter API error", {
            status: response.status,
            message: text,
          });
          throw new Error(`OpenRouter API error: ${response.status}`);
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          logger.error("Failed to parse OpenRouter response", { text });
          throw new Error("Invalid response from moderation service");
        }

        const aiResponse = data?.choices?.[0]?.message?.content;
        if (!aiResponse || typeof aiResponse !== "string") {
          throw new Error("Invalid AI response format");
        }

        return aiResponse;
      },
      3,
      100,
      5000
    );

    const parsed = safeParseJSON(result, {
      isToxic: false,
      toxicityScore: 0,
      categories: [],
      reason: "Could not parse response",
    });

    const toxicityScore = Math.min(1, Math.max(0, parsed.toxicityScore || 0));
    const isToxicContent = parsed.isToxic || toxicityScore > 0.3;
    let points = 0;

    if (isToxicContent) {
      if (toxicityScore >= DEMERIT_THRESHOLDS.HIGH_TOXICITY.score) {
        points = DEMERIT_THRESHOLDS.HIGH_TOXICITY.points;
      } else if (toxicityScore >= DEMERIT_THRESHOLDS.MEDIUM_TOXICITY.score) {
        points = DEMERIT_THRESHOLDS.MEDIUM_TOXICITY.points;
      } else if (toxicityScore >= DEMERIT_THRESHOLDS.LOW_TOXICITY.score) {
        points = DEMERIT_THRESHOLDS.LOW_TOXICITY.points;
      } else {
        points = DEMERIT_THRESHOLDS.LOW_TOXICITY.points;
      }
    }

    const moderationResult: ModerationResult = {
      isToxic: isToxicContent,
      toxicityScore,
      reason:
        parsed.reason ||
        parsed.categories?.join(", ") ||
        "Potentially harmful content",
      points,
      shouldBlock: isToxicContent || toxicityScore >= 0.4,
    };

    // Cache the result
    setInCache(cacheKey, moderationResult, CACHE_TTL_MS);
    recordCircuitBreakerSuccess("openrouter-moderation");
    logger.debug("Moderation completed", {
      toxic: isToxicContent,
      score: toxicityScore,
    });

    return moderationResult;
  } catch (error) {
    recordCircuitBreakerFailure("openrouter-moderation");
    logger.error("Moderation error", {
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      isToxic: false,
      toxicityScore: 0,
      reason: "Moderation service temporarily unavailable",
      points: 0,
      shouldBlock: false,
    };
  }
}

export function getSuspensionThreshold(): number {
  return DEMERIT_THRESHOLDS.SUSPENSION_THRESHOLD;
}
