import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";
import { User } from "@/lib/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 20);
    const page = Number(searchParams.get("page") || 1);
    const skip = (page - 1) * limit;

    await connectDB();
    const userDoc = await User.findOne({ username: params.username.toLowerCase() });
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const currentUser = token ? verifyToken(token) : null;

    const replies = await Tweet.find({
      author: userDoc._id,
      parentTweet: { $exists: true },
      isDeleted: false,
      isFlagged: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author")
      .lean();

    const formatted = replies.map((t: any) => ({
      id: t._id.toString(),
      content: t.content,
      createdAt: t.createdAt,
      isFlagged: t.isFlagged || false,
      isDeleted: t.isDeleted || false,
      author: {
        id: t.author._id.toString(),
        displayName: t.author.displayName,
        username: t.author.username,
        avatar: t.author.profilePictureUrl || t.author.avatar || null,
      },
      likes: t.likes?.length || 0,
      retweets: t.retweets?.length || 0,
      replies: t.replies?.length || 0,
      isLiked: t.likes?.some((l: any) => l.toString() === currentUser?.userId) || false,
      isRetweeted:
        t.retweets?.some((r: any) => r.toString() === currentUser?.userId) || false,
    }));

    return NextResponse.json({ replies: formatted, page, limit });
  } catch (error: any) {
    console.error("User replies error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user replies" },
      { status: 500 }
    );
  }
}

