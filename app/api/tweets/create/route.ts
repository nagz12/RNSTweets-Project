import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Tweet } from "@/lib/models/Tweet";
import { Demerit } from "@/lib/models/Demerit";
import { Notification } from "@/lib/models/Notification";
import { Hashtag } from "@/lib/models/Hashtag";
import { EmpathyLog } from "@/lib/models/EmpathyLog";
import { BullyingPattern } from "@/lib/models/BullyingPattern";
import { moderateContent, getSuspensionThreshold } from "@/lib/ai-moderation";
import { applyEmpathyViolation, ensureEmpathyDefaults } from "@/lib/empathy";
import {
  analyzeSentiment,
  enhanceContent,
  detectBullyingPattern,
  generateEmpathyScore,
} from "@/lib/ai-advanced-moderation";
import { verifyToken } from "@/lib/auth";
import { extractHashtags, extractMentions } from "@/lib/utils-twitter";
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
    const { content, media } = body;
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }
    await connectDB();
    const dbUser = await User.findById(user.userId);
    await ensureEmpathyDefaults(dbUser);
    if (dbUser?.isSuspended) {
      return NextResponse.json(
        { error: "Your account is suspended due to low empathy score." },
        { status: 403 }
      );
    }
    const mentions = extractMentions(content);
    const sentiment = await analyzeSentiment(content, mentions);
    let bullyingDetected = false;
    let patternWarning = "";
    if (mentions.length > 0 && sentiment.isPersonalAttack) {
      const targetUser = await User.findOne({ username: mentions[0] });
      if (targetUser) {
        const pattern = await detectBullyingPattern(user.userId, mentions[0]);
        if (pattern.targetedHarassment || pattern.patternType) {
          bullyingDetected = true;
          patternWarning = pattern.patternType
            ? `Detected ${pattern.patternType} behavior pattern`
            : "Repeated targeting of same user detected";
          await BullyingPattern.findOneAndUpdate(
            { offender: dbUser?._id, victim: targetUser._id },
            {
              $set: { lastIncident: new Date() },
              $inc: { incidentCount: 1 },
              $setOnInsert: {
                offender: dbUser?._id,
                victim: targetUser._id,
                patternType: pattern.patternType || "persistent",
                firstIncident: new Date(),
              },
            },
            { upsert: true, new: true }
          );
        }
      }
    }
    const moderation = await moderateContent(content);
    let contentEnhancement = null;
    if (moderation.isToxic) {
      contentEnhancement = await enhanceContent(content, moderation);
    }
    if (moderation.shouldBlock || bullyingDetected) {
      const penaltyPoints = 15;
      const { empathyScore, totalDemerits, isSuspended } = await applyEmpathyViolation(
        dbUser!._id.toString(),
        penaltyPoints
      );
      const tweet = await Tweet.create({
        content,
        author: dbUser?._id,
        isFlagged: true,
        flagReason: bullyingDetected
          ? `${patternWarning}. ${moderation.reason}`
          : moderation.reason,
        isDeleted: true,
      });
      console.log(`[MODERATION] Blocked tweet created: ${tweet._id}, User: ${dbUser?._id}, Reason: ${tweet.flagReason}, Toxicity: ${moderation.toxicityScore}`);
      await Demerit.create({
        user: dbUser?._id,
        tweet: tweet._id,
        reason: bullyingDetected ? patternWarning : moderation.reason,
        points: penaltyPoints,
        toxicityScore: moderation.toxicityScore,
        content,
      });
      if (isSuspended || empathyScore <= 35 || totalDemerits >= getSuspensionThreshold()) {
        await User.updateOne(
          { _id: dbUser?._id },
          {
            isSuspended: true,
            suspendedAt: dbUser?.suspendedAt ?? new Date(),
          }
        );
        console.log(
          `[MODERATION] User ${dbUser?._id} suspended - Demerits: ${totalDemerits}, Empathy: ${empathyScore}%`
        );
      }
      return NextResponse.json(
        {
          error: bullyingDetected
            ? `Tweet blocked: ${patternWarning}. Demerits: ${penaltyPoints}`
            : `Tweet blocked due to ${moderation.reason}. Demerits: ${penaltyPoints}`,
          suggestions: contentEnhancement?.alternativePhrasing || [],
          suggestedEdit: contentEnhancement?.suggestedEdit,
          warningMessage: contentEnhancement?.warningMessage,
        },
        { status: 400 }
      );
    }
    const empathyAnalysis = await generateEmpathyScore(content);
    let empathyWarning = null;
    if (empathyAnalysis.score < 30 && moderation.toxicityScore > 0.2) {
      empathyWarning = {
        message:
          "Your post may come across as insensitive. Consider rephrasing.",
        suggestions: empathyAnalysis.suggestions,
      };
    }
    const hashtags = extractHashtags(content);
    const mentionedUsers = await User.find({ username: { $in: mentions } });
    const mentionedUserIds = mentionedUsers.map((u) => u._id);
    const tweet = await Tweet.create({
      content,
      author: dbUser?._id,
      media: media || [],
      hashtags,
      mentions: mentionedUserIds,
    });
    for (const tag of hashtags) {
      await Hashtag.findOneAndUpdate(
        { tag },
        { $inc: { count: 1 }, trending: true },
        { upsert: true }
      );
    }
    for (const mentionedUserId of mentionedUserIds) {
      await Notification.create({
        user: mentionedUserId,
        actor: dbUser?._id,
        type: "mention",
        tweet: tweet._id,
      });
    }
    const populatedTweet = (await Tweet.findById(tweet._id)
      .populate("author")
      .lean()) as any;
    if (empathyAnalysis.score > 0) {
      // Note: EmpathyLog stores normalized 0-1 range for historical compatibility
      await EmpathyLog.create({
        user: dbUser?._id,
        tweet: tweet._id,
        empathyScore: empathyAnalysis.score / 100, // Convert to 0-1 for logging
        suggestions: empathyAnalysis.suggestions,
      });
    }
    const { calculateNewEmpathyScore } = await import("@/lib/utils-twitter");
    const currentEmpathyScore = dbUser?.empathyScore ?? 100;
    const newEmpathyScore = calculateNewEmpathyScore(
      currentEmpathyScore,
      empathyAnalysis.score,
      false
    );
    console.log(`[EMPATHY] User ${dbUser?._id} - Score: ${currentEmpathyScore}% -> ${newEmpathyScore}% (Tweet empathy: ${empathyAnalysis.score}, Was toxic: false)`);
    await User.updateOne(
      { _id: dbUser?._id },
      { empathyScore: newEmpathyScore }
    );
    if (newEmpathyScore < 35 && !dbUser?.isSuspended) {
      await User.updateOne(
        { _id: dbUser?._id },
        { isSuspended: true }
      );
      console.log(`[EMPATHY] User ${dbUser?._id} suspended due to low empathy score: ${newEmpathyScore}%`);
    }
    if (newEmpathyScore >= 100 && currentEmpathyScore < 100) {
      console.log(`[EMPATHY] User ${dbUser?._id} reached 100% empathy score!`);
    }
    return NextResponse.json({
      tweet: {
        ...populatedTweet,
        id: populatedTweet?._id,
        author: {
          ...(populatedTweet?.author as any),
          id: (populatedTweet?.author as any)?._id,
        },
        likes: (populatedTweet?.likes as any[])?.length || 0,
        retweets: (populatedTweet?.retweets as any[])?.length || 0,
        replies: (populatedTweet?.replies as any[])?.length || 0,
      },
      analysis: {
        sentiment: sentiment.sentiment,
        emotionalTone: sentiment.emotionalTone,
        empathyScore: empathyAnalysis.score,
        empathyWarning,
      },
    });
  } catch (error: any) {
    console.error("Create tweet error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create tweet" },
      { status: 500 }
    );
  }
}
