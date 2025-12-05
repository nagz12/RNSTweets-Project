import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";
import { User } from "@/lib/models/User";
import { Notification } from "@/lib/models/Notification";
import { Demerit } from "@/lib/models/Demerit";
import { EmpathyLog } from "@/lib/models/EmpathyLog";
import { BullyingPattern } from "@/lib/models/BullyingPattern";
import { moderateContent, getSuspensionThreshold } from "@/lib/ai-moderation";
import { applyEmpathyViolation, ensureEmpathyDefaults } from "@/lib/empathy";
import {
  analyzeSentiment,
  enhanceContent,
  detectBullyingPattern,
  generateEmpathyScore,
  analyzeReplyContext,
} from "@/lib/ai-advanced-moderation";
import { extractHashtags, extractMentions } from "@/lib/utils-twitter";

export async function POST(req: NextRequest) {
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

    const { tweetId, content } = await req.json();

    if (!tweetId || !content || !content.trim()) {
      return NextResponse.json(
        { error: "Tweet ID and content are required" },
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

    const originalTweet = await Tweet.findById(tweetId);
    if (!originalTweet) {
      return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
    }

    // AI: Check reply context appropriateness
    const contextCheck = await analyzeReplyContext(
      originalTweet.content,
      content
    );

    // Extract mentions early for pattern detection
    const mentions = extractMentions(content);

    // AI: Sentiment Analysis
    const sentiment = await analyzeSentiment(content, mentions);

    // AI: Check for bullying patterns
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

    // Run moderation
    const moderation = await moderateContent(content);

    // Get AI enhancement if toxic
    let contentEnhancement = null;
    if (moderation.isToxic) {
      contentEnhancement = await enhanceContent(content, moderation);
    }

    // Block if toxic or bullying detected or inappropriate context
    if (
      moderation.shouldBlock ||
      bullyingDetected ||
      !contextCheck.isAppropriate
    ) {
      const penaltyPoints = 15;
      const { empathyScore, totalDemerits, isSuspended } = await applyEmpathyViolation(
        dbUser!._id.toString(),
        penaltyPoints
      );

      // Log moderation decision for blocked reply
      const reason = bullyingDetected
        ? patternWarning
        : !contextCheck.isAppropriate
        ? contextCheck.reason || "Inappropriate reply context"
        : moderation.reason;

      console.log(`[MODERATION] Blocked reply attempt: User: ${dbUser?._id}, ParentTweet: ${tweetId}, Reason: ${reason}, Toxicity: ${moderation.toxicityScore}`);

      await Demerit.create({
        user: dbUser?._id,
        tweet: tweetId,
        reason,
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
            ? `Reply blocked: ${patternWarning}. Demerits: ${penaltyPoints}`
            : !contextCheck.isAppropriate
            ? `Reply blocked: ${contextCheck.reason}`
            : `Reply blocked due to ${moderation.reason}. Demerits: ${penaltyPoints}`,
          suggestions: contentEnhancement?.alternativePhrasing || [],
          suggestedEdit: contentEnhancement?.suggestedEdit,
        },
        { status: 400 }
      );
    }

    // Generate empathy score
    const empathyAnalysis = await generateEmpathyScore(content);

    // Create reply tweet
    const hashtags = extractHashtags(content);
    const mentionedUsers = await User.find({ username: { $in: mentions } });
    const mentionedUserIds = mentionedUsers.map((u) => u._id);

    const reply = await Tweet.create({
      content,
      author: dbUser?._id,
      hashtags,
      mentions: mentionedUserIds,
      parentTweet: tweetId, // Use correct field name from schema
    });

    // Update original tweet's reply count
    await Tweet.findByIdAndUpdate(tweetId, {
      $push: { replies: reply._id },
    });

    // Create notification for original tweet author (if not self-reply)
    if (originalTweet.author.toString() !== user.userId.toString()) {
      await Notification.create({
        user: originalTweet.author,
        actor: user.userId,
        type: "reply",
        tweet: reply._id,
        isRead: false,
      });
    }

    // Notify mentioned users
    for (const mentionedUserId of mentionedUserIds) {
      if (mentionedUserId.toString() !== user.userId.toString()) {
        await Notification.create({
          user: mentionedUserId,
          actor: user.userId,
          type: "mention",
          tweet: reply._id,
          isRead: false,
        });
      }
    }

    // Log empathy score
    if (empathyAnalysis.score > 0) {
      await EmpathyLog.create({
        user: dbUser?._id,
        tweet: reply._id,
        empathyScore: empathyAnalysis.score,
        suggestions: empathyAnalysis.suggestions,
      });
    }

    // Update user's overall empathy score based on this reply
    // IMPORTANT: Only pass isToxic=false for replies that passed moderation
    // Since we're past the moderation block check, this reply is NOT toxic
    const { calculateNewEmpathyScore } = await import("@/lib/utils-twitter");
    const currentEmpathyScore = dbUser?.empathyScore ?? 100; // Default to 100 if not set
    const newEmpathyScore = calculateNewEmpathyScore(
      currentEmpathyScore,
      empathyAnalysis.score,
      false // Reply passed moderation, so it's NOT toxic
    );

    console.log(`[EMPATHY] User ${dbUser?._id} - Score: ${currentEmpathyScore}% -> ${newEmpathyScore}% (Reply empathy: ${empathyAnalysis.score}, Was toxic: false)`);

    // Update user's empathy score
    await User.updateOne(
      { _id: dbUser?._id },
      { empathyScore: newEmpathyScore }
    );

    // Check if empathy score dropped below 35% - suspend account
    if (newEmpathyScore < 35 && !dbUser?.isSuspended) {
      await User.updateOne(
        { _id: dbUser?._id },
        { isSuspended: true }
      );
      console.log(`[EMPATHY] User ${dbUser?._id} suspended due to low empathy score: ${newEmpathyScore}%`);
    }

    // Log if empathy score reached 100%
    if (newEmpathyScore >= 100 && currentEmpathyScore < 100) {
      console.log(`[EMPATHY] User ${dbUser?._id} reached 100% empathy score!`);
    }

    const populatedReply = (await Tweet.findById(reply._id)
      .populate("author", "id displayName username avatar")
      .lean()) as any;

    return NextResponse.json({
      reply: {
        id: populatedReply._id.toString(),
        content: populatedReply.content,
        author: {
          id: populatedReply.author._id.toString(),
          displayName: populatedReply.author.displayName,
          username: populatedReply.author.username,
          avatar: populatedReply.author.avatar,
        },
        createdAt: populatedReply.createdAt,
        likes: populatedReply.likes?.length || 0,
        retweets: populatedReply.retweets?.length || 0,
        replies: populatedReply.replies?.length || 0,
      },
      analysis: {
        sentiment: sentiment.sentiment,
        empathyScore: empathyAnalysis.score,
        contextAppropriate: contextCheck.isAppropriate,
      },
    });
  } catch (error) {
    console.error("Reply error:", error);
    return NextResponse.json(
      { error: "Failed to post reply" },
      { status: 500 }
    );
  }
}
