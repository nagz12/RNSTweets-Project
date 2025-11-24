import mongoose, { Schema, type Document } from "mongoose";
export interface IBullyingPattern extends Document {
  offender: mongoose.Types.ObjectId;
  victim: mongoose.Types.ObjectId;
  patternType: "stalking" | "coordinated" | "persistent";
  incidentCount: number;
  firstIncident: Date;
  lastIncident: Date;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const bullyingPatternSchema = new Schema<IBullyingPattern>(
  {
    offender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    victim: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patternType: {
      type: String,
      enum: ["stalking", "coordinated", "persistent"],
      required: true,
    },
    incidentCount: { type: Number, default: 1 },
    firstIncident: { type: Date, default: Date.now },
    lastIncident: { type: Date, default: Date.now },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);
bullyingPatternSchema.index({ offender: 1, victim: 1 });
bullyingPatternSchema.index({ isResolved: 1, lastIncident: -1 });
export const BullyingPattern =
  mongoose.models.BullyingPattern ||
  mongoose.model("BullyingPattern", bullyingPatternSchema);
