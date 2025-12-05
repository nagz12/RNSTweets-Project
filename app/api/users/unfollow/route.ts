import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifyToken } from "@/lib/auth";
import { ensureEmpathyDefaults } from "@/lib/empathy";
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
    await connectDB();
    const currentUser = await User.findById(user.userId);
    await ensureEmpathyDefaults(currentUser);
    if (currentUser?.isSuspended) {
      return NextResponse.json(
        { error: "Your account is suspended due to low empathy score." },
        { status: 403 }
      );
    }
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await User.updateOne(
      { _id: user.userId },
      { $pull: { following: targetId } }
    );
    await User.updateOne(
      { _id: targetId },
      { $pull: { followers: user.userId } }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Unfollow user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to unfollow user" },
      { status: 500 }
    );
  }
}
