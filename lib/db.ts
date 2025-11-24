import mongoose from "mongoose"
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rnstweets"

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined")
}
let isConnected = false
export async function connectDB() {
  if (isConnected) {
    return
  }
  try {
    await mongoose.connect(MONGODB_URI)
    isConnected = true
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}
