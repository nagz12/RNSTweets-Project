module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectDB",
    ()=>connectDB
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rnstweets";
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
let isConnected = false;
async function connectDB() {
    if (isConnected) {
        return;
    }
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI);
        isConnected = true;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/User.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "User",
    ()=>User
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const userSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    profilePictureUrl: {
        type: String
    },
    bannerUrl: {
        type: String
    },
    location: {
        type: String
    },
    website: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    demeritPoints: {
        type: Number,
        default: 0
    },
    empathyScore: {
        type: Number,
        default: 50,
        min: 0,
        max: 100
    },
    role: {
        type: String,
        enum: [
            "user",
            "admin"
        ],
        default: "user"
    },
    followers: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        }
    ],
    blockedUsers: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        }
    ],
    mutedUsers: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true
});
const User = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("User", userSchema);
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Tweet.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tweet",
    ()=>Tweet
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const tweetSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    content: {
        type: String,
        required: true,
        maxlength: 280
    },
    author: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        }
    ],
    retweets: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        }
    ],
    replies: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "Tweet"
        }
    ],
    parentTweet: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Tweet"
    },
    quoteTweet: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Tweet"
    },
    media: [
        {
            type: String
        }
    ],
    hashtags: [
        {
            type: String,
            lowercase: true
        }
    ],
    mentions: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isFlagged: {
        type: Boolean,
        default: false
    },
    flagReason: {
        type: String
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
tweetSchema.index({
    author: 1,
    createdAt: -1
});
tweetSchema.index({
    hashtags: 1
});
const Tweet = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Tweet || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Tweet", tweetSchema);
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Demerit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Demerit",
    ()=>Demerit
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const demeritSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    user: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    tweet: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Tweet",
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    isToxic: {
        type: Boolean,
        default: true
    },
    toxicityScore: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const Demerit = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Demerit || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Demerit", demeritSchema);
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Bookmark.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Bookmark",
    ()=>Bookmark
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const bookmarkSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    user: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    tweet: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Tweet",
        required: true
    }
}, {
    timestamps: true
});
bookmarkSchema.index({
    user: 1,
    tweet: 1
}, {
    unique: true
});
const Bookmark = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Bookmark || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Bookmark", bookmarkSchema);
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Notification.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Notification",
    ()=>Notification
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const notificationSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    user: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    actor: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: [
            "like",
            "retweet",
            "reply",
            "follow",
            "mention",
            "message"
        ],
        required: true
    },
    tweet: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Tweet"
    },
    message: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Notification = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Notification || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Notification", notificationSchema);
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Message.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Message",
    ()=>Message
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const messageSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    sender: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
messageSchema.index({
    sender: 1,
    recipient: 1
});
const Message = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Message || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Message", messageSchema);
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Hashtag.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Hashtag",
    ()=>Hashtag
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const hashtagSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    tag: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    count: {
        type: Number,
        default: 1
    },
    trending: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Hashtag = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Hashtag || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Hashtag", hashtagSchema);
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/List.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "List",
    ()=>List
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const listSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    owner: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        }
    ],
    isPrivate: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const List = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.List || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("List", listSchema);
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/ai-moderation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSuspensionThreshold",
    ()=>getSuspensionThreshold,
    "moderateContent",
    ()=>moderateContent
]);
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const DEMERIT_THRESHOLDS = {
    SUSPENSION_THRESHOLD: 50,
    HIGH_TOXICITY: {
        score: 0.8,
        points: 15
    },
    MEDIUM_TOXICITY: {
        score: 0.5,
        points: 10
    },
    LOW_TOXICITY: {
        score: 0.3,
        points: 5
    }
};
async function moderateContent(content) {
    if (!OPENROUTER_API_KEY) {
        throw new Error("OPENROUTER_API_KEY is not set");
    }
    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENROUTER_API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b:free",
                messages: [
                    {
                        role: "user",
                        content: `Analyze this text for toxicity and harmful content. Respond with ONLY valid JSON (no markdown, no extra text):
{
  "isToxic": boolean,
  "toxicityScore": number (0-1),
  "categories": ["list of categories like: harassment, hate_speech, violence, spam, nsfw"],
  "reason": "brief explanation"
}
Text to analyze: "${content}"`
                    }
                ],
                temperature: 0.3,
                max_tokens: 200
            })
        });
        const text = await response.text();
        if (!response.ok) {
            console.error(`OpenRouter API error: ${response.status}`, text);
            throw new Error(`OpenRouter API error: ${response.status}`);
        }
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse OpenRouter response as JSON:", text);
            throw new Error("Invalid response from moderation service");
        }
        const aiResponse = data?.choices?.[0]?.message?.content;
        let parsed;
        try {
            if (!aiResponse || typeof aiResponse !== "string") {
                throw new Error("Invalid AI response");
            }
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
        } catch  {
            parsed = {
                isToxic: false,
                toxicityScore: 0,
                categories: [],
                reason: "Could not parse response"
            };
        }
        const toxicityScore = Math.min(1, Math.max(0, parsed.toxicityScore || 0));
        const isToxicContent = parsed.isToxic || toxicityScore > 0.3;
        let points = 0;
        if (isToxicContent) {
            if (toxicityScore >= DEMERIT_THRESHOLDS.HIGH_TOXICITY.score) {
                points = DEMERIT_THRESHOLDS.HIGH_TOXICITY.points;
            } else if (toxicityScore >= DEMERIT_THRESHOLDS.MEDIUM_TOXICITY.score) {
                points = DEMERIT_THRESHOLDS.MEDIUM_TOXICITY.points;
            } else if (toxicityScore >= DEMERIT_THRESHOLDS.LOW_TOXICITY.score) {
                points = DEMERIT_THRESHOLDS.LOW_TOXICITY.points;
            } else {
                points = DEMERIT_THRESHOLDS.LOW_TOXICITY.points;
            }
        }
        return {
            isToxic: isToxicContent,
            toxicityScore,
            reason: parsed.reason || parsed.categories?.join(", ") || "Potentially harmful content",
            points,
            shouldBlock: isToxicContent || toxicityScore >= 0.4
        };
    } catch (error) {
        console.error("Moderation error:", error);
        console.error("Failed to moderate content:", content);
        return {
            isToxic: false,
            toxicityScore: 0,
            reason: "Moderation service temporarily unavailable",
            points: 0,
            shouldBlock: false
        };
    }
}
function getSuspensionThreshold() {
    return DEMERIT_THRESHOLDS.SUSPENSION_THRESHOLD;
}
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAuthCookie",
    ()=>clearAuthCookie,
    "generateToken",
    ()=>generateToken,
    "getAuthToken",
    ()=>getAuthToken,
    "getAuthUser",
    ()=>getAuthUser,
    "setAuthCookie",
    ()=>setAuthCookie,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const JWT_EXPIRY = "7d";
function generateToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY
    });
}
function verifyToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
    } catch  {
        return null;
    }
}
async function setAuthCookie(token) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
    });
}
async function getAuthToken() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get("auth-token")?.value || null;
}
async function clearAuthCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete("auth-token");
}
async function getAuthUser() {
    const token = await getAuthToken();
    if (!token) return null;
    return verifyToken(token);
}
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/utils-twitter.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateNewEmpathyScore",
    ()=>calculateNewEmpathyScore,
    "extractHashtags",
    ()=>extractHashtags,
    "extractMentions",
    ()=>extractMentions,
    "formatTweetDate",
    ()=>formatTweetDate,
    "generateTrendingTopics",
    ()=>generateTrendingTopics,
    "truncateText",
    ()=>truncateText
]);
function extractHashtags(text) {
    const hashtagRegex = /#[\w]+/g;
    return (text.match(hashtagRegex) || []).map((tag)=>tag.substring(1).toLowerCase());
}
function extractMentions(text) {
    const mentionRegex = /@[\w]+/g;
    return (text.match(mentionRegex) || []).map((mention)=>mention.substring(1).toLowerCase());
}
function generateTrendingTopics(hashtags) {
    return hashtags.sort((a, b)=>b.count - a.count).slice(0, 10);
}
function formatTweetDate(date) {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString();
}
function truncateText(text, length = 100) {
    return text.length > length ? text.substring(0, length) + "..." : text;
}
function calculateNewEmpathyScore(currentScore, empathyScore, isToxic = false) {
    let newScore = currentScore;
    if (isToxic || empathyScore < 0.3) {
        const decreaseAmount = isToxic ? 8 : Math.max(2, Math.round((0.3 - empathyScore) * 10));
        newScore = Math.max(0, currentScore - decreaseAmount);
    } else if (empathyScore >= 0.7) {
        const increaseAmount = Math.round(3 + (empathyScore - 0.7) * 6);
        newScore = Math.min(100, currentScore + increaseAmount);
    } else if (empathyScore >= 0.5) {
        const increaseAmount = Math.round(1 + (empathyScore - 0.5) * 5);
        newScore = Math.min(100, currentScore + increaseAmount);
    } else {
        const decreaseAmount = Math.round((0.5 - empathyScore) * 2);
        newScore = Math.max(0, currentScore - decreaseAmount);
    }
    return Math.max(0, Math.min(100, newScore));
}
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/app/api/graphql/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Tweet.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Demerit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Demerit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Bookmark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Bookmark.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Notification.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Message.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Hashtag$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Hashtag.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$List$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/List.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/ai-moderation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$utils$2d$twitter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/utils-twitter.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/node_modules/.pnpm/bcryptjs@3.0.3/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
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
        me: async (_, __, context)=>{
            if (!context.user) return null;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(context.user.userId).populate("followers").populate("following").lean();
            if (user) {
                return {
                    ...user,
                    id: user._id,
                    followerCount: user.followers.length,
                    followingCount: user.following.length
                };
            }
            return null;
        },
        user: async (_, args, context)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(args.id).populate("followers").populate("following").lean();
            if (!user) return null;
            const isFollowing = context.user && user.followers.some((f)=>f.toString() === context.user.userId);
            const isBlocked = user.blockedUsers && user.blockedUsers.some((b)=>b.toString() === context.user?.userId);
            const tweetCount = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].countDocuments({
                author: args.id,
                isDeleted: false
            });
            return {
                ...user,
                id: user._id,
                followerCount: user.followers.length,
                followingCount: user.following.length,
                tweetCount,
                isFollowing,
                isBlocked
            };
        },
        userByUsername: async (_, args, context)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findOne({
                username: args.username
            }).populate("followers").populate("following").lean();
            if (!user) return null;
            const isFollowing = context.user && user.followers.some((f)=>f.toString() === context.user.userId);
            const tweetCount = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].countDocuments({
                author: user._id,
                isDeleted: false
            });
            return {
                ...user,
                id: user._id,
                followerCount: user.followers.length,
                followingCount: user.following.length,
                tweetCount,
                isFollowing
            };
        },
        feed: async (_, __, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(context.user.userId);
            const tweets = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].find({
                author: {
                    $in: [
                        user._id,
                        ...user.following
                    ]
                },
                isDeleted: false
            }).sort({
                createdAt: -1
            }).limit(50).populate("author").populate("mentions").lean();
            return tweets.map((t)=>({
                    ...t,
                    id: t._id,
                    author: {
                        ...t.author,
                        id: t.author._id
                    },
                    likes: t.likes.length,
                    retweets: t.retweets.length,
                    replies: t.replies.length,
                    isLiked: t.likes.some((l)=>l.toString() === context.user.userId),
                    isRetweeted: t.retweets.some((r)=>r.toString() === context.user.userId)
                }));
        },
        explore: async (_, __, context)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const tweets = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].find({
                isDeleted: false
            }).sort({
                viewCount: -1,
                createdAt: -1
            }).limit(50).populate("author").lean();
            return tweets.map((t)=>({
                    ...t,
                    id: t._id,
                    author: {
                        ...t.author,
                        id: t.author._id
                    },
                    likes: t.likes.length,
                    retweets: t.retweets.length,
                    replies: t.replies.length,
                    isLiked: context.user && t.likes.some((l)=>l.toString() === context.user.userId),
                    isRetweeted: context.user && t.retweets.some((r)=>r.toString() === context.user.userId)
                }));
        },
        searchTweets: async (_, args)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const tweets = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].find({
                $or: [
                    {
                        content: {
                            $regex: args.query,
                            $options: "i"
                        }
                    },
                    {
                        hashtags: {
                            $in: [
                                args.query.toLowerCase()
                            ]
                        }
                    }
                ],
                isDeleted: false
            }).sort({
                createdAt: -1
            }).limit(30).populate("author").lean();
            return tweets.map((t)=>({
                    ...t,
                    id: t._id,
                    author: {
                        ...t.author,
                        id: t.author._id
                    },
                    likes: t.likes.length,
                    retweets: t.retweets.length,
                    replies: t.replies.length
                }));
        },
        searchUsers: async (_, args)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const users = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].find({
                $or: [
                    {
                        displayName: {
                            $regex: args.query,
                            $options: "i"
                        }
                    },
                    {
                        username: {
                            $regex: args.query,
                            $options: "i"
                        }
                    }
                ]
            }).limit(20).lean();
            return users.map((u)=>({
                    ...u,
                    id: u._id,
                    followerCount: u.followers.length,
                    followingCount: u.following.length
                }));
        },
        trending: async ()=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const hashtags = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Hashtag$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Hashtag"].find().sort({
                count: -1
            }).limit(10).lean();
            const topHashtags = await Promise.all(hashtags.map(async (tag)=>{
                const tweetCount = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].countDocuments({
                    hashtags: tag.tag,
                    isDeleted: false
                });
                return {
                    tag: tag.tag.replace("#", ""),
                    count: tag.count,
                    tweetCount
                };
            }));
            return topHashtags;
        },
        notifications: async (_, __, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const notifications = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].find({
                user: context.user.userId
            }).sort({
                createdAt: -1
            }).limit(50).populate("actor").populate("tweet").lean();
            return notifications.map((n)=>({
                    ...n,
                    id: n._id,
                    actor: {
                        ...n.actor,
                        id: n.actor._id
                    }
                }));
        },
        unreadNotificationCount: async (_, __, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].countDocuments({
                user: context.user.userId,
                isRead: false
            });
        },
        bookmarks: async (_, __, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const bookmarks = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Bookmark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Bookmark"].find({
                user: context.user.userId
            }).sort({
                createdAt: -1
            }).populate("tweet").lean();
            return bookmarks.map((b)=>({
                    ...b,
                    id: b._id
                }));
        },
        messages: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Message"].find({
                $or: [
                    {
                        sender: context.user.userId,
                        recipient: args.conversationWith
                    },
                    {
                        sender: args.conversationWith,
                        recipient: context.user.userId
                    }
                ]
            }).sort({
                createdAt: -1
            }).limit(50).populate("sender").populate("recipient").lean();
        },
        conversations: async (_, __, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const messages = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Message"].aggregate([
                {
                    $match: {
                        $or: [
                            {
                                sender: context.user.userId
                            },
                            {
                                recipient: context.user.userId
                            }
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                {
                                    $eq: [
                                        "$sender",
                                        context.user.userId
                                    ]
                                },
                                "$recipient",
                                "$sender"
                            ]
                        },
                        lastMessage: {
                            $first: "$_id"
                        },
                        unreadCount: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$recipient",
                                                    context.user.userId
                                                ]
                                            },
                                            {
                                                $eq: [
                                                    "$isRead",
                                                    false
                                                ]
                                            }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ]);
            return messages;
        },
        userTweets: async (_, args)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const tweets = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].find({
                author: args.userId,
                isDeleted: false
            }).sort({
                createdAt: -1
            }).limit(50).populate("author").lean();
            return tweets.map((t)=>({
                    ...t,
                    id: t._id,
                    author: {
                        ...t.author,
                        id: t.author._id
                    },
                    likes: t.likes.length,
                    retweets: t.retweets.length,
                    replies: t.replies.length
                }));
        },
        followers: async (_, args)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(args.userId).populate("followers").lean();
            return (user?.followers || []).map((f)=>({
                    ...f,
                    id: f._id
                }));
        },
        following: async (_, args)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(args.userId).populate("following").lean();
            return (user?.following || []).map((f)=>({
                    ...f,
                    id: f._id
                }));
        },
        flaggedTweets: async (_, __, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(context.user.userId);
            if (user?.role !== "admin") throw new Error("Admin access required");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Demerit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Demerit"].find().populate("user").populate("tweet").sort({
                createdAt: -1
            }).lean();
        },
        statistics: async (_, __, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(context.user.userId);
            if (user?.role !== "admin") throw new Error("Admin access required");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const totalUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].countDocuments();
            const totalTweets = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].countDocuments({
                isDeleted: false
            });
            const totalFlaggedTweets = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Demerit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Demerit"].countDocuments();
            const topDemeritUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].find().sort({
                demeritPoints: -1
            }).limit(10).lean();
            return {
                totalUsers,
                totalTweets,
                totalFlaggedTweets,
                topDemeritUsers: topDemeritUsers.map((u)=>({
                        user: {
                            ...u,
                            id: u._id
                        },
                        totalDemerits: u.demeritPoints
                    }))
            };
        },
        allUsers: async ()=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].find().limit(50).lean();
        }
    },
    User: {
        tweets: async (parent)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].find({
                author: parent.id || parent._id,
                isDeleted: false
            }).sort({
                createdAt: -1
            }).lean();
        }
    },
    Tweet: {
        author: async (parent)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(parent.author).lean();
        },
        parentTweet: async (parent)=>{
            if (!parent.parentTweet) return null;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].findById(parent.parentTweet).lean();
        },
        quoteTweet: async (parent)=>{
            if (!parent.quoteTweet) return null;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].findById(parent.quoteTweet).lean();
        }
    },
    Mutation: {
        signup: async (_, args)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            if (!args.email.endsWith("@rnsit.ac.in")) {
                throw new Error("Only @rnsit.ac.in emails are allowed");
            }
            const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findOne({
                email: args.email
            });
            if (existing) throw new Error("Email already registered");
            const existingUsername = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findOne({
                username: args.username
            });
            if (existingUsername) throw new Error("Username already taken");
            const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(args.password, 10);
            const newUser = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].create({
                email: args.email,
                password: hashedPassword,
                username: args.username,
                displayName: args.displayName,
                isVerified: true
            });
            const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateToken"])({
                userId: newUser._id.toString(),
                email: newUser.email,
                role: newUser.role
            });
            return {
                token,
                user: {
                    ...newUser.toObject(),
                    id: newUser._id
                }
            };
        },
        login: async (_, args)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findOne({
                email: args.email
            });
            if (!user) throw new Error("User not found");
            const validPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(args.password, user.password);
            if (!validPassword) throw new Error("Invalid password");
            if (!user.isVerified) throw new Error("Email not verified");
            const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateToken"])({
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            });
            return {
                token,
                user: {
                    ...user.toObject(),
                    id: user._id
                }
            };
        },
        createTweet: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(context.user.userId);
            if (user?.isSuspended) throw new Error("Your account is suspended");
            const moderation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["moderateContent"])(args.content);
            if (moderation.shouldBlock) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                    _id: user?._id
                }, {
                    $inc: {
                        demeritPoints: moderation.points
                    }
                });
                const tweet = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].create({
                    content: args.content,
                    author: user?._id,
                    isFlagged: true,
                    flagReason: moderation.reason,
                    isDeleted: true
                });
                await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Demerit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Demerit"].create({
                    user: user?._id,
                    tweet: tweet._id,
                    reason: moderation.reason,
                    points: moderation.points,
                    toxicityScore: moderation.toxicityScore,
                    content: args.content
                });
                const updatedUser = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(user?._id);
                if (updatedUser?.demeritPoints >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSuspensionThreshold"])()) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                        _id: user?._id
                    }, {
                        isSuspended: true
                    });
                }
                throw new Error(`Tweet blocked due to ${moderation.reason}. Demerits: ${moderation.points}`);
            }
            const hashtags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$utils$2d$twitter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractHashtags"])(args.content);
            const mentions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$utils$2d$twitter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractMentions"])(args.content);
            const mentionedUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].find({
                username: {
                    $in: mentions
                }
            });
            const mentionedUserIds = mentionedUsers.map((u)=>u._id);
            const tweet = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].create({
                content: args.content,
                author: user?._id,
                media: args.media || [],
                hashtags,
                mentions: mentionedUserIds
            });
            for (const tag of hashtags){
                await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Hashtag$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Hashtag"].findOneAndUpdate({
                    tag
                }, {
                    $inc: {
                        count: 1
                    },
                    trending: true
                }, {
                    upsert: true
                });
            }
            for (const mentionedUserId of mentionedUserIds){
                await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].create({
                    user: mentionedUserId,
                    actor: user?._id,
                    type: "mention",
                    tweet: tweet._id
                });
            }
            return (await tweet.populate("author")).toObject();
        },
        likeTweet: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const tweet = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].findById(args.id);
            if (!tweet) throw new Error("Tweet not found");
            if (!tweet.likes.includes(context.user.userId)) {
                tweet.likes.push(context.user.userId);
                await tweet.save();
                await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].create({
                    user: tweet.author,
                    actor: context.user.userId,
                    type: "like",
                    tweet: tweet._id
                });
            }
            return true;
        },
        unlikeTweet: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].updateOne({
                _id: args.id
            }, {
                $pull: {
                    likes: context.user.userId
                }
            });
            return true;
        },
        retweet: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const tweet = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].findById(args.id);
            if (!tweet) throw new Error("Tweet not found");
            if (!tweet.retweets.includes(context.user.userId)) {
                tweet.retweets.push(context.user.userId);
                await tweet.save();
                await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].create({
                    user: tweet.author,
                    actor: context.user.userId,
                    type: "retweet",
                    tweet: tweet._id
                });
            }
            return true;
        },
        replyTweet: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const moderation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["moderateContent"])(args.content);
            if (moderation.shouldBlock) {
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(context.user.userId);
                await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                    _id: user?._id
                }, {
                    $inc: {
                        demeritPoints: moderation.points
                    }
                });
                throw new Error(`Reply blocked due to ${moderation.reason}`);
            }
            const reply = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].create({
                content: args.content,
                author: context.user.userId,
                parentTweet: args.tweetId
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].updateOne({
                _id: args.tweetId
            }, {
                $push: {
                    replies: reply._id
                }
            });
            const parentTweet = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].findById(args.tweetId);
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].create({
                user: parentTweet?.author,
                actor: context.user.userId,
                type: "reply",
                tweet: args.tweetId
            });
            return (await reply.populate("author")).toObject();
        },
        quoteTweet: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const moderation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["moderateContent"])(args.content);
            if (moderation.shouldBlock) {
                throw new Error(`Tweet blocked due to ${moderation.reason}`);
            }
            const quote = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].create({
                content: args.content,
                author: context.user.userId,
                quoteTweet: args.tweetId
            });
            return (await quote.populate("author")).toObject();
        },
        bookmarkTweet: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Bookmark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Bookmark"].findOneAndUpdate({
                user: context.user.userId,
                tweet: args.id
            }, {
                user: context.user.userId,
                tweet: args.id
            }, {
                upsert: true
            });
            return true;
        },
        removeBookmark: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Bookmark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Bookmark"].deleteOne({
                user: context.user.userId,
                tweet: args.id
            });
            return true;
        },
        pinTweet: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const tweet = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].findById(args.id);
            if (!tweet) throw new Error("Tweet not found");
            if (tweet.author.toString() !== context.user.userId) {
                throw new Error("Not authorized");
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].updateOne({
                _id: args.id
            }, {
                isPinned: true
            });
            return true;
        },
        followUser: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const targetUser = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(args.id);
            if (!targetUser) throw new Error("User not found");
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                _id: context.user.userId
            }, {
                $addToSet: {
                    following: args.id
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                _id: args.id
            }, {
                $addToSet: {
                    followers: context.user.userId
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].create({
                user: args.id,
                actor: context.user.userId,
                type: "follow"
            });
            return true;
        },
        unfollowUser: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                _id: context.user.userId
            }, {
                $pull: {
                    following: args.id
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                _id: args.id
            }, {
                $pull: {
                    followers: context.user.userId
                }
            });
            return true;
        },
        blockUser: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                _id: context.user.userId
            }, {
                $addToSet: {
                    blockedUsers: args.id
                }
            });
            return true;
        },
        muteUser: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                _id: context.user.userId
            }, {
                $addToSet: {
                    mutedUsers: args.id
                }
            });
            return true;
        },
        updateProfile: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const updateData = {};
            if (args.displayName) updateData.displayName = args.displayName;
            if (args.bio) updateData.bio = args.bio;
            if (args.location) updateData.location = args.location;
            if (args.website) updateData.website = args.website;
            if (args.profilePictureUrl) updateData.profilePictureUrl = args.profilePictureUrl;
            if (args.bannerUrl) updateData.bannerUrl = args.bannerUrl;
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findByIdAndUpdate(context.user.userId, updateData, {
                new: true
            });
        },
        markNotificationAsRead: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].updateOne({
                _id: args.id
            }, {
                isRead: true
            });
            return true;
        },
        markAllNotificationsAsRead: async (_, __, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].updateMany({
                user: context.user.userId
            }, {
                isRead: true
            });
            return true;
        },
        sendMessage: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const message = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Message"].create({
                sender: context.user.userId,
                recipient: args.recipientId,
                content: args.content
            });
            return (await message.populate("sender").populate("recipient")).toObject();
        },
        markMessageAsRead: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Message"].updateOne({
                _id: args.id
            }, {
                isRead: true
            });
            return true;
        },
        createList: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const list = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$List$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["List"].create({
                name: args.name,
                description: args.description,
                owner: context.user.userId,
                isPrivate: args.isPrivate || false
            });
            return (await list.populate("owner")).toObject();
        },
        addToList: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const list = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$List$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["List"].findById(args.listId);
            if (list?.owner.toString() !== context.user.userId) {
                throw new Error("Not authorized");
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$List$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["List"].updateOne({
                _id: args.listId
            }, {
                $addToSet: {
                    members: args.userId
                }
            });
            return true;
        },
        suspendUser: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(context.user.userId);
            if (user?.role !== "admin") throw new Error("Admin access required");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findByIdAndUpdate(args.userId, {
                isSuspended: true
            }, {
                new: true
            });
        },
        deleteTweet: async (_, args, context)=>{
            if (!context.user) throw new Error("Not authenticated");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
            const tweet = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].findById(args.id);
            if (!tweet) throw new Error("Tweet not found");
            if (tweet.author.toString() !== context.user.userId && (await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(context.user.userId))?.role !== "admin") {
                throw new Error("Not authorized");
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].updateOne({
                _id: args.id
            }, {
                isDeleted: true
            });
            return true;
        }
    }
};
async function executeGraphQLQuery(query, variables, context) {
    try {
        const operationMatch = query.match(/^\s*(query|mutation)\s+(\w+)?/i);
        const operation = operationMatch?.[1]?.toLowerCase() || "query";
        if (operation === "query") {
            const fieldMatch = query.match(/\{\s*(\w+)/);
            const fieldName = fieldMatch?.[1];
            if (fieldName && resolvers.Query[fieldName]) {
                const resolver = resolvers.Query[fieldName];
                const result = await resolver(null, variables, context);
                if (fieldName === "feed" || fieldName === "explore" || fieldName === "searchTweets" || fieldName === "userTweets") {
                    const tweets = result;
                    for (const tweet of tweets){
                        if (tweet.author && !tweet.author.username) {
                            tweet.author = await resolvers.Tweet.author(tweet);
                        }
                    }
                }
                return {
                    data: {
                        [fieldName]: result
                    }
                };
            }
        } else if (operation === "mutation") {
            const fieldMatch = query.match(/\{\s*(\w+)/);
            const fieldName = fieldMatch?.[1];
            if (fieldName && resolvers.Mutation[fieldName]) {
                const resolver = resolvers.Mutation[fieldName];
                const result = await resolver(null, variables, context);
                return {
                    data: {
                        [fieldName]: result
                    }
                };
            }
        }
        return {
            error: "Operation not found"
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split(" ")[1];
        let user = null;
        if (token) {
            user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        }
        const context = {
            user
        };
        const response = await executeGraphQLQuery(body.query, body.variables || {}, context);
        if (response.error) {
            return Response.json({
                errors: [
                    {
                        message: response.error
                    }
                ]
            }, {
                status: 400
            });
        }
        return Response.json(response);
    } catch (error) {
        console.error("GraphQL error:", error);
        return Response.json({
            errors: [
                {
                    message: error.message
                }
            ]
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    return Response.json({
        message: "GraphQL endpoint. Use POST requests."
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f9b072d7._.js.map