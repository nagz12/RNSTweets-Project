import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Notification } from "@/lib/models/Notification";
import { verifyToken } from "@/lib/auth";
export async function GET(request: NextRequest) {
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
    await connectDB();
    const notifications = await Notification.find({ user: user.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("actor")
      .populate("tweet")
      .lean();
    const formattedNotifications = notifications.map((n: any) => ({
      ...n,
      id: n._id,
      actor: { ...n.actor, id: n.actor._id },
    }));
    return NextResponse.json({ notifications: formattedNotifications });
  } catch (error: any) {
    console.error("Notifications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
