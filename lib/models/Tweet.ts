import mongoose, { Schema, type Document } from "mongoose"
export interface ITweet extends Document {
  content: string
  author: mongoose.Types.ObjectId
  likes: mongoose.Types.ObjectId[]
  retweets: mongoose.Types.ObjectId[]
  replies: mongoose.Types.ObjectId[]
  parentTweet?: mongoose.Types.ObjectId
  quoteTweet?: mongoose.Types.ObjectId
  media?: string[]
  hashtags: string[]
  mentions: mongoose.Types.ObjectId[]
  isDeleted: boolean
  isFlagged: boolean
  flagReason?: string
  isPinned: boolean
  viewCount: number
  createdAt: Date
  updatedAt: Date
}
const tweetSchema = new Schema<ITweet>(
  {
    content: { type: String, required: true, maxlength: 280 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweets: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
    parentTweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
    quoteTweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
    media: [{ type: String }],
    hashtags: [{ type: String, lowercase: true }],
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String },
    isPinned: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)
tweetSchema.index({ author: 1, createdAt: -1 })
tweetSchema.index({ hashtags: 1 })
export const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", tweetSchema)
