import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Bookmark } from "@/lib/models/Bookmark";
import { verifyToken } from "@/lib/auth";
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    await connectDB();
    const bookmarks = await Bookmark.find({ user: user.userId })
      .sort({ createdAt: -1 })
      .populate("tweet")
      .lean();
    const formattedBookmarks = bookmarks.map((b: any) => ({
      ...b,
      id: b._id,
    }));
    return NextResponse.json({ bookmarks: formattedBookmarks });
  } catch (error: any) {
    console.error("Bookmarks error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const body = await request.json();
    const { tweetId } = body;
    await connectDB();
    await Bookmark.findOneAndUpdate(
      { user: user.userId, tweet: tweetId },
      { user: user.userId, tweet: tweetId },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Bookmark error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to bookmark tweet" },
      { status: 500 }
    );
  }
}
