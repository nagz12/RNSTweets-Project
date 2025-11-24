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
        required: false
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
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/BullyingPattern.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BullyingPattern",
    ()=>BullyingPattern
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const bullyingPatternSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    offender: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    victim: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    patternType: {
        type: String,
        enum: [
            "stalking",
            "coordinated",
            "persistent"
        ],
        required: true
    },
    incidentCount: {
        type: Number,
        default: 1
    },
    firstIncident: {
        type: Date,
        default: Date.now
    },
    lastIncident: {
        type: Date,
        default: Date.now
    },
    isResolved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Index for efficient pattern queries
bullyingPatternSchema.index({
    offender: 1,
    victim: 1
});
bullyingPatternSchema.index({
    isResolved: 1,
    lastIncident: -1
});
const BullyingPattern = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.BullyingPattern || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("BullyingPattern", bullyingPatternSchema);
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
        // Always assign demerit points if content is toxic
        if (isToxicContent) {
            if (toxicityScore >= DEMERIT_THRESHOLDS.HIGH_TOXICITY.score) {
                points = DEMERIT_THRESHOLDS.HIGH_TOXICITY.points;
            } else if (toxicityScore >= DEMERIT_THRESHOLDS.MEDIUM_TOXICITY.score) {
                points = DEMERIT_THRESHOLDS.MEDIUM_TOXICITY.points;
            } else if (toxicityScore >= DEMERIT_THRESHOLDS.LOW_TOXICITY.score) {
                points = DEMERIT_THRESHOLDS.LOW_TOXICITY.points;
            } else {
                // Even low toxic content gets minimum points
                points = DEMERIT_THRESHOLDS.LOW_TOXICITY.points;
            }
        }
        return {
            isToxic: isToxicContent,
            toxicityScore,
            reason: parsed.reason || parsed.categories?.join(", ") || "Potentially harmful content",
            points,
            // Block content if it's toxic (toxicityScore > 0.3) or if AI explicitly marked it as toxic
            // Lower threshold to catch moderate toxicity like "you're stupid"
            shouldBlock: isToxicContent || toxicityScore >= 0.4
        };
    } catch (error) {
        console.error("Moderation error:", error);
        // Log the content that failed moderation for debugging
        console.error("Failed to moderate content:", content);
        // Return safe default on error - but log it prominently
        // TODO: Consider a stricter default (block by default) in production
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
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/ai-advanced-moderation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeReplyContext",
    ()=>analyzeReplyContext,
    "analyzeSentiment",
    ()=>analyzeSentiment,
    "detectBullyingPattern",
    ()=>detectBullyingPattern,
    "enhanceContent",
    ()=>enhanceContent,
    "generateEmpathyScore",
    ()=>generateEmpathyScore
]);
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
async function analyzeSentiment(content, mentions) {
    if (!OPENROUTER_API_KEY) {
        throw new Error("OPENROUTER_API_KEY is not set");
    }
    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b:free",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert sentiment analyzer. Respond with ONLY valid JSON."
                    },
                    {
                        role: "user",
                        content: `Analyze this social media post for emotional tone and potential personal attacks. Return ONLY valid JSON:
{
  "sentiment": "positive|neutral|negative|hostile",
  "emotionalTone": ["supportive", "aggressive", "sarcastic", "threatening", etc.],
  "isPersonalAttack": boolean,
  "confidence": number (0-1)
}

Mentioned users: ${mentions.join(", ") || "none"}
Post: "${content}"`
                    }
                ],
                temperature: 0.2,
                max_tokens: 150
            })
        });
        const data = await response.json();
        const aiResponse = data?.choices?.[0]?.message?.content;
        const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
        return {
            sentiment: parsed.sentiment || "neutral",
            emotionalTone: parsed.emotionalTone || [],
            targetedUser: mentions[0],
            isPersonalAttack: parsed.isPersonalAttack || false,
            confidence: parsed.confidence || 0.5
        };
    } catch (error) {
        console.error("Sentiment analysis error:", error);
        return {
            sentiment: "neutral",
            emotionalTone: [],
            isPersonalAttack: false,
            confidence: 0
        };
    }
}
async function enhanceContent(content, moderationResult) {
    if (!OPENROUTER_API_KEY || !moderationResult.isToxic) {
        return {
            shouldWarn: false
        };
    }
    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b:free",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that rephrases harmful content into constructive communication."
                    },
                    {
                        role: "user",
                        content: `This post was flagged as potentially harmful. Suggest 3 alternative ways to express the same idea more constructively. Return ONLY valid JSON:
{
  "warningMessage": "brief warning about the issue",
  "suggestedEdit": "rewritten version maintaining intent but removing harm",
  "alternativePhrasing": ["option 1", "option 2", "option 3"]
}

Original post: "${content}"
Issue detected: ${moderationResult.reason}`
                    }
                ],
                temperature: 0.4,
                max_tokens: 300
            })
        });
        const data = await response.json();
        const aiResponse = data?.choices?.[0]?.message?.content;
        const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
        return {
            shouldWarn: true,
            warningMessage: parsed.warningMessage || "This content may be harmful to others",
            suggestedEdit: parsed.suggestedEdit,
            alternativePhrasing: parsed.alternativePhrasing || []
        };
    } catch (error) {
        console.error("Content enhancement error:", error);
        return {
            shouldWarn: true,
            warningMessage: "Please review your post for potentially harmful content"
        };
    }
}
async function detectBullyingPattern(userId, targetUsername, timeWindowDays = 7) {
    try {
        const { Tweet } = await __turbopack_context__.A("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Tweet.ts [app-route] (ecmascript, async loader)");
        const { Demerit } = await __turbopack_context__.A("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Demerit.ts [app-route] (ecmascript, async loader)");
        const { connectDB } = await __turbopack_context__.A("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/db.ts [app-route] (ecmascript, async loader)");
        await connectDB();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeWindowDays);
        // Find tweets mentioning target user
        const tweets = await Tweet.find({
            author: userId,
            content: {
                $regex: `@${targetUsername}`,
                $options: "i"
            },
            createdAt: {
                $gte: startDate
            }
        }).lean();
        // Find demerits against this user
        const demerits = await Demerit.find({
            user: userId,
            createdAt: {
                $gte: startDate
            }
        }).lean();
        const isRepeatOffender = demerits.length >= 3;
        const targetedHarassment = tweets.length >= 5;
        // Check for coordinated harassment (multiple flagged mentions)
        const flaggedMentions = tweets.filter((t)=>t.isFlagged).length;
        let patternType;
        if (targetedHarassment && flaggedMentions >= 3) {
            patternType = "stalking";
        } else if (isRepeatOffender && targetedHarassment) {
            patternType = "persistent";
        }
        return {
            isRepeatOffender,
            targetedHarassment,
            victimUsername: targetedHarassment ? targetUsername : undefined,
            patternType
        };
    } catch (error) {
        console.error("Pattern detection error:", error);
        return {
            isRepeatOffender: false,
            targetedHarassment: false
        };
    }
}
async function analyzeReplyContext(originalPost, reply) {
    if (!OPENROUTER_API_KEY) {
        return {
            isAppropriate: true
        };
    }
    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b:free",
                messages: [
                    {
                        role: "user",
                        content: `Analyze if this reply is appropriate and constructive given the original post. Return ONLY valid JSON:
{
  "isAppropriate": boolean,
  "reason": "explanation if inappropriate"
}

Original post: "${originalPost}"
Reply: "${reply}"`
                    }
                ],
                temperature: 0.2,
                max_tokens: 100
            })
        });
        const data = await response.json();
        const aiResponse = data?.choices?.[0]?.message?.content;
        const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
        return {
            isAppropriate: parsed.isAppropriate ?? true,
            reason: parsed.reason
        };
    } catch (error) {
        console.error("Reply context analysis error:", error);
        return {
            isAppropriate: true
        };
    }
}
async function generateEmpathyScore(content) {
    if (!OPENROUTER_API_KEY) {
        return {
            score: 0.5,
            suggestions: []
        };
    }
    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b:free",
                messages: [
                    {
                        role: "user",
                        content: `Rate the empathy and emotional intelligence of this post (0-1 scale). Return ONLY valid JSON:
{
  "score": number (0-1, where 1 is highly empathetic),
  "suggestions": ["ways to be more empathetic"]
}

Post: "${content}"`
                    }
                ],
                temperature: 0.3,
                max_tokens: 150
            })
        });
        const data = await response.json();
        const aiResponse = data?.choices?.[0]?.message?.content;
        const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
        return {
            score: parsed.score || 0.5,
            suggestions: parsed.suggestions || []
        };
    } catch (error) {
        console.error("Empathy score error:", error);
        return {
            score: 0.5,
            suggestions: []
        };
    }
}
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/utils-twitter.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Twitter-specific utility functions
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
        // Bad tweet: decrease score significantly
        // More toxic = bigger decrease (2-8 points)
        const decreaseAmount = isToxic ? 8 : Math.max(2, Math.round((0.3 - empathyScore) * 10));
        newScore = Math.max(0, currentScore - decreaseAmount);
    } else if (empathyScore >= 0.7) {
        // Excellent tweet: increase score significantly (3-5 points)
        const increaseAmount = Math.round(3 + (empathyScore - 0.7) * 6); // 3-5 points
        newScore = Math.min(100, currentScore + increaseAmount);
    } else if (empathyScore >= 0.5) {
        // Good tweet: increase score moderately (1-2 points)
        const increaseAmount = Math.round(1 + (empathyScore - 0.5) * 5); // 1-2 points
        newScore = Math.min(100, currentScore + increaseAmount);
    } else {
        // Below average but not toxic: small decrease (0-1 point)
        const decreaseAmount = Math.round((0.5 - empathyScore) * 2);
        newScore = Math.max(0, currentScore - decreaseAmount);
    }
    // Ensure score stays within 0-100 range
    return Math.max(0, Math.min(100, newScore));
}
}),
"[project]/OneDrive/Desktop/rnst-weets-social-platform/app/api/messages/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Message.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Notification.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Demerit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/Demerit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$BullyingPattern$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/models/BullyingPattern.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/ai-moderation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$ai$2d$advanced$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/ai-advanced-moderation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$utils$2d$twitter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/rnst-weets-social-platform/lib/utils-twitter.ts [app-route] (ecmascript)");
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
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const token = authHeader.substring(7);
        let decoded;
        try {
            decoded = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
        } catch (err) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid token"
            }, {
                status: 401
            });
        }
        const { searchParams } = new URL(req.url);
        const conversationWith = searchParams.get("conversationWith");
        if (!conversationWith) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "conversationWith parameter is required"
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
        const messages = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Message"].find({
            $or: [
                {
                    sender: decoded.userId,
                    recipient: conversationWith
                },
                {
                    sender: conversationWith,
                    recipient: decoded.userId
                }
            ]
        }).populate("sender", "_id displayName username profilePictureUrl").populate("recipient", "_id displayName username profilePictureUrl").sort({
            createdAt: 1
        }).lean();
        // Filter out messages with null sender/recipient (shouldn't happen but be safe)
        const validMessages = messages.filter((msg)=>msg.sender && msg.recipient);
        // Mark messages as read
        await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Message"].updateMany({
            sender: conversationWith,
            recipient: decoded.userId,
            isRead: false
        }, {
            isRead: true
        });
        const formattedMessages = validMessages.map((msg)=>({
                id: msg._id.toString(),
                sender: {
                    id: msg.sender._id.toString(),
                    displayName: msg.sender.displayName,
                    username: msg.sender.username,
                    avatar: msg.sender.profilePictureUrl || msg.sender.avatar
                },
                recipient: {
                    id: msg.recipient._id.toString(),
                    displayName: msg.recipient.displayName,
                    username: msg.recipient.username,
                    avatar: msg.recipient.profilePictureUrl || msg.recipient.avatar
                },
                content: msg.content,
                isRead: msg.isRead,
                createdAt: msg.createdAt
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            messages: formattedMessages
        });
    } catch (error) {
        console.error("Get messages error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to get messages"
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const token = authHeader.substring(7);
        let decoded;
        try {
            decoded = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
        } catch (err) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid token"
            }, {
                status: 401
            });
        }
        const { recipientId, content } = await req.json();
        if (!recipientId || !content || !content.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "recipientId and content are required"
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
        const recipient = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(recipientId);
        if (!recipient) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Recipient not found"
            }, {
                status: 404
            });
        }
        // Prevent sending message to yourself
        if (decoded.userId === recipientId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "You cannot send a message to yourself"
            }, {
                status: 400
            });
        }
        // Check if sender is suspended
        const dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(decoded.userId);
        if (!dbUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User not found"
            }, {
                status: 404
            });
        }
        if (dbUser.isSuspended) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Your account is suspended. You cannot send messages."
            }, {
                status: 403
            });
        }
        // AI Moderation: Check message content for toxicity
        const moderation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["moderateContent"])(content.trim());
        // Check for bullying patterns (repeated messaging/harassment)
        // For messages, we check if user has been repeatedly targeting this recipient
        let bullyingDetected = false;
        let patternWarning = "";
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            // Check recent demerits for this user
            const recentDemerits = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Demerit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Demerit"].find({
                user: dbUser._id,
                createdAt: {
                    $gte: sevenDaysAgo
                }
            }).lean();
            // Check for existing bullying patterns with this recipient
            const existingPattern = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$BullyingPattern$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BullyingPattern"].findOne({
                offender: dbUser._id,
                victim: recipientId,
                isResolved: false
            }).lean();
            // If user has 3+ demerits in last 7 days and is targeting this user, it's bullying
            if (recentDemerits.length >= 3 && existingPattern) {
                bullyingDetected = true;
                patternWarning = `Detected ${existingPattern.patternType || "persistent"} behavior pattern`;
            }
            // Also check if this is part of a stalking pattern (multiple messages to same user)
            const recentMessages = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Message"].find({
                sender: dbUser._id,
                recipient: recipientId,
                createdAt: {
                    $gte: sevenDaysAgo
                }
            }).lean();
            // If user has sent 5+ messages recently and this message is toxic, flag as potential stalking
            if (recentMessages.length >= 5 && recentDemerits.length >= 2 && moderation.isToxic) {
                bullyingDetected = true;
                patternWarning = "Detected stalking behavior pattern - repeated toxic messages";
                // Log the pattern
                await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$BullyingPattern$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BullyingPattern"].findOneAndUpdate({
                    offender: dbUser._id,
                    victim: recipientId
                }, {
                    $set: {
                        lastIncident: new Date()
                    },
                    $inc: {
                        incidentCount: 1
                    },
                    $setOnInsert: {
                        offender: dbUser._id,
                        victim: recipientId,
                        patternType: "stalking",
                        firstIncident: new Date()
                    }
                }, {
                    upsert: true,
                    new: true
                });
            }
        } catch (patternError) {
            console.error("Bullying pattern detection error:", patternError);
        // Continue without blocking on pattern detection errors
        }
        // Block if toxic or bullying detected
        if (moderation.shouldBlock || bullyingDetected) {
            const totalPoints = moderation.points + (bullyingDetected ? 10 : 0);
            // Add demerit points
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                _id: dbUser._id
            }, {
                $inc: {
                    demeritPoints: totalPoints
                }
            });
            // Log blocked message attempt (don't save the message)
            console.log(`[MODERATION] Blocked message from ${dbUser._id} to ${recipientId}, Reason: ${bullyingDetected ? "Bullying pattern" : moderation.reason}, Toxicity: ${moderation.toxicityScore}`);
            // Create demerit record (tweet is optional for messages)
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Demerit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Demerit"].create({
                user: dbUser._id,
                tweet: undefined,
                reason: bullyingDetected ? patternWarning || "Bullying pattern detected in message" : moderation.reason,
                points: totalPoints,
                toxicityScore: moderation.toxicityScore,
                content: content.trim()
            });
            // Update empathy score for blocked toxic message (decrease significantly)
            const currentEmpathyScore = dbUser.empathyScore ?? 50;
            const newEmpathyScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$utils$2d$twitter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateNewEmpathyScore"])(currentEmpathyScore, 0.1, true // Mark as toxic
            );
            // Check if suspension is needed (either low empathy OR high demerits)
            const finalDemeritPoints = (dbUser.demeritPoints ?? 0) + totalPoints;
            const shouldSuspend = newEmpathyScore < 35 || finalDemeritPoints >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$ai$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSuspensionThreshold"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                _id: dbUser._id
            }, {
                empathyScore: newEmpathyScore,
                isSuspended: shouldSuspend
            });
            if (shouldSuspend) {
                console.log(`[MODERATION] User ${dbUser._id} suspended - Demerits: ${finalDemeritPoints}, Empathy: ${newEmpathyScore}%`);
            }
            // Return error - message NOT sent
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: bullyingDetected ? `Message blocked: Bullying pattern detected. Demerits: ${totalPoints}` : `Message blocked due to ${moderation.reason}. Demerits: ${totalPoints}`
            }, {
                status: 400
            });
        }
        // Message passed moderation - generate empathy score for tracking
        const empathyAnalysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$ai$2d$advanced$2d$moderation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateEmpathyScore"])(content.trim());
        // Create the message
        const message = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Message"].create({
            sender: decoded.userId,
            recipient: recipientId,
            content: content.trim(),
            isRead: false
        });
        // Update empathy score for good messages (increase if empathetic)
        const currentEmpathyScore = dbUser.empathyScore ?? 50;
        const newEmpathyScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$utils$2d$twitter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateNewEmpathyScore"])(currentEmpathyScore, empathyAnalysis.score, false // Message passed moderation, so it's NOT toxic
        );
        // Update user's empathy score
        await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
            _id: dbUser._id
        }, {
            empathyScore: newEmpathyScore
        });
        // Check if empathy score dropped below 35% - suspend account
        if (newEmpathyScore < 35 && !dbUser.isSuspended) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].updateOne({
                _id: dbUser._id
            }, {
                isSuspended: true
            });
            console.log(`[EMPATHY] User ${dbUser._id} suspended due to low empathy score: ${newEmpathyScore}%`);
        }
        // Log if empathy score reached 100%
        if (newEmpathyScore >= 100 && currentEmpathyScore < 100) {
            console.log(`[EMPATHY] User ${dbUser._id} reached 100% empathy score!`);
        }
        console.log(`[EMPATHY] User ${dbUser._id} - Score: ${currentEmpathyScore}% -> ${newEmpathyScore}% (Message empathy: ${empathyAnalysis.score}, Was toxic: false)`);
        const populatedMessage = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Message$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Message"].findById(message._id).populate("sender", "_id displayName username profilePictureUrl").populate("recipient", "_id displayName username profilePictureUrl").lean();
        if (!populatedMessage) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to create message"
            }, {
                status: 500
            });
        }
        // Validate populated fields
        if (!populatedMessage.sender || !populatedMessage.recipient) {
            console.error("Failed to populate sender or recipient:", populatedMessage);
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to load user information. Please check if the recipient user exists."
            }, {
                status: 500
            });
        }
        // Create notification for recipient (don't fail if notification creation fails)
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$lib$2f$models$2f$Notification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Notification"].create({
                user: recipientId,
                actor: decoded.userId,
                type: "message",
                isRead: false
            });
        } catch (notifError) {
            console.error("Failed to create notification (non-fatal):", notifError);
        // Continue even if notification creation fails
        }
        const formattedMessage = {
            id: populatedMessage._id.toString(),
            sender: {
                id: populatedMessage.sender._id.toString(),
                displayName: populatedMessage.sender.displayName,
                username: populatedMessage.sender.username,
                avatar: populatedMessage.sender.profilePictureUrl || populatedMessage.sender.avatar || null
            },
            recipient: {
                id: populatedMessage.recipient._id.toString(),
                displayName: populatedMessage.recipient.displayName,
                username: populatedMessage.recipient.username,
                avatar: populatedMessage.recipient.profilePictureUrl || populatedMessage.recipient.avatar || null
            },
            content: populatedMessage.content,
            isRead: populatedMessage.isRead,
            createdAt: populatedMessage.createdAt
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: formattedMessage
        });
    } catch (error) {
        console.error("Send message error:", error);
        const errorMessage = error?.message || "Failed to send message";
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$rnst$2d$weets$2d$social$2d$platform$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: errorMessage
        }, {
            status: error?.statusCode || 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f34ce4c1._.js.map