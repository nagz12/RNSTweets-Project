import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";
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
    const reply = await Tweet.findById(params.id);
    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }
    if (reply.author.toString() !== user.userId.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    reply.isDeleted = true;
    await reply.save();

    if (reply.parentTweet) {
      await Tweet.updateOne(
        { _id: reply.parentTweet },
        { $pull: { replies: reply._id } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete reply error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete reply" },
      { status: 500 }
    );
  }
}

