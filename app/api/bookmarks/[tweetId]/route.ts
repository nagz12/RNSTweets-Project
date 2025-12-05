import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Bookmark } from "@/lib/models/Bookmark";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { tweetId: string } }
) {
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
    await connectDB();
    await Bookmark.deleteOne({ user: user.userId, tweet: params.tweetId });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete bookmark error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}

