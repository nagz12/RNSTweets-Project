import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Tweet } from "@/lib/models/Tweet";
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
    const totalUsers = await User.countDocuments();
    const totalTweets = await Tweet.countDocuments();
    const totalFlaggedTweets = await Demerit.countDocuments();
    const demeritAggregation = await Demerit.aggregate([
      {
        $group: {
          _id: "$user",
          totalDemerits: { $sum: "$points" },
        },
      },
      { $sort: { totalDemerits: -1 } },
      { $limit: 10 },
    ]);
    const topDemeritUsers = await Promise.all(
      demeritAggregation.map(async (item: any) => {
        const userData = (await User.findById(item._id)
          .select("id displayName username")
          .lean()) as any;
        return {
          user: {
            id: userData?._id.toString(),
            displayName: userData?.displayName,
            username: userData?.username,
          },
          totalDemerits: item.totalDemerits,
        };
      })
    );
    const statistics = {
      totalUsers,
      totalTweets,
      totalFlaggedTweets,
      topDemeritUsers,
    };
    return NextResponse.json({ statistics });
  } catch (error) {
    console.error("Get admin statistics error:", error);
    return NextResponse.json(
      { error: "Failed to get statistics" },
      { status: 500 }
    );
  }
}
