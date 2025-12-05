import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Tweet } from "@/lib/models/Tweet";
import { Demerit } from "@/lib/models/Demerit";
import { Bookmark } from "@/lib/models/Bookmark";
import { Notification } from "@/lib/models/Notification";
import { Message } from "@/lib/models/Message";
import { Hashtag } from "@/lib/models/Hashtag";
import { List } from "@/lib/models/List";
import { moderateContent, getSuspensionThreshold } from "@/lib/ai-moderation";
import { applyEmpathyViolation, ensureEmpathyDefaults } from "@/lib/empathy";
import { generateToken, verifyToken } from "@/lib/auth";
import { extractHashtags, extractMentions } from "@/lib/utils-twitter";
import bcryptjs from "bcryptjs";
const typeDefs = `
  type User {
    id: ID!
    email: String!
    username: String!
    displayName: String!
    bio: String
    profilePictureUrl: String
    bannerUrl: String
    location: String
    website: String
    isVerified: Boolean!
    isSuspended: Boolean!
    empathyScore: Int!
    totalDemerits: Int!
    demeritPoints: Int!
    role: String!
    followerCount: Int!
    followingCount: Int!
    tweetCount: Int!
    isFollowing: Boolean
    isBlocked: Boolean
    tweets: [Tweet!]!
    createdAt: String!
  }
  type Tweet {
    id: ID!
    content: String!
    author: User!
    likes: Int!
    retweets: Int!
    replies: Int!
    viewCount: Int!
    media: [String!]
    hashtags: [String!]
    mentions: [User!]
    isLiked: Boolean
    isRetweeted: Boolean
    isBookmarked: Boolean
    parentTweet: Tweet
    quoteTweet: Tweet
    isFlagged: Boolean!
    flagReason: String
    isPinned: Boolean
    createdAt: String!
  }
  type Bookmark {
    id: ID!
    tweet: Tweet!
    createdAt: String!
  }
  type Notification {
    id: ID!
    actor: User!
    type: String!
    tweet: Tweet
    isRead: Boolean!
    createdAt: String!
  }
  type Message {
    id: ID!
    sender: User!
    recipient: User!
    content: String!
    isRead: Boolean!
    createdAt: String!
  }
  type Conversation {
    user: User!
    lastMessage: Message!
    unreadCount: Int!
  }
  type TrendingTopic {
    tag: String!
    count: Int!
    tweetCount: Int!
  }
  type List {
    id: ID!
    name: String!
    description: String
    owner: User!
    memberCount: Int!
    isPrivate: Boolean!
    createdAt: String!
  }
  type Demerit {
    id: ID!
    user: User!
    tweet: Tweet!
    reason: String!
    points: Int!
    toxicityScore: Float!
    content: String!
    createdAt: String!
  }
  type AuthResponse {
    token: String!
    user: User!
  }
  type Statistics {
    totalUsers: Int!
    totalTweets: Int!
    totalFlaggedTweets: Int!
    topDemeritUsers: [UserDemeritStat!]!
  }
  type UserDemeritStat {
    user: User!
    totalDemerits: Int!
  }
  type Query {
    me: User
    user(id: ID!): User
    userByUsername(username: String!): User
    feed: [Tweet!]!
    tweet(id: ID!): Tweet
    searchTweets(query: String!): [Tweet!]!
    searchUsers(query: String!): [User!]!
    explore: [Tweet!]!
    trending: [TrendingTopic!]!
    notifications: [Notification!]!
    unreadNotificationCount: Int!
    bookmarks: [Bookmark!]!
    messages(conversationWith: ID!): [Message!]!
    conversations: [Conversation!]!
    userProfile(username: String!): User
    userTweets(userId: ID!): [Tweet!]!
    userLikes(userId: ID!): [Tweet!]!
    userReplies(userId: ID!): [Tweet!]!
    followers(userId: ID!): [User!]!
    following(userId: ID!): [User!]!
    lists(userId: ID!): [List!]!
    flaggedTweets: [Demerit!]!
    userDemerits(userId: ID!): [Demerit!]!
    statistics: Statistics!
    allUsers: [User!]!
  }
  type Mutation {
    signup(email: String!, password: String!, username: String!, displayName: String!): AuthResponse!
    login(email: String!, password: String!): AuthResponse!
    logout: Boolean!
    createTweet(content: String!, media: [String!]): Tweet!
    deleteTweet(id: ID!): Boolean!
    editTweet(id: ID!, content: String!): Tweet!
    likeTweet(id: ID!): Boolean!
    unlikeTweet(id: ID!): Boolean!
    retweet(id: ID!): Boolean!
    unretweet(id: ID!): Boolean!
    replyTweet(tweetId: ID!, content: String!): Tweet!
    quoteTweet(tweetId: ID!, content: String!): Tweet!
    bookmarkTweet(id: ID!): Boolean!
    removeBookmark(id: ID!): Boolean!
    pinTweet(id: ID!): Boolean!
    unpinTweet(id: ID!): Boolean!
    followUser(id: ID!): Boolean!
    unfollowUser(id: ID!): Boolean!
    blockUser(id: ID!): Boolean!
    unblockUser(id: ID!): Boolean!
    muteUser(id: ID!): Boolean!
    unmuteUser(id: ID!): Boolean!
    updateProfile(displayName: String, bio: String, location: String, website: String, profilePictureUrl: String, bannerUrl: String): User!
    markNotificationAsRead(id: ID!): Boolean!
    markAllNotificationsAsRead: Boolean!
    sendMessage(recipientId: ID!, content: String!): Message!
    markMessageAsRead(id: ID!): Boolean!
    createList(name: String!, description: String, isPrivate: Boolean): List!
    addToList(listId: ID!, userId: ID!): Boolean!
    removeFromList(listId: ID!, userId: ID!): Boolean!
    adjustDemerit(userId: ID!, points: Int!): User!
    suspendUser(userId: ID!): User!
    unsuspendUser(userId: ID!): User!
  }
`;
const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) return null;
      await connectDB();
      const user = (await User.findById(context.user.userId)
        .populate("followers")
        .populate("following")
        .lean()) as any;
      if (user) {
        return {
          ...user,
          id: user._id,
          followerCount: user.followers.length,
          followingCount: user.following.length,
        };
      }
      return null;
    },
    user: async (_: any, args: any, context: any) => {
      await connectDB();
      const user = (await User.findById(args.id)
        .populate("followers")
        .populate("following")
        .lean()) as any;
      if (!user) return null;
      const isFollowing =
        context.user &&
        user.followers.some((f: any) => f.toString() === context.user.userId);
      const isBlocked =
        user.blockedUsers &&
        user.blockedUsers.some(
          (b: any) => b.toString() === context.user?.userId
        );
      const tweetCount = await Tweet.countDocuments({
        author: args.id,
        isDeleted: false,
      });
      return {
        ...user,
        id: user._id,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        tweetCount,
        isFollowing,
        isBlocked,
      };
    },
    userByUsername: async (_: any, args: any, context: any) => {
      await connectDB();
      const user = (await User.findOne({ username: args.username })
        .populate("followers")
        .populate("following")
        .lean()) as any;
      if (!user) return null;
      const isFollowing =
        context.user &&
        user.followers.some((f: any) => f.toString() === context.user.userId);
      const tweetCount = await Tweet.countDocuments({
        author: user._id,
        isDeleted: false,
      });
      return {
        ...user,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        tweetCount,
        isFollowing,
      };
    },
    feed: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const user = await User.findById(context.user.userId);
      const tweets = await Tweet.find({
        author: { $in: [user._id, ...user.following] },
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("author")
        .populate("mentions")
        .lean();
      return tweets.map((t: any) => ({
        ...t,
        id: t._id?.toString?.() || String(t._id),
        author: { ...t.author, id: t.author?._id?.toString?.() || String(t.author?._id) },
        likes: Array.isArray(t.likes) ? t.likes.length : (t.likes || 0),
        retweets: Array.isArray(t.retweets) ? t.retweets.length : (t.retweets || 0),
        replies: Array.isArray(t.replies) ? t.replies.length : (t.replies || 0),
        isLiked: Array.isArray(t.likes) ? t.likes.some((l: any) => l.toString() === context.user.userId) : false,
        isRetweeted: Array.isArray(t.retweets) ? t.retweets.some(
          (r: any) => r.toString() === context.user.userId
        ) : false,
      }));
    },
    explore: async (_: any, __: any, context: any) => {
      await connectDB();
      const tweets = await Tweet.find({ isDeleted: false })
        .sort({ viewCount: -1, createdAt: -1 })
        .limit(50)
        .populate("author")
        .lean();
      return tweets.map((t: any) => ({
        ...t,
        id: t._id,
        author: { ...t.author, id: t.author._id },
        likes: t.likes.length,
        retweets: t.retweets.length,
        replies: t.replies.length,
        isLiked:
          context.user &&
          t.likes.some((l: any) => l.toString() === context.user.userId),
        isRetweeted:
          context.user &&
          t.retweets.some((r: any) => r.toString() === context.user.userId),
      }));
    },
    searchTweets: async (_: any, args: any) => {
      await connectDB();
      const tweets = await Tweet.find({
        $or: [
          { content: { $regex: args.query, $options: "i" } },
          { hashtags: { $in: [args.query.toLowerCase()] } },
        ],
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .limit(30)
        .populate("author")
        .lean();
      return tweets.map((t: any) => ({
        ...t,
        id: t._id,
        author: { ...t.author, id: t.author._id },
        likes: t.likes.length,
        retweets: t.retweets.length,
        replies: t.replies.length,
      }));
    },
    searchUsers: async (_: any, args: any) => {
      await connectDB();
      const users = await User.find({
        $or: [
          { displayName: { $regex: args.query, $options: "i" } },
          { username: { $regex: args.query, $options: "i" } },
        ],
      })
        .limit(20)
        .lean();
      return users.map((u: any) => ({
        ...u,
        id: u._id,
        followerCount: u.followers.length,
        followingCount: u.following.length,
      }));
    },
    trending: async () => {
      await connectDB();
      const hashtags = await Hashtag.find()
        .sort({ count: -1 })
        .limit(10)
        .lean();
      const topHashtags = await Promise.all(
        hashtags.map(async (tag: any) => {
          const tweetCount = await Tweet.countDocuments({
            hashtags: tag.tag,
            isDeleted: false,
          });
          return {
            tag: tag.tag.replace("#", ""),
            count: tag.count,
            tweetCount,
          };
        })
      );
      return topHashtags;
    },
    notifications: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const notifications = await Notification.find({
        user: context.user.userId,
      })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("actor")
        .populate("tweet")
        .lean();
      return notifications.map((n: any) => ({
        ...n,
        id: n._id,
        actor: { ...n.actor, id: n.actor._id },
      }));
    },
    unreadNotificationCount: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      return Notification.countDocuments({
        user: context.user.userId,
        isRead: false,
      });
    },
    bookmarks: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const bookmarks = await Bookmark.find({ user: context.user.userId })
        .sort({ createdAt: -1 })
        .populate("tweet")
        .lean();
      return bookmarks.map((b: any) => ({ ...b, id: b._id }));
    },
    messages: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      return Message.find({
        $or: [
          { sender: context.user.userId, recipient: args.conversationWith },
          { sender: args.conversationWith, recipient: context.user.userId },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("sender")
        .populate("recipient")
        .lean();
    },
    conversations: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const messages = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: context.user.userId },
              { recipient: context.user.userId },
            ],
          },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$sender", context.user.userId] },
                "$recipient",
                "$sender",
              ],
            },
            lastMessage: { $first: "$_id" },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$recipient", context.user.userId] },
                      { $eq: ["$isRead", false] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);
      return messages;
    },
    userTweets: async (_: any, args: any) => {
      await connectDB();
      const tweets = await Tweet.find({ author: args.userId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("author")
        .lean();
      return tweets.map((t: any) => ({
        ...t,
        id: t._id,
        author: { ...t.author, id: t.author._id },
        likes: t.likes.length,
        retweets: t.retweets.length,
        replies: t.replies.length,
      }));
    },
    followers: async (_: any, args: any) => {
      await connectDB();
      const user = (await User.findById(args.userId)
        .populate("followers")
        .lean()) as any;
      return (user?.followers || []).map((f: any) => ({ ...f, id: f._id }));
    },
    following: async (_: any, args: any) => {
      await connectDB();
      const user = (await User.findById(args.userId)
        .populate("following")
        .lean()) as any;
      return (user?.following || []).map((f: any) => ({ ...f, id: f._id }));
    },
    flaggedTweets: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      const user = await User.findById(context.user.userId);
      if (user?.role !== "admin") throw new Error("Admin access required");
      await connectDB();
      return Demerit.find()
        .populate("user")
        .populate("tweet")
        .sort({ createdAt: -1 })
        .lean();
    },
    statistics: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      const user = await User.findById(context.user.userId);
      if (user?.role !== "admin") throw new Error("Admin access required");
      await connectDB();
      const totalUsers = await User.countDocuments();
      const totalTweets = await Tweet.countDocuments({ isDeleted: false });
      const totalFlaggedTweets = await Demerit.countDocuments();
      const topDemeritUsers = await User.find()
        .sort({ demeritPoints: -1 })
        .limit(10)
        .lean();
      return {
        totalUsers,
        totalTweets,
        totalFlaggedTweets,
        topDemeritUsers: topDemeritUsers.map((u: any) => ({
          user: { ...u, id: u._id },
          totalDemerits: u.demeritPoints,
        })),
      };
    },
    allUsers: async () => {
      await connectDB();
      return User.find().limit(50).lean();
    },
  },
  User: {
    tweets: async (parent: any) => {
      await connectDB();
      return Tweet.find({ author: parent.id || parent._id, isDeleted: false })
        .sort({ createdAt: -1 })
        .lean();
    },
  },
  Tweet: {
    author: async (parent: any) => {
      await connectDB();
      return User.findById(parent.author).lean();
    },
    parentTweet: async (parent: any) => {
      if (!parent.parentTweet) return null;
      await connectDB();
      return Tweet.findById(parent.parentTweet).lean();
    },
    quoteTweet: async (parent: any) => {
      if (!parent.quoteTweet) return null;
      await connectDB();
      return Tweet.findById(parent.quoteTweet).lean();
    },
  },
  Mutation: {
    signup: async (_: any, args: any) => {
      await connectDB();
      if (!args.email.endsWith("@rnsit.ac.in")) {
        throw new Error("Only @rnsit.ac.in emails are allowed");
      }
      const existing = await User.findOne({ email: args.email });
      if (existing) throw new Error("Email already registered");
      const existingUsername = await User.findOne({ username: args.username });
      if (existingUsername) throw new Error("Username already taken");
      const hashedPassword = await bcryptjs.hash(args.password, 10);
      const newUser = await User.create({
        email: args.email,
        password: hashedPassword,
        username: args.username,
        displayName: args.displayName,
        isVerified: true,
      });
      const token = generateToken({
        userId: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
      });
      return {
        token,
        user: { ...newUser.toObject(), id: newUser._id },
      };
    },
    login: async (_: any, args: any) => {
      await connectDB();
      const user = await User.findOne({ email: args.email });
      if (!user) throw new Error("User not found");
      const validPassword = await bcryptjs.compare(
        args.password,
        user.password
      );
      if (!validPassword) throw new Error("Invalid password");
      if (!user.isVerified) throw new Error("Email not verified");
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });
      return {
        token,
        user: { ...user.toObject(), id: user._id },
      };
    },
    createTweet: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const user = await User.findById(context.user.userId);
      await ensureEmpathyDefaults(user as any);
      if (user?.isSuspended) throw new Error("Your account is suspended due to low empathy score.");
      const moderation = await moderateContent(args.content);
      if (moderation.shouldBlock) {
        const penaltyPoints = 15;
        await applyEmpathyViolation(user!._id.toString(), penaltyPoints);
        const tweet = await Tweet.create({
          content: args.content,
          author: user?._id,
          isFlagged: true,
          flagReason: moderation.reason,
          isDeleted: true,
        });
        await Demerit.create({
          user: user?._id,
          tweet: tweet._id,
          reason: moderation.reason,
          points: penaltyPoints,
          toxicityScore: moderation.toxicityScore,
          content: args.content,
        });
        const updatedUser = await User.findById(user?._id);
        const totalDemerits =
          (updatedUser as any)?.totalDemerits ??
          (updatedUser as any)?.demeritPoints ??
          0;
        if (totalDemerits >= getSuspensionThreshold() || (updatedUser?.empathyScore ?? 0) <= 35) {
          await User.updateOne({ _id: user?._id }, { isSuspended: true });
        }
        throw new Error(
          `Tweet blocked due to ${moderation.reason}. Demerits: ${penaltyPoints}`
        );
      }
      const hashtags = extractHashtags(args.content);
      const mentions = extractMentions(args.content);
      const mentionedUsers = await User.find({ username: { $in: mentions } });
      const mentionedUserIds = mentionedUsers.map((u) => u._id);
      const tweet = await Tweet.create({
        content: args.content,
        author: user?._id,
        media: args.media || [],
        hashtags,
        mentions: mentionedUserIds,
      });
      for (const tag of hashtags) {
        await Hashtag.findOneAndUpdate(
          { tag },
          { $inc: { count: 1 }, trending: true },
          { upsert: true }
        );
      }
      for (const mentionedUserId of mentionedUserIds) {
        await Notification.create({
          user: mentionedUserId,
          actor: user?._id,
          type: "mention",
          tweet: tweet._id,
        });
      }
      return (await tweet.populate("author")).toObject();
    },
    likeTweet: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const actingUser = await User.findById(context.user.userId);
      await ensureEmpathyDefaults(actingUser as any);
      if (actingUser?.isSuspended) throw new Error("Your account is suspended due to low empathy score.");
      const tweet = await Tweet.findById(args.id);
      if (!tweet) throw new Error("Tweet not found");
      if (!tweet.likes.includes(context.user.userId)) {
        tweet.likes.push(context.user.userId);
        await tweet.save();
        await Notification.create({
          user: tweet.author,
          actor: context.user.userId,
          type: "like",
          tweet: tweet._id,
        });
      }
      return true;
    },
    unlikeTweet: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      await Tweet.updateOne(
        { _id: args.id },
        { $pull: { likes: context.user.userId } }
      );
      return true;
    },
    retweet: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const actingUser = await User.findById(context.user.userId);
      await ensureEmpathyDefaults(actingUser as any);
      if (actingUser?.isSuspended) throw new Error("Your account is suspended due to low empathy score.");
      const tweet = await Tweet.findById(args.id);
      if (!tweet) throw new Error("Tweet not found");
      if (!tweet.retweets.includes(context.user.userId)) {
        tweet.retweets.push(context.user.userId);
        await tweet.save();
        await Notification.create({
          user: tweet.author,
          actor: context.user.userId,
          type: "retweet",
          tweet: tweet._id,
        });
      }
      return true;
    },
    replyTweet: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const moderation = await moderateContent(args.content);
      if (moderation.shouldBlock) {
        const user = await User.findById(context.user.userId);
        await User.updateOne(
          { _id: user?._id },
          { $inc: { demeritPoints: moderation.points } }
        );
        throw new Error(`Reply blocked due to ${moderation.reason}`);
      }
      const reply = await Tweet.create({
        content: args.content,
        author: context.user.userId,
        parentTweet: args.tweetId,
      });
      await Tweet.updateOne(
        { _id: args.tweetId },
        { $push: { replies: reply._id } }
      );
      const parentTweet = await Tweet.findById(args.tweetId);
      await Notification.create({
        user: parentTweet?.author,
        actor: context.user.userId,
        type: "reply",
        tweet: args.tweetId,
      });
      return (await reply.populate("author")).toObject();
    },
    quoteTweet: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const moderation = await moderateContent(args.content);
      if (moderation.shouldBlock) {
        throw new Error(`Tweet blocked due to ${moderation.reason}`);
      }
      const quote = await Tweet.create({
        content: args.content,
        author: context.user.userId,
        quoteTweet: args.tweetId,
      });
      return (await quote.populate("author")).toObject();
    },
    bookmarkTweet: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      await Bookmark.findOneAndUpdate(
        { user: context.user.userId, tweet: args.id },
        { user: context.user.userId, tweet: args.id },
        { upsert: true }
      );
      return true;
    },
    removeBookmark: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      await Bookmark.deleteOne({ user: context.user.userId, tweet: args.id });
      return true;
    },
    pinTweet: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const tweet = await Tweet.findById(args.id);
      if (!tweet) throw new Error("Tweet not found");
      if (tweet.author.toString() !== context.user.userId) {
        throw new Error("Not authorized");
      }
      await Tweet.updateOne({ _id: args.id }, { isPinned: true });
      return true;
    },
    followUser: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const targetUser = await User.findById(args.id);
      if (!targetUser) throw new Error("User not found");
      await User.updateOne(
        { _id: context.user.userId },
        { $addToSet: { following: args.id } }
      );
      await User.updateOne(
        { _id: args.id },
        { $addToSet: { followers: context.user.userId } }
      );
      await Notification.create({
        user: args.id,
        actor: context.user.userId,
        type: "follow",
      });
      return true;
    },
    unfollowUser: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      await User.updateOne(
        { _id: context.user.userId },
        { $pull: { following: args.id } }
      );
      await User.updateOne(
        { _id: args.id },
        { $pull: { followers: context.user.userId } }
      );
      return true;
    },
    blockUser: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      await User.updateOne(
        { _id: context.user.userId },
        { $addToSet: { blockedUsers: args.id } }
      );
      return true;
    },
    muteUser: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      await User.updateOne(
        { _id: context.user.userId },
        { $addToSet: { mutedUsers: args.id } }
      );
      return true;
    },
    updateProfile: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const updateData: any = {};
      if (args.displayName) updateData.displayName = args.displayName;
      if (args.bio) updateData.bio = args.bio;
      if (args.location) updateData.location = args.location;
      if (args.website) updateData.website = args.website;
      if (args.profilePictureUrl)
        updateData.profilePictureUrl = args.profilePictureUrl;
      if (args.bannerUrl) updateData.bannerUrl = args.bannerUrl;
      return User.findByIdAndUpdate(context.user.userId, updateData, {
        new: true,
      });
    },
    markNotificationAsRead: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      await Notification.updateOne({ _id: args.id }, { isRead: true });
      return true;
    },
    markAllNotificationsAsRead: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      await Notification.updateMany(
        { user: context.user.userId },
        { isRead: true }
      );
      return true;
    },
    sendMessage: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const message = await Message.create({
        sender: context.user.userId,
        recipient: args.recipientId,
        content: args.content,
      });
      return (
        await message.populate("sender").populate("recipient")
      ).toObject();
    },
    markMessageAsRead: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      await Message.updateOne({ _id: args.id }, { isRead: true });
      return true;
    },
    createList: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const list = await List.create({
        name: args.name,
        description: args.description,
        owner: context.user.userId,
        isPrivate: args.isPrivate || false,
      });
      return (await list.populate("owner")).toObject();
    },
    addToList: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const list = await List.findById(args.listId);
      if (list?.owner.toString() !== context.user.userId) {
        throw new Error("Not authorized");
      }
      await List.updateOne(
        { _id: args.listId },
        { $addToSet: { members: args.userId } }
      );
      return true;
    },
    suspendUser: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      const user = await User.findById(context.user.userId);
      if (user?.role !== "admin") throw new Error("Admin access required");
      await connectDB();
      return User.findByIdAndUpdate(
        args.userId,
        { isSuspended: true },
        { new: true }
      );
    },
    deleteTweet: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      await connectDB();
      const tweet = await Tweet.findById(args.id);
      if (!tweet) throw new Error("Tweet not found");
      if (
        tweet.author.toString() !== context.user.userId &&
        (await User.findById(context.user.userId))?.role !== "admin"
      ) {
        throw new Error("Not authorized");
      }
      await Tweet.updateOne({ _id: args.id }, { isDeleted: true });
      return true;
    },
  },
};
async function executeGraphQLQuery(
  query: string,
  variables: any,
  context: any
) {
  try {
    const operationMatch = query.match(/^\s*(query|mutation)\s+(\w+)?/i);
    const operation = operationMatch?.[1]?.toLowerCase() || "query";
    if (operation === "query") {
      const fieldMatch = query.match(/\{\s*(\w+)/);
      const fieldName = fieldMatch?.[1];
      if (
        fieldName &&
        resolvers.Query[fieldName as keyof typeof resolvers.Query]
      ) {
        const resolver =
          resolvers.Query[fieldName as keyof typeof resolvers.Query];
        const result = await resolver(null, variables, context);
        if (
          fieldName === "feed" ||
          fieldName === "explore" ||
          fieldName === "searchTweets" ||
          fieldName === "userTweets"
        ) {
          const tweets = result as any[];
          for (const tweet of tweets) {
            if (tweet.author && !tweet.author.username) {
              tweet.author = await resolvers.Tweet.author(tweet);
            }
          }
        }
        return { data: { [fieldName]: result } };
      }
    } else if (operation === "mutation") {
      const fieldMatch = query.match(/\{\s*(\w+)/);
      const fieldName = fieldMatch?.[1];
      if (
        fieldName &&
        resolvers.Mutation[fieldName as keyof typeof resolvers.Mutation]
      ) {
        const resolver =
          resolvers.Mutation[fieldName as keyof typeof resolvers.Mutation];
        const result = await resolver(null, variables, context);
        return { data: { [fieldName]: result } };
      }
    }
    return { error: "Operation not found" };
  } catch (error: any) {
    return { error: error.message };
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    let user = null;
    if (token) {
      user = verifyToken(token);
    }
    const context = { user };
    const response = await executeGraphQLQuery(
      body.query,
      body.variables || {},
      context
    );
    if (response.error) {
      return Response.json(
        { errors: [{ message: response.error }] },
        { status: 400 }
      );
    }
    return Response.json(response);
  } catch (error: any) {
    console.error("GraphQL error:", error);
    return Response.json(
      { errors: [{ message: error.message }] },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  return Response.json({ message: "GraphQL endpoint. Use POST requests." });
}
