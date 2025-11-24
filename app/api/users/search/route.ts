import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifyToken } from "@/lib/auth";
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    let currentUserId = null;
    if (token) {
      const user = verifyToken(token);
      currentUserId = user?.userId;
    }
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }
    await connectDB();
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { displayName: { $regex: query, $options: "i" } },
      ],
      isSuspended: { $ne: true },
    })
      .select("username displayName bio profilePictureUrl bannerUrl isVerified followers following")
      .limit(20)
      .lean();
    const currentUser = currentUserId
      ? await User.findById(currentUserId).select("following").lean()
      : null;
    const followingIds = currentUser?.following?.map((id: any) => id.toString()) || [];
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
    return NextResponse.json({ users: formattedUsers });
  } catch (error: any) {
    console.error("Search users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search users" },
      { status: 500 }
    );
  }
}
