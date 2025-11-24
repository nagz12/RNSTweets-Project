import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Message } from "@/lib/models/Message";
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
    await connectDB();
    const messages = await Message.find({
      $or: [{ sender: decoded.userId }, { recipient: decoded.userId }],
    })
      .populate("sender", "id displayName username avatar")
      .populate("recipient", "id displayName username avatar")
      .sort({ createdAt: -1 })
      .lean();
    const conversationsMap = new Map();
    for (const msg of messages as any[]) {
      const partnerId =
        msg.sender._id.toString() === decoded.userId
          ? msg.recipient._id.toString()
          : msg.sender._id.toString();
      if (!conversationsMap.has(partnerId)) {
        const partner =
          msg.sender._id.toString() === decoded.userId
            ? msg.recipient
            : msg.sender;
        conversationsMap.set(partnerId, {
          user: {
            id: partner._id.toString(),
            displayName: partner.displayName,
            username: partner.username,
            avatar: partner.avatar,
          },
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      }
    }
    for (const [partnerId, conv] of conversationsMap.entries()) {
      const unreadCount = await Message.countDocuments({
        sender: partnerId,
        recipient: decoded.userId,
        isRead: false,
      });
      conv.unreadCount = unreadCount;
    }
    const conversations = Array.from(conversationsMap.values());
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json(
      { error: "Failed to get conversations" },
      { status: 500 }
    );
  }
}
