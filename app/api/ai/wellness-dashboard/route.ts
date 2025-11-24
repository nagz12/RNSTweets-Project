import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { EmpathyLog } from "@/lib/models/EmpathyLog";
import { Demerit } from "@/lib/models/Demerit";
import { BullyingPattern } from "@/lib/models/BullyingPattern";
export async function GET(req: NextRequest) {
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
    const empathyLogs = await EmpathyLog.find({ user: user.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    const avgEmpathyScore =
      empathyLogs.length > 0
        ? empathyLogs.reduce((sum, log: any) => sum + log.empathyScore, 0) /
          empathyLogs.length
        : 0;
    const demerits = await Demerit.find({ user: user.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const totalDemerits = demerits.reduce((sum, d: any) => sum + d.points, 0);
    const asOffender = await BullyingPattern.find({
      offender: user.userId,
      isResolved: false,
    })
      .populate("victim", "username displayName")
      .lean();
    const asVictim = await BullyingPattern.find({
      victim: user.userId,
      isResolved: false,
    })
      .populate("offender", "username displayName")
      .lean();
    const recommendations = [];
    if (avgEmpathyScore < 0.4) {
      recommendations.push({
        type: "empathy",
        message:
          "Try to consider others' feelings more in your posts. Practice active listening.",
        priority: "high",
      });
    }
    if (totalDemerits > 20) {
      recommendations.push({
        type: "tone",
        message:
          "Your recent posts have been flagged. Consider using more constructive language.",
        priority: "high",
      });
    }
    if (asOffender.length > 0) {
      recommendations.push({
        type: "behavior",
        message:
          "Repeated negative interactions detected. Please be respectful to all users.",
        priority: "critical",
      });
    }
    if (avgEmpathyScore >= 0.7 && totalDemerits === 0) {
      recommendations.push({
        type: "positive",
        message: "Great job maintaining positive and empathetic communication!",
        priority: "low",
      });
    }
    return NextResponse.json({
      empathyScore: avgEmpathyScore,
      totalDemerits,
      recentDemerits: demerits.length,
      bullyingPatternsAsOffender: asOffender.length,
      bullyingPatternsAsVictim: asVictim.length,
      recommendations,
      detailedPatterns: {
        asOffender: asOffender.map((p: any) => ({
          victim: p.victim?.username,
          type: p.patternType,
          incidentCount: p.incidentCount,
        })),
        asVictim: asVictim.map((p: any) => ({
          offender: p.offender?.username,
          type: p.patternType,
          incidentCount: p.incidentCount,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to get dashboard data" },
      { status: 500 }
    );
  }
}
