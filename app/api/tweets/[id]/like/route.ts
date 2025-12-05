import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";
import { User } from "@/lib/models/User";
import { Notification } from "@/lib/models/Notification";
import { ensureEmpathyDefaults } from "@/lib/empathy";

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

    const { tweetId } = await req.json();

    if (!tweetId) {
      return NextResponse.json(
        { error: "Tweet ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const dbUser = await User.findById(user.userId);
    await ensureEmpathyDefaults(dbUser);
    if (dbUser?.isSuspended) {
      return NextResponse.json(
        { error: "Your account is suspended due to low empathy score." },
        { status: 403 }
      );
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
    }

    const userIdStr = user.userId.toString();
    const likeIndex = tweet.likes.findIndex(
      (id: any) => id.toString() === userIdStr
    );

    let isLiked = false;

    if (likeIndex > -1) {
      // Unlike
      tweet.likes.splice(likeIndex, 1);
    } else {
      // Like
      tweet.likes.push(user.userId);
      isLiked = true;

      // Create notification for tweet author (if not self-like)
      if (tweet.author.toString() !== userIdStr) {
        await Notification.create({
          user: tweet.author,
          actor: user.userId,
          type: "like",
          tweet: tweetId,
          isRead: false,
        });
      }
    }

    await tweet.save();

    return NextResponse.json({
      success: true,
      isLiked,
      likesCount: tweet.likes.length,
    });
  } catch (error) {
    console.error("Like tweet error:", error);
    return NextResponse.json(
      { error: "Failed to like/unlike tweet" },
      { status: 500 }
    );
  }
}
