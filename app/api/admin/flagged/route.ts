import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Demerit } from "@/lib/models/Demerit";
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
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!user.email.includes("admin") && user.email !== "admin@rnsit.ac.in") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    const flaggedTweets = await Demerit.find()
      .populate("user", "displayName username")
      .populate("tweet", "content")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const formattedFlaggedTweets = flaggedTweets.map((demerit: any) => ({
      id: demerit._id.toString(),
      reason: demerit.reason,
      points: demerit.points,
      toxicityScore: demerit.toxicityScore,
      content: demerit.tweet?.content || "Content deleted",
      user: {
        displayName: demerit.user?.displayName,
        username: demerit.user?.username,
      },
      createdAt: demerit.createdAt,
    }));
    return NextResponse.json({ flaggedTweets: formattedFlaggedTweets });
  } catch (error) {
    console.error("Get flagged tweets error:", error);
    return NextResponse.json(
      { error: "Failed to get flagged tweets" },
      { status: 500 }
    );
  }
}
