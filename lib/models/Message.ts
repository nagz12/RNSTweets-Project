import mongoose, { Schema, type Document } from "mongoose"
export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId
  recipient: mongoose.Types.ObjectId
  content: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}
const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
)
messageSchema.index({ sender: 1, recipient: 1 })
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema)
