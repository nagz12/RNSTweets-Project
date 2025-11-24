import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Tweet } from "@/lib/models/Tweet";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }
    await connectDB();
    const user = (await User.findOne({ username })
      .populate("followers")
      .populate("following")
      .lean()) as any;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const tweetCount = await Tweet.countDocuments({
      author: user._id,
      isDeleted: false,
    });
    return NextResponse.json({
      user: {
        ...user,
        id: user._id,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        tweetCount,
      },
    });
  } catch (error: any) {
    console.error("User profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
