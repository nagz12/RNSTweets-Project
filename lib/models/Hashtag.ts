import mongoose, { Schema, type Document } from "mongoose"
export interface IHashtag extends Document {
  tag: string
  count: number
  trending: boolean
  updatedAt: Date
}
const hashtagSchema = new Schema<IHashtag>(
  {
    tag: { type: String, required: true, unique: true, lowercase: true },
    count: { type: Number, default: 1 },
    trending: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export const Hashtag = mongoose.models.Hashtag || mongoose.model("Hashtag", hashtagSchema)
