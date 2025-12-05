import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Message } from "@/lib/models/Message";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const message = await Message.findById(params.id);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    if (message.sender.toString() !== user.userId.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Message.deleteOne({ _id: message._id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete message error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete message" },
      { status: 500 }
    );
  }
}

