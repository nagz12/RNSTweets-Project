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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectDB",
    ()=>connectDB
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:Admin.12345@cluster0.ajzsclc.mongodb.net/?appName=Cluster0";
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
"[project]/lib/models/User.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/models/Tweet.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/models/Demerit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/models/Notification.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
            "mention"
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
"[project]/lib/models/Hashtag.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/ai-moderation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSuspensionThreshold",
    ()=>getSuspensionThreshold,
    "moderateContent",
    ()=>moderateContent
]);
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1";
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
        let points = 0;
        if (toxicityScore >= DEMERIT_THRESHOLDS.HIGH_TOXICITY.score) {
            points = DEMERIT_THRESHOLDS.HIGH_TOXICITY.points;
        } else if (toxicityScore >= DEMERIT_THRESHOLDS.MEDIUM_TOXICITY.score) {
            points = DEMERIT_THRESHOLDS.MEDIUM_TOXICITY.points;
        } else if (toxicityScore >= DEMERIT_THRESHOLDS.LOW_TOXICITY.score) {
            points = DEMERIT_THRESHOLDS.LOW_TOXICITY.points;
        }
        return {
            isToxic: parsed.isToxic || toxicityScore > 0.3,
            toxicityScore,
            reason: parsed.reason || parsed.categories?.join(", ") || "Potentially harmful content",
            points,
            shouldBlock: toxicityScore > 0.6
        };
    } catch (error) {
        console.error("Moderation error:", error);
        // Return safe default on error
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
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const JWT_EXPIRY = "7d";
function generateToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY
    });
}
function verifyToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
    } catch  {
        return null;
    }
}
async function setAuthCookie(token) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
    });
}
async function getAuthToken() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get("auth-token")?.value || null;
}
async function clearAuthCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete("auth-token");
}
async function getAuthUser() {
    const token = await getAuthToken();
    if (!token) return null;
    return verifyToken(token);
}
}),
"[project]/lib/utils-twitter.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Twitter-specific utility functions
__turbopack_context__.s([
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
}),
"[project]/app/api/tweets/create/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Tweet.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Demerit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Demerit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Notification.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Hashtag$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Hashtag.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai-moderation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2d$twitter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils-twitter.ts [app-route] (ecmascript)");
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
async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split(" ")[1];
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Not authenticated"
            }, {
                status: 401
            });
        }
        const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid token"
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const { content, media } = body;
        if (!content || content.trim().length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Content is required"
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
        const dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(user.userId);
        if (dbUser?.isSuspended) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Your account is suspended"
            }, {
                status: 403
            });
        }
        const moderation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["moderateContent"])(content);
        if (moderation.shouldBlock) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                _id: dbUser?._id
            }, {
                $inc: {
                    demeritPoints: moderation.points
                }
            });
            const tweet = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].create({
                content,
                author: dbUser?._id,
                isFlagged: true,
                flagReason: moderation.reason,
                isDeleted: true
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Demerit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Demerit"].create({
                user: dbUser?._id,
                tweet: tweet._id,
                reason: moderation.reason,
                points: moderation.points,
                toxicityScore: moderation.toxicityScore,
                content
            });
            const updatedUser = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(dbUser?._id);
            if (updatedUser && updatedUser.demeritPoints >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSuspensionThreshold"])()) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                    _id: dbUser?._id
                }, {
                    isSuspended: true
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Tweet blocked due to ${moderation.reason}. Demerits: ${moderation.points}`
            }, {
                status: 400
            });
        }
        const hashtags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2d$twitter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractHashtags"])(content);
        const mentions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2d$twitter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractMentions"])(content);
        const mentionedUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].find({
            username: {
                $in: mentions
            }
        });
        const mentionedUserIds = mentionedUsers.map((u)=>u._id);
        const tweet = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].create({
            content,
            author: dbUser?._id,
            media: media || [],
            hashtags,
            mentions: mentionedUserIds
        });
        // Update hashtag counts
        for (const tag of hashtags){
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Hashtag$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Hashtag"].findOneAndUpdate({
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
        // Create notifications for mentions
        for (const mentionedUserId of mentionedUserIds){
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].create({
                user: mentionedUserId,
                actor: dbUser?._id,
                type: "mention",
                tweet: tweet._id
            });
        }
        const populatedTweet = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Tweet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tweet"].findById(tweet._id).populate("author").lean();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            tweet: {
                ...populatedTweet,
                id: populatedTweet?._id,
                author: {
                    ...populatedTweet?.author,
                    id: populatedTweet?.author?._id
                },
                likes: populatedTweet?.likes?.length || 0,
                retweets: populatedTweet?.retweets?.length || 0,
                replies: populatedTweet?.replies?.length || 0
            }
        });
    } catch (error) {
        console.error("Create tweet error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Failed to create tweet"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__31566e52._.js.map