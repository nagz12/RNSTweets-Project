import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Tweet } from "@/lib/models/Tweet";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

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
    let incomingId = params.id;
    console.log(`[DELETE-TWEET] incoming id (params):`, incomingId, `type:`, typeof incomingId);

    // If the incoming id is missing or clearly invalid, try to recover from the request body
    let bodyCandidate: any = null;
    if (!incomingId || String(incomingId) === "undefined" || String(incomingId) === "null") {
      try {
        bodyCandidate = await req.json();
        console.log("[DELETE-TWEET] parsed bodyCandidate:", bodyCandidate);
        const fromBody = bodyCandidate?.id || bodyCandidate?._id || bodyCandidate?.tweetId;
        if (fromBody) {
          incomingId = fromBody;
          console.log("[DELETE-TWEET] recovered id from body:", incomingId);
        }
      } catch (e) {
        // not JSON or empty body
      }
    }

    // If still not present, try to parse the id from the request URL path
    try {
      if (!incomingId || String(incomingId) === "undefined" || String(incomingId) === "null") {
        const parsedUrl = new URL(req.url);
        const pathname = parsedUrl.pathname || "";
        const parts = pathname.split("/").filter(Boolean);
        const last = parts[parts.length - 1];
        if (last) {
          incomingId = decodeURIComponent(last);
          console.log("[DELETE-TWEET] recovered id from URL path:", incomingId);
        }
      }
    } catch (e) {
      // ignore URL parse errors
    }

    // Log request metadata to help find which client sent the invalid id
    const referer = req.headers.get("referer") || req.headers.get("referrer");
    const userAgent = req.headers.get("user-agent");
    console.log("[DELETE-TWEET] request.url:", req.url, "referer:", referer, "userAgent:", userAgent);

    // Try several strategies to locate the tweet to be resilient to id formats
    let tweet = null;
    const triedCandidates: Array<string> = [];

    // 1) Direct lookup by id string
    try {
      triedCandidates.push(String(incomingId));
      tweet = await Tweet.findById(incomingId);
    } catch (err) {
      console.warn("Direct findById failed:", (err as any)?.message || err);
    }

    // 2) If not found and looks like an ObjectId, try converting explicitly
    const isValidObjectId = mongoose.Types.ObjectId.isValid(incomingId);
    if (!tweet && isValidObjectId) {
      try {
        const objId = new mongoose.Types.ObjectId(incomingId);
        triedCandidates.push(String(objId));
        tweet = await Tweet.findById(objId);
      } catch (err) {
        console.warn("findById with ObjectId failed:", (err as any)?.message || err);
      }
    }

    // 3) If still not found, maybe incomingId is a JSON string containing an id field
    if (!tweet && typeof incomingId === "string") {
      try {
        const parsed = JSON.parse(incomingId);
        const candidate = parsed?.id || parsed?._id || parsed?.tweetId;
        if (candidate) {
          triedCandidates.push(String(candidate));
          tweet = await Tweet.findById(candidate);
        }
      } catch (e) {
        // ignore JSON parse errors
      }
    }

    // 4) Last resort: try to find by a string match on _id
    if (!tweet) {
      try {
        triedCandidates.push(String(incomingId));
        tweet = await Tweet.findOne({ _id: incomingId });
      } catch (err) {
        console.warn("findOne by _id failed:", (err as any)?.message || err);
      }
    }

    if (!tweet) {
      console.error(`[DELETE-TWEET] Tweet not found for id:`, incomingId, { isValidObjectId, triedCandidates, referer, userAgent, bodyCandidate, requestUrl: req.url });
      return NextResponse.json(
        { error: "Tweet not found", incomingId, isValidObjectId, triedCandidates, referer, userAgent, bodyCandidate, requestUrl: req.url },
        { status: 404 }
      );
    }
    if (tweet.author.toString() !== user.userId.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    tweet.isDeleted = true;
    await tweet.save();

    if (tweet.parentTweet) {
      await Tweet.updateOne(
        { _id: tweet.parentTweet },
        { $pull: { replies: tweet._id } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete tweet error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete tweet" },
      { status: 500 }
    );
  }
}

