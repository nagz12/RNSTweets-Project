import mongoose, { Schema, type Document } from "mongoose"
export interface IList extends Document {
  name: string
  description?: string
  owner: mongoose.Types.ObjectId
  members: mongoose.Types.ObjectId[]
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
}
const listSchema = new Schema<IList>(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export const List = mongoose.models.List || mongoose.model("List", listSchema)
