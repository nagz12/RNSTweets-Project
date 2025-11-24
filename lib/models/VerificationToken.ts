import mongoose, { Schema, type Document } from "mongoose"
export interface IVerificationToken extends Document {
  email: string
  token: string
  expiresAt: Date
}
const verificationTokenSchema = new Schema<IVerificationToken>({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 },
})
export const VerificationToken =
  mongoose.models.VerificationToken || mongoose.model("VerificationToken", verificationTokenSchema)
