import { moderateContent } from "./ai-moderation";
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
const REQUEST_TIMEOUT_MS = 20000; // 20 seconds timeout for advanced features
const CACHE_TTL_MS = 3600000; // 1 hour cache

const logger = new ProductionLogger({ service: "advanced-moderation" });
export interface SentimentAnalysis {
  sentiment: "positive" | "neutral" | "negative" | "hostile";
  emotionalTone: string[];
  targetedUser?: string;
  isPersonalAttack: boolean;
  confidence: number;
}
export interface ContentEnhancement {
  shouldWarn: boolean;
  warningMessage?: string;
  suggestedEdit?: string;
  alternativePhrasing?: string[];
}
export interface BullyingPattern {
  isRepeatOffender: boolean;
  targetedHarassment: boolean;
  victimUsername?: string;
  patternType?: "stalking" | "coordinated" | "persistent";
}

export async function analyzeSentiment(
  content: string,
  mentions: string[]
): Promise<SentimentAnalysis> {
  if (!OPENROUTER_API_KEY) {
    logger.error("OPENROUTER_API_KEY environment variable not set");
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  // Check cache
  const cacheKey = `sentiment:${Buffer.from(content + mentions.join(",")).toString("base64").substring(0, 50)}`;
  const cached = getFromCache<SentimentAnalysis>(cacheKey);
  if (cached) {
    logger.debug("Sentiment cache hit");
    return cached;
  }

  // Check circuit breaker
  initCircuitBreaker("openrouter-sentiment");
  if (!checkCircuitBreaker("openrouter-sentiment")) {
    logger.warn("Circuit breaker OPEN for sentiment analysis");
    return {
      sentiment: "neutral",
      emotionalTone: [],
      isPersonalAttack: false,
      confidence: 0,
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
                  role: "system",
                  content:
                    "You are an expert sentiment analyzer. Respond with ONLY valid JSON.",
                },
                {
                  role: "user",
                  content: `Analyze this social media post for emotional tone and potential personal attacks. Return ONLY valid JSON:
{
  "sentiment": "positive|neutral|negative|hostile",
  "emotionalTone": ["supportive", "aggressive", "sarcastic", "threatening", etc.],
  "isPersonalAttack": boolean,
  "confidence": number (0-1)
}
Mentioned users: ${mentions.join(", ") || "none"}
Post: "${content}"`,
                },
              ],
              temperature: 0.2,
              max_tokens: 150,
            }),
          }),
          REQUEST_TIMEOUT_MS,
          "Sentiment analysis timeout"
        );

        const text = await response.text();
        if (!response.ok) {
          logger.error("OpenRouter API error for sentiment", { status: response.status });
          throw new Error(`OpenRouter API error: ${response.status}`);
        }

        let data = JSON.parse(text);
        return data?.choices?.[0]?.message?.content || "";
      },
      2,
      100,
      3000
    );

    const parsed = safeParseJSON(result, {
      sentiment: "neutral",
      emotionalTone: [],
      isPersonalAttack: false,
      confidence: 0.5,
    });

    const sentiment: SentimentAnalysis = {
      sentiment: (["positive", "neutral", "negative", "hostile"].includes(
        parsed.sentiment
      )
        ? parsed.sentiment
        : "neutral") as "positive" | "neutral" | "negative" | "hostile",
      emotionalTone: Array.isArray(parsed.emotionalTone) ? parsed.emotionalTone : [],
      targetedUser: mentions[0],
      isPersonalAttack: !!parsed.isPersonalAttack,
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.5)),
    };

    setInCache(cacheKey, sentiment, CACHE_TTL_MS);
    recordCircuitBreakerSuccess("openrouter-sentiment");
    return sentiment;
  } catch (error) {
    recordCircuitBreakerFailure("openrouter-sentiment");
    logger.error("Sentiment analysis error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      sentiment: "neutral",
      emotionalTone: [],
      isPersonalAttack: false,
      confidence: 0,
    };
  }
}

export async function enhanceContent(
  content: string,
  moderationResult: any
): Promise<ContentEnhancement> {
  if (!OPENROUTER_API_KEY || !moderationResult.isToxic) {
    return { shouldWarn: false };
  }

  // Check cache
  const cacheKey = `enhance:${Buffer.from(content + moderationResult.reason).toString("base64").substring(0, 50)}`;
  const cached = getFromCache<ContentEnhancement>(cacheKey);
  if (cached) {
    logger.debug("Content enhancement cache hit");
    return cached;
  }

  initCircuitBreaker("openrouter-enhancement");
  if (!checkCircuitBreaker("openrouter-enhancement")) {
    logger.warn("Circuit breaker OPEN for content enhancement");
    return {
      shouldWarn: true,
      warningMessage: "Please review your post for potentially harmful content",
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
                  role: "system",
                  content:
                    "You are a helpful assistant that rephrases harmful content into constructive communication.",
                },
                {
                  role: "user",
                  content: `This post was flagged as potentially harmful. Suggest 3 alternative ways to express the same idea more constructively. Return ONLY valid JSON:
{
  "warningMessage": "brief warning about the issue",
  "suggestedEdit": "rewritten version maintaining intent but removing harm",
  "alternativePhrasing": ["option 1", "option 2", "option 3"]
}
Original post: "${content}"
Issue detected: ${moderationResult.reason}`,
                },
              ],
              temperature: 0.4,
              max_tokens: 300,
            }),
          }),
          REQUEST_TIMEOUT_MS,
          "Content enhancement timeout"
        );

        const text = await response.text();
        if (!response.ok) {
          throw new Error(`OpenRouter API error: ${response.status}`);
        }

        let data = JSON.parse(text);
        return data?.choices?.[0]?.message?.content || "";
      },
      2,
      100,
      3000
    );

    const parsed = safeParseJSON(result, {
      warningMessage: "This content may be harmful to others",
      suggestedEdit: "",
      alternativePhrasing: [],
    });

    const enhancement: ContentEnhancement = {
      shouldWarn: true,
      warningMessage: parsed.warningMessage || "This content may be harmful to others",
      suggestedEdit: parsed.suggestedEdit,
      alternativePhrasing: Array.isArray(parsed.alternativePhrasing)
        ? parsed.alternativePhrasing.slice(0, 3)
        : [],
    };

    setInCache(cacheKey, enhancement, CACHE_TTL_MS);
    recordCircuitBreakerSuccess("openrouter-enhancement");
    return enhancement;
  } catch (error) {
    recordCircuitBreakerFailure("openrouter-enhancement");
    logger.error("Content enhancement error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      shouldWarn: true,
      warningMessage: "Please review your post for potentially harmful content",
    };
  }
}

export async function detectBullyingPattern(
  userId: string,
  targetUsername: string,
  timeWindowDays: number = 7
): Promise<BullyingPattern> {
  try {
    const { Tweet } = await import("@/lib/models/Tweet");
    const { Demerit } = await import("@/lib/models/Demerit");
    const { connectDB } = await import("@/lib/db");
    await connectDB();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeWindowDays);
    const tweets = await Tweet.find({
      author: userId,
      content: { $regex: `@${targetUsername}`, $options: "i" },
      createdAt: { $gte: startDate },
    }).lean();
    const demerits = await Demerit.find({
      user: userId,
      createdAt: { $gte: startDate },
    }).lean();
    const isRepeatOffender = demerits.length >= 3;
    const targetedHarassment = tweets.length >= 5;
    const flaggedMentions = tweets.filter((t: any) => t.isFlagged).length;
    let patternType: "stalking" | "coordinated" | "persistent" | undefined;
    if (targetedHarassment && flaggedMentions >= 3) {
      patternType = "stalking";
    } else if (isRepeatOffender && targetedHarassment) {
      patternType = "persistent";
    }
    return {
      isRepeatOffender,
      targetedHarassment,
      victimUsername: targetedHarassment ? targetUsername : undefined,
      patternType,
    };
  } catch (error) {
    console.error("Pattern detection error:", error);
    return {
      isRepeatOffender: false,
      targetedHarassment: false,
    };
  }
}

export async function analyzeReplyContext(
  originalPost: string,
  reply: string
): Promise<{ isAppropriate: boolean; reason?: string }> {
  if (!OPENROUTER_API_KEY) {
    return { isAppropriate: true };
  }
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "user",
            content: `Analyze if this reply is appropriate and constructive given the original post. Return ONLY valid JSON:
{
  "isAppropriate": boolean,
  "reason": "explanation if inappropriate"
}
Original post: "${originalPost}"
Reply: "${reply}"`,
          },
        ],
        temperature: 0.2,
        max_tokens: 100,
      }),
    });
    const data = await response.json();
    const aiResponse = data?.choices?.[0]?.message?.content;
    const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    return {
      isAppropriate: parsed.isAppropriate ?? true,
      reason: parsed.reason,
    };
  } catch (error) {
    console.error("Reply context analysis error:", error);
    return { isAppropriate: true };
  }
}

export async function generateEmpathyScore(
  content: string
): Promise<{ score: number; suggestions: string[] }> {
  if (!OPENROUTER_API_KEY) {
    return { score: 0.5, suggestions: [] };
  }
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "user",
            content: `Rate the empathy and emotional intelligence of this post (0-1 scale). Return ONLY valid JSON:
{
  "score": number (0-1, where 1 is highly empathetic),
  "suggestions": ["ways to be more empathetic"]
}
Post: "${content}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });
    const data = await response.json();
    const aiResponse = data?.choices?.[0]?.message?.content;
    const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    return {
      score: parsed.score || 0.5,
      suggestions: parsed.suggestions || [],
    };
  } catch (error) {
    console.error("Empathy score error:", error);
    return { score: 0.5, suggestions: [] };
  }
}
