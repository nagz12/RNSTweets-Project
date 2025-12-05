import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rnstweets"

// Define schemas inline for seeding
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  displayName: String,
  bio: String,
  avatar: String,
  followers: [String],
  following: [String],
  demerits: Number,
  isSuspended: Boolean,
})

const tweetSchema = new mongoose.Schema({
  content: String,
  author: String,
  likes: [String],
  retweets: [String],
  replies: [String],
  mentions: [String],
  hashtags: [String],
  pinned: Boolean,
  viewCount: Number,
  createdAt: Date,
})

const sampleUsers = [
  {
    email: "rajesh@rnsit.ac.in",
    username: "rajesh_tech",
    displayName: "Rajesh Kumar",
    bio: "Tech enthusiast and RNSIT student. Love coding and sharing knowledge.",
    avatar: "https://avatar.vercel.sh/rajesh?size=96",
    followers: [],
    following: [],
    empathyScore: 100,
    totalDemerits: 0,
    demeritPoints: 0,
    isSuspended: false,
  },
  {
    email: "priya@rnsit.ac.in",
    username: "priya_design",
    displayName: "Priya Sharma",
    bio: "UI/UX Designer | Student at RNSIT",
    avatar: "https://avatar.vercel.sh/priya?size=96",
    followers: [],
    following: [],
    empathyScore: 100,
    totalDemerits: 0,
    demeritPoints: 0,
    isSuspended: false,
  },
  {
    email: "arjun@rnsit.ac.in",
    username: "arjun_dev",
    displayName: "Arjun Verma",
    bio: "Full-stack developer | CSE student",
    avatar: "https://avatar.vercel.sh/arjun?size=96",
    followers: [],
    following: [],
    empathyScore: 100,
    totalDemerits: 0,
    demeritPoints: 0,
    isSuspended: false,
  },
  {
    email: "neha@rnsit.ac.in",
    username: "neha_writes",
    displayName: "Neha Kapoor",
    bio: "Writer | Blogger | RNSIT Alumni",
    avatar: "https://avatar.vercel.sh/neha?size=96",
    followers: [],
    following: [],
    empathyScore: 100,
    totalDemerits: 0,
    demeritPoints: 0,
    isSuspended: false,
  },
  {
    email: "amit@rnsit.ac.in",
    username: "amit_sports",
    displayName: "Amit Singh",
    bio: "Sports enthusiast and student at RNSIT",
    avatar: "https://avatar.vercel.sh/amit?size=96",
    followers: [],
    following: [],
    empathyScore: 100,
    totalDemerits: 0,
    demeritPoints: 0,
    isSuspended: false,
  },
]

const sampleTweets = [
  {
    content: "Just finished an amazing project on machine learning! Really excited about the results.",
    author: "rajesh_tech",
    likes: ["priya_design", "arjun_dev"],
    retweets: ["neha_writes"],
    replies: [],
    mentions: [],
    hashtags: ["ML", "AI", "RNSIT"],
    pinned: false,
    viewCount: 234,
  },
  {
    content: "Redesigned the entire student portal UI. What do you think? Any feedback?",
    author: "priya_design",
    likes: ["rajesh_tech", "arjun_dev", "amit_sports"],
    retweets: ["arjun_dev"],
    replies: [],
    mentions: [],
    hashtags: ["Design", "UI", "UX"],
    pinned: false,
    viewCount: 456,
  },
  {
    content: "Campus life at RNSIT is amazing! Made some great friends and memories here.",
    author: "amit_sports",
    likes: ["priya_design", "neha_writes"],
    retweets: [],
    replies: [],
    mentions: [],
    hashtags: ["CampusLife", "RNSIT"],
    pinned: false,
    viewCount: 123,
  },
  {
    content: "New blog post is live! Check out my thoughts on web development trends for 2025.",
    author: "neha_writes",
    likes: ["rajesh_tech", "arjun_dev"],
    retweets: ["priya_design"],
    replies: [],
    mentions: [],
    hashtags: ["WebDev", "Tech", "Trends"],
    pinned: false,
    viewCount: 567,
  },
  {
    content: "Finally completed my capstone project! All those sleepless nights paid off.",
    author: "arjun_dev",
    likes: ["rajesh_tech", "priya_design", "neha_writes", "amit_sports"],
    retweets: ["amit_sports"],
    replies: [],
    mentions: [],
    hashtags: ["Coding", "Success", "RNSIT"],
    pinned: false,
    viewCount: 890,
  },
]

async function seedDatabase() {
  try {
    console.log("[v0] Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("[v0] Connected successfully!")

    // Clear existing data
    console.log("[v0] Clearing existing data...")
    await mongoose.connection.db?.dropDatabase()
    console.log("[v0] Database cleared")

    // Get models
    const User = mongoose.model("User", userSchema, "users")
    const Tweet = mongoose.model("Tweet", tweetSchema, "tweets")

    // Insert users
    console.log("[v0] Inserting sample users...")
    const insertedUsers = await User.insertMany(sampleUsers)
    console.log(`[v0] Inserted ${insertedUsers.length} users`)

    // Create relationships (following)
    console.log("[v0] Setting up relationships...")
    const userIds = insertedUsers.map((u) => u.username)
    for (let i = 0; i < userIds.length; i++) {
      const following = userIds.filter((_, j) => j !== i).slice(0, 2)
      await User.updateOne({ username: userIds[i] }, { following })
      const followers = userIds.filter((_, j) => j !== i && Math.random() > 0.5)
      await User.updateOne({ username: userIds[i] }, { followers })
    }
    console.log("[v0] Relationships setup complete")

    // Insert tweets with timestamps
    console.log("[v0] Inserting sample tweets...")
    const tweetsWithDates = sampleTweets.map((tweet, index) => ({
      ...tweet,
      createdAt: new Date(Date.now() - index * 3600000), // Stagger by 1 hour
    }))
    const insertedTweets = await Tweet.insertMany(tweetsWithDates)
    console.log(`[v0] Inserted ${insertedTweets.length} tweets`)

    console.log("[v0] Database seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("[v0] Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
