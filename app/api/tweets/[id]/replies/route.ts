import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    const tweetId = params.id;

    await connectDB();

    // Filter out flagged and deleted replies - these are blocked by moderation
    // Support both parentTweet and replyTo field names for compatibility
    const replies = await Tweet.find({
      $or: [
        { parentTweet: tweetId },
        { replyTo: tweetId }, // Legacy field name support
      ],
      isDeleted: false,
      isFlagged: { $ne: true }, // Exclude flagged/blocked replies
    })
      .populate({
        path: "author",
        match: { isSuspended: { $ne: true } }, // Exclude suspended users
        select: "_id displayName username profilePictureUrl",
      })
      .sort({ createdAt: -1 })
      .lean();

    // Filter out replies with null authors (suspended users or invalid)
    const validReplies = replies.filter((reply: any) => reply.author && !reply.author.isSuspended);

    const formattedReplies = validReplies.map((reply: any) => ({
      id: reply._id.toString(),
      content: reply.content,
      isFlagged: reply.isFlagged || false,
      isDeleted: reply.isDeleted || false,
      author: {
        id: reply.author._id.toString(),
        displayName: reply.author.displayName,
        username: reply.author.username,
        avatar: reply.author.profilePictureUrl || reply.author.avatar || null,
      },
      createdAt: reply.createdAt,
      likes: reply.likes?.length || 0,
      retweets: reply.retweets?.length || 0,
      replies: reply.replies?.length || 0,
      isLiked: reply.likes?.some(
        (likeId: any) => likeId.toString() === user.userId
      ),
      isRetweeted: reply.retweets?.some(
        (retweetId: any) => retweetId.toString() === user.userId
      ),
    }));

    return NextResponse.json({ replies: formattedReplies });
  } catch (error) {
    console.error("Get replies error:", error);
    return NextResponse.json(
      { error: "Failed to get replies" },
      { status: 500 }
    );
  }
}
