import { moderateContent } from "./ai-moderation";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
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
    throw new Error("OPENROUTER_API_KEY is not set");
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
    });
    const data = await response.json();
    const aiResponse = data?.choices?.[0]?.message?.content;
    const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    return {
      sentiment: parsed.sentiment || "neutral",
      emotionalTone: parsed.emotionalTone || [],
      targetedUser: mentions[0],
      isPersonalAttack: parsed.isPersonalAttack || false,
      confidence: parsed.confidence || 0.5,
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
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
    });
    const data = await response.json();
    const aiResponse = data?.choices?.[0]?.message?.content;
    const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    return {
      shouldWarn: true,
      warningMessage:
        parsed.warningMessage || "This content may be harmful to others",
      suggestedEdit: parsed.suggestedEdit,
      alternativePhrasing: parsed.alternativePhrasing || [],
    };
  } catch (error) {
    console.error("Content enhancement error:", error);
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
