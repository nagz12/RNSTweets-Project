import mongoose, { Schema, type Document } from "mongoose"
export interface IUser extends Document {
  email: string
  password: string
  username: string
  displayName: string
  bio: string
  profilePictureUrl?: string
  bannerUrl?: string
  location?: string
  website?: string
  isVerified: boolean
  isSuspended: boolean
  demeritPoints: number
  totalDemerits?: number
  empathyScore: number
  suspendedAt?: Date
  role: "user" | "admin"
  followers: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  blockedUsers: mongoose.Types.ObjectId[]
  mutedUsers: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePictureUrl: { type: String },
    bannerUrl: { type: String },
    location: { type: String },
    website: { type: String },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    suspendedAt: { type: Date },
    demeritPoints: { type: Number, default: 0 },
    totalDemerits: { type: Number, default: 0 },
    empathyScore: { type: Number, default: 100, min: 0, max: 100 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    mutedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
)
export const User = mongoose.models.User || mongoose.model("User", userSchema)
