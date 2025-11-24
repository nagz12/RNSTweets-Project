import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";
import { Notification } from "@/lib/models/Notification";
import { verifyToken } from "@/lib/auth";
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
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
    }
    if (!tweet.likes.includes(user.userId)) {
      tweet.likes.push(user.userId);
      await tweet.save();
      await Notification.create({
        user: tweet.author,
        actor: user.userId,
        type: "like",
        tweet: tweet._id,
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Like tweet error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to like tweet" },
      { status: 500 }
    );
  }
}
