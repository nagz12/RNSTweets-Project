import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Hashtag } from "@/lib/models/Hashtag";
import { Tweet } from "@/lib/models/Tweet";
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const hashtags = await Hashtag.find().sort({ count: -1 }).limit(10).lean();
    const topHashtags = await Promise.all(
      hashtags.map(async (tag: any) => {
        const tweetCount = await Tweet.countDocuments({
          hashtags: tag.tag,
          isDeleted: false,
        });
        return {
          tag: tag.tag.replace("#", ""),
          count: tag.count,
          tweetCount,
        };
      })
    );
    return NextResponse.json({ trending: topHashtags });
  } catch (error: any) {
    console.error("Trending error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch trending" },
      { status: 500 }
    );
  }
}
