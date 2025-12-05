import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifyToken } from "@/lib/auth";
import { ensureEmpathyDefaults } from "@/lib/empathy";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const currentUser = token ? verifyToken(token) : null;

    await connectDB();
    const userDoc = await User.findOne({ username: username.toLowerCase() })
      .populate("followers")
      .populate("following");

    await ensureEmpathyDefaults(userDoc as any);

    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const followersCount = userDoc.followers?.length || 0;
    const followingCount = userDoc.following?.length || 0;
    const isOwnProfile = currentUser?.userId
      ? userDoc._id.toString() === currentUser.userId.toString()
      : false;
    const isFollowing = !!currentUser?.userId
      ? userDoc.followers?.some((f: any) => f.toString() === currentUser.userId)
      : false;

    return NextResponse.json({
      id: userDoc._id.toString(),
      name: userDoc.displayName,
      username: userDoc.username,
      bio: userDoc.bio || null,
      location: userDoc.location || null,
      website: userDoc.website || null,
      avatarUrl: userDoc.profilePictureUrl || null,
      bannerUrl: userDoc.bannerUrl || null,
      joinedAt: userDoc.createdAt,
      followersCount,
      followingCount,
      isFollowing,
      isOwnProfile,
    });
  } catch (error: any) {
    console.error("Get user profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

