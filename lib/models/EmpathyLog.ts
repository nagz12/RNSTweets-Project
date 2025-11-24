import mongoose, { Schema, type Document } from "mongoose";
export interface IEmpathyLog extends Document {
  user: mongoose.Types.ObjectId;
  tweet: mongoose.Types.ObjectId;
  empathyScore: number;
  suggestions: string[];
  createdAt: Date;
}
const empathyLogSchema = new Schema<IEmpathyLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
    empathyScore: { type: Number, required: true, min: 0, max: 1 },
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);
export const EmpathyLog =
  mongoose.models.EmpathyLog || mongoose.model("EmpathyLog", empathyLogSchema);
