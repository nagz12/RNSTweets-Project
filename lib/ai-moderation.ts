const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
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
}
export async function moderateContent(
  content: string
): Promise<ModerationResult> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
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
    });
    const text = await response.text();
    if (!response.ok) {
      console.error(`OpenRouter API error: ${response.status}`, text);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse OpenRouter response as JSON:", text);
      throw new Error("Invalid response from moderation service");
    }
    const aiResponse = data?.choices?.[0]?.message?.content;
    let parsed;
    try {
      if (!aiResponse || typeof aiResponse !== "string") {
        throw new Error("Invalid AI response");
      }
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    } catch {
      parsed = {
        isToxic: false,
        toxicityScore: 0,
        categories: [],
        reason: "Could not parse response",
      };
    }
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
    return {
      isToxic: isToxicContent,
      toxicityScore,
      reason:
        parsed.reason ||
        parsed.categories?.join(", ") ||
        "Potentially harmful content",
      points,
      shouldBlock: isToxicContent || toxicityScore >= 0.4,
    };
  } catch (error) {
    console.error("Moderation error:", error);
    console.error("Failed to moderate content:", content);
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
