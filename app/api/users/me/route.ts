import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Demerit } from "@/lib/models/Demerit";
import { ensureEmpathyDefaults } from "@/lib/empathy";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const userToken = verifyToken(token);
    if (!userToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const userDoc = await User.findById(userToken.userId);
    await ensureEmpathyDefaults(userDoc as any);
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const recentIssues = await Demerit.find({ user: userDoc._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      id: userDoc._id.toString(),
      username: userDoc.username,
      displayName: userDoc.displayName,
      empathyScore: userDoc.empathyScore ?? 100,
      totalDemerits: (userDoc as any).totalDemerits ?? userDoc.demeritPoints ?? 0,
      isSuspended: userDoc.isSuspended ?? false,
      suspendedAt: userDoc.suspendedAt,
      recentIssues: recentIssues.map((d) => ({
        reason: d.reason,
        points: d.points,
        createdAt: d.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Fetch current user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load user" },
      { status: 500 }
    );
  }
}

