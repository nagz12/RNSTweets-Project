import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { enhanceContent } from "@/lib/ai-advanced-moderation";
import { moderateContent } from "@/lib/ai-moderation";
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const { content } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }
    const moderation = await moderateContent(content);
    const enhancement = await enhanceContent(content, moderation);
    return NextResponse.json({
      isToxic: moderation.isToxic,
      toxicityScore: moderation.toxicityScore,
      shouldBlock: moderation.shouldBlock,
      ...enhancement,
    });
  } catch (error) {
    console.error("Content check error:", error);
    return NextResponse.json(
      { error: "Failed to check content" },
      { status: 500 }
    );
  }
}
