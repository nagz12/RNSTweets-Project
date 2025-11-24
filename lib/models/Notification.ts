import mongoose, { Schema, type Document } from "mongoose"
export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  actor: mongoose.Types.ObjectId
  type: "like" | "retweet" | "reply" | "follow" | "mention" | "message"
  tweet?: mongoose.Types.ObjectId
  message?: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}
const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "retweet", "reply", "follow", "mention", "message"], required: true },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
    message: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema)
