import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Tweet } from "@/lib/models/Tweet";
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
    const dbUser = await User.findById(user.userId);
    const tweets = await Tweet.find({
      isDeleted: false,
      isFlagged: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate({
        path: "author",
        match: { isSuspended: { $ne: true } },
      })
      .populate("mentions")
      .lean();
    const validTweets = tweets.filter((t: any) => t.author && !t.author.isSuspended);
    const formattedTweets = validTweets.map((t: any) => ({
      ...t,
      id: t._id?.toString?.() || String(t._id),
      author: { ...t.author, id: t.author?._id?.toString?.() || String(t.author?._id) },
      likes: Array.isArray(t.likes) ? t.likes.length : (t.likes || 0),
      retweets: Array.isArray(t.retweets) ? t.retweets.length : (t.retweets || 0),
      replies: Array.isArray(t.replies) ? t.replies.length : (t.replies || 0),
      isLiked: Array.isArray(t.likes) ? t.likes.some((l: any) => l.toString() === user.userId) : false,
      isRetweeted: Array.isArray(t.retweets) ? t.retweets.some((r: any) => r.toString() === user.userId) : false,
      isFlagged: !!t.isFlagged,
      isDeleted: !!t.isDeleted,
    }));
    return NextResponse.json({ tweets: formattedTweets });
  } catch (error: any) {
    console.error("Feed error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
