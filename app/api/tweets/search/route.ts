import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";
import { User } from "@/lib/models/User";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }
    await connectDB();
    const tweets = await Tweet.find({
      content: { $regex: query, $options: "i" },
      isDeleted: false,
      isFlagged: { $ne: true },
    })
      .populate({
        path: "author",
        match: { isSuspended: { $ne: true } },
        select: "id displayName username profilePictureUrl",
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { displayName: { $regex: query, $options: "i" } },
      ],
      isSuspended: { $ne: true },
    })
      .select("username displayName bio profilePictureUrl bannerUrl isVerified followers following")
      .limit(10)
      .lean();
    const currentUser = await User.findById(decoded.userId).select("following").lean();
    const followingIds = currentUser?.following?.map((id: any) => id.toString()) || [];
    const validTweets = tweets.filter((tweet: any) => tweet.author && !tweet.author.isSuspended);
    const tweetsWithLikeStatus = validTweets.map((tweet: any) => ({
      id: tweet._id.toString(),
      content: tweet.content,
      author: {
        id: tweet.author._id.toString(),
        displayName: tweet.author.displayName,
        username: tweet.author.username,
        avatar: tweet.author.profilePictureUrl,
      },
      createdAt: tweet.createdAt,
      likes: tweet.likes?.length || 0,
      retweets: tweet.retweets?.length || 0,
      replies: tweet.replies?.length || 0,
      viewCount: tweet.viewCount || 0,
      isLiked: tweet.likes?.some(
        (likeId: any) => likeId.toString() === decoded.userId
      ),
      isRetweeted: tweet.retweets?.some(
        (retweetId: any) => retweetId.toString() === decoded.userId
      ),
      isFlagged: tweet.isFlagged || false,
      isDeleted: tweet.isDeleted || false,
    }));
    const formattedUsers = users.map((user: any) => ({
      id: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      bio: user.bio || "",
      avatar: user.profilePictureUrl,
      banner: user.bannerUrl,
      isVerified: user.isVerified || false,
      followerCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      isFollowing: followingIds.includes(user._id.toString()),
    }));
    return NextResponse.json({ tweets: tweetsWithLikeStatus, users: formattedUsers });
  } catch (error) {
    console.error("Search tweets error:", error);
    return NextResponse.json(
      { error: "Failed to search tweets" },
      { status: 500 }
    );
  }
}
