import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
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
    const { userId, targetUserId } = body;
    const targetId = userId || targetUserId;
    if (!targetId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    if (targetId === user.userId) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }
    await connectDB();
    const currentUser = await User.findById(user.userId);
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const isAlreadyFollowing = currentUser?.following?.some(
      (id: any) => id.toString() === targetId
    );
    if (isAlreadyFollowing) {
      return NextResponse.json({ success: true, alreadyFollowing: true });
    }
    await User.updateOne(
      { _id: user.userId },
      { $addToSet: { following: targetId } }
    );
    await User.updateOne(
      { _id: targetId },
      { $addToSet: { followers: user.userId } }
    );
    await Notification.create({
      user: targetId,
      actor: user.userId,
      type: "follow",
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Follow user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to follow user" },
      { status: 500 }
    );
  }
}
