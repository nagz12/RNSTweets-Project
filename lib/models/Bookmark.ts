import mongoose, { Schema, type Document } from "mongoose"
export interface IBookmark extends Document {
  user: mongoose.Types.ObjectId
  tweet: mongoose.Types.ObjectId
  createdAt: Date
}
const bookmarkSchema = new Schema<IBookmark>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
  },
  { timestamps: true },
)
bookmarkSchema.index({ user: 1, tweet: 1 }, { unique: true })
export const Bookmark = mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema)
