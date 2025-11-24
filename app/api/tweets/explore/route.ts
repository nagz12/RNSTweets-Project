import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";
import { verifyToken } from "@/lib/auth";
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    let userId = null;
    if (token) {
      const user = verifyToken(token);
      userId = user?.userId;
    }
    await connectDB();
    const tweets = await Tweet.find({
      isDeleted: false,
      isFlagged: { $ne: true },
    })
      .populate({
        path: "author",
        match: { isSuspended: { $ne: true } },
      })
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(50)
      .lean();
    const validTweets = tweets.filter((t: any) => t.author && !t.author.isSuspended);
    const formattedTweets = validTweets.map((t: any) => ({
      ...t,
      id: t._id,
      author: { ...t.author, id: t.author._id },
      likes: t.likes.length,
      retweets: t.retweets.length,
      replies: t.replies.length,
      isLiked: userId && t.likes.some((l: any) => l.toString() === userId),
      isRetweeted:
        userId && t.retweets.some((r: any) => r.toString() === userId),
      isFlagged: t.isFlagged || false,
      isDeleted: t.isDeleted || false,
    }));
    return NextResponse.json({ tweets: formattedTweets });
  } catch (error: any) {
    console.error("Explore error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch explore feed" },
      { status: 500 }
    );
  }
}
