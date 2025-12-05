import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Tweet } from "@/lib/models/Tweet";
import { Demerit } from "@/lib/models/Demerit";
import { ensureEmpathyDefaults } from "@/lib/empathy";
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
    const userDoc = await User.findOne({ username })
      .populate("followers")
      .populate("following");
    await ensureEmpathyDefaults(userDoc as any);
    const user = userDoc?.toObject() as any;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const tweetCount = await Tweet.countDocuments({
      author: user._id,
      isDeleted: false,
    });
    const recentIssues = await Demerit.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    return NextResponse.json({
      user: {
        ...user,
        id: user._id,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        tweetCount,
        empathyScore: user.empathyScore ?? 100,
        totalDemerits: user.totalDemerits ?? user.demeritPoints ?? 0,
        isSuspended: user.isSuspended ?? false,
        recentIssues: recentIssues.map((d) => ({
          reason: d.reason,
          points: d.points,
          createdAt: d.createdAt,
        })),
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
