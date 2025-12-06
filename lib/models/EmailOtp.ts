import mongoose, { Schema, type Document } from "mongoose";

export interface IEmailOtp extends Document {
  email: string;
  codeHash: string;
  purpose: "signup" | "login";
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const emailOtpSchema = new Schema<IEmailOtp>(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    codeHash: { type: String, required: true },
    purpose: { type: String, enum: ["signup", "login"], required: true },
    expiresAt: { type: Date, required: true, index: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-delete expired OTPs after 1 hour
emailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

export const EmailOtp =
  mongoose.models.EmailOtp || mongoose.model("EmailOtp", emailOtpSchema);
