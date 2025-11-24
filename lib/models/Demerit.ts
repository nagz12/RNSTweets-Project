import mongoose, { Schema, type Document } from "mongoose"
export interface IDemerit extends Document {
  user: mongoose.Types.ObjectId
  tweet: mongoose.Types.ObjectId
  reason: string
  points: number
  isToxic: boolean
  toxicityScore: number
  content: string
  createdAt: Date
}
const demeritSchema = new Schema<IDemerit>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
    reason: { type: String, required: true },
    points: { type: Number, required: true },
    isToxic: { type: Boolean, default: true },
    toxicityScore: { type: Number, default: 0 },
    content: { type: String, required: true },
  },
  { timestamps: true },
)
export const Demerit = mongoose.models.Demerit || mongoose.model("Demerit", demeritSchema)
