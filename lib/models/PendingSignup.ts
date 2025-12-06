import mongoose, { Schema, type Document } from "mongoose";

export interface IPendingSignup extends Document {
  email: string;
  displayName: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  expiresAt: Date;
}

const pendingSignupSchema = new Schema<IPendingSignup>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    displayName: { type: String, required: true },
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// Auto-delete after 1 hour
pendingSignupSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

export const PendingSignup =
  mongoose.models.PendingSignup || mongoose.model("PendingSignup", pendingSignupSchema);
