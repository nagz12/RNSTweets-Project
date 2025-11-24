import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Message } from "@/lib/models/Message";
import { User } from "@/lib/models/User";
import { Notification } from "@/lib/models/Notification";

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
    const conversationWith = searchParams.get("conversationWith");

    if (!conversationWith) {
      return NextResponse.json(
        { error: "conversationWith parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const messages = await Message.find({
      $or: [
        { sender: decoded.userId, recipient: conversationWith },
        { sender: conversationWith, recipient: decoded.userId },
      ],
    })
      .populate("sender", "_id displayName username profilePictureUrl")
      .populate("recipient", "_id displayName username profilePictureUrl")
      .sort({ createdAt: 1 })
      .lean();

    // Filter out messages with null sender/recipient (shouldn't happen but be safe)
    const validMessages = messages.filter((msg: any) => msg.sender && msg.recipient);

    // Mark messages as read
    await Message.updateMany(
      {
        sender: conversationWith,
        recipient: decoded.userId,
        isRead: false,
      },
      { isRead: true }
    );

    const formattedMessages = validMessages.map((msg: any) => ({
      id: msg._id.toString(),
      sender: {
        id: msg.sender._id.toString(),
        displayName: msg.sender.displayName,
        username: msg.sender.username,
        avatar: msg.sender.profilePictureUrl || msg.sender.avatar,
      },
      recipient: {
        id: msg.recipient._id.toString(),
        displayName: msg.recipient.displayName,
        username: msg.recipient.username,
        avatar: msg.recipient.profilePictureUrl || msg.recipient.avatar,
      },
      content: msg.content,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Failed to get messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const { recipientId, content } = await req.json();

    if (!recipientId || !content || !content.trim()) {
      return NextResponse.json(
        { error: "recipientId and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      );
    }

    // Prevent sending message to yourself
    if (decoded.userId === recipientId) {
      return NextResponse.json(
        { error: "You cannot send a message to yourself" },
        { status: 400 }
      );
    }

    const message = await Message.create({
      sender: decoded.userId,
      recipient: recipientId,
      content: content.trim(),
      isRead: false,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "_id displayName username profilePictureUrl")
      .populate("recipient", "_id displayName username profilePictureUrl")
      .lean();

    if (!populatedMessage) {
      return NextResponse.json(
        { error: "Failed to create message" },
        { status: 500 }
      );
    }

    // Validate populated fields
    if (!(populatedMessage as any).sender || !(populatedMessage as any).recipient) {
      console.error("Failed to populate sender or recipient:", populatedMessage);
      return NextResponse.json(
        { error: "Failed to load user information. Please check if the recipient user exists." },
        { status: 500 }
      );
    }

    // Create notification for recipient (don't fail if notification creation fails)
    try {
      await Notification.create({
        user: recipientId,
        actor: decoded.userId,
        type: "message",
        isRead: false,
      });
    } catch (notifError) {
      console.error("Failed to create notification (non-fatal):", notifError);
      // Continue even if notification creation fails
    }

    const formattedMessage = {
      id: (populatedMessage as any)._id.toString(),
      sender: {
        id: (populatedMessage as any).sender._id.toString(),
        displayName: (populatedMessage as any).sender.displayName,
        username: (populatedMessage as any).sender.username,
        avatar: (populatedMessage as any).sender.profilePictureUrl || (populatedMessage as any).sender.avatar || null,
      },
      recipient: {
        id: (populatedMessage as any).recipient._id.toString(),
        displayName: (populatedMessage as any).recipient.displayName,
        username: (populatedMessage as any).recipient.username,
        avatar: (populatedMessage as any).recipient.profilePictureUrl || (populatedMessage as any).recipient.avatar || null,
      },
      content: (populatedMessage as any).content,
      isRead: (populatedMessage as any).isRead,
      createdAt: (populatedMessage as any).createdAt,
    };

    return NextResponse.json({ message: formattedMessage });
  } catch (error: any) {
    console.error("Send message error:", error);
    const errorMessage = error?.message || "Failed to send message";
    return NextResponse.json(
      { error: errorMessage },
      { status: error?.statusCode || 500 }
    );
  }
}
