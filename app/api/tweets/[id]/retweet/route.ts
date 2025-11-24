import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";
import { User } from "@/lib/models/User";
import { Notification } from "@/lib/models/Notification";

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

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
    }

    const userIdStr = user.userId.toString();
    const retweetIndex = tweet.retweets.findIndex(
      (id: any) => id.toString() === userIdStr
    );

    let isRetweeted = false;

    if (retweetIndex > -1) {
      // Un-retweet
      tweet.retweets.splice(retweetIndex, 1);
    } else {
      // Retweet
      tweet.retweets.push(user.userId);
      isRetweeted = true;

      // Create notification for tweet author (if not self-retweet)
      if (tweet.author.toString() !== userIdStr) {
        await Notification.create({
          user: tweet.author,
          actor: user.userId,
          type: "retweet",
          tweet: tweetId,
          isRead: false,
        });
      }
    }

    await tweet.save();

    return NextResponse.json({
      success: true,
      isRetweeted,
      retweetsCount: tweet.retweets.length,
    });
  } catch (error) {
    console.error("Retweet error:", error);
    return NextResponse.json(
      { error: "Failed to retweet/unretweet" },
      { status: 500 }
    );
  }
}
