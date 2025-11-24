import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    await connectDB();
    const tweets = await Tweet.find({
      author: userId,
      isDeleted: false,
      isFlagged: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate({
        path: "author",
        match: { isSuspended: { $ne: true } },
      })
      .lean();
    const validTweets = tweets.filter((t: any) => t.author && !t.author.isSuspended);
    const formattedTweets = validTweets.map((t: any) => ({
      ...t,
      id: t._id,
      author: { ...t.author, id: t.author._id },
      likes: t.likes.length,
      retweets: t.retweets.length,
      replies: t.replies.length,
      isFlagged: t.isFlagged || false,
      isDeleted: t.isDeleted || false,
    }));
    return NextResponse.json({ tweets: formattedTweets });
  } catch (error: any) {
    console.error("User tweets error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user tweets" },
      { status: 500 }
    );
  }
}
