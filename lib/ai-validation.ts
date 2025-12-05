/**
 * Production-grade input validation and sanitization
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: any;
}

/**
 * Validate tweet content
 */
export function validateTweetContent(content: string): ValidationResult {
  const errors: string[] = [];

  if (!content) {
    errors.push("Content is required");
    return { isValid: false, errors };
  }

  const trimmed = content.trim();

  if (trimmed.length === 0) {
    errors.push("Content cannot be empty");
  }

  if (trimmed.length > 280) {
    errors.push("Content cannot exceed 280 characters");
  }

  if (trimmed.length < 1) {
    errors.push("Content must be at least 1 character");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: trimmed,
  };
}

/**
 * Sanitize content for processing
 */
export function sanitizeContent(content: string): string {
  return (
    content
      // Remove null bytes
      .replace(/\0/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      // Remove control characters except newline/tab
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim()
  );
}

/**
 * Extract mentions safely
 */
export function extractMentions(content: string): string[] {
  const sanitized = sanitizeContent(content);
  const mentionRegex = /@([a-zA-Z0-9_]{1,15})/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(sanitized)) !== null) {
    if (mentions.length < 10) {
      // Limit to 10 mentions
      mentions.push(match[1]);
    }
  }

  return [...new Set(mentions)]; // Remove duplicates
}

/**
 * Extract hashtags safely
 */
export function extractHashtags(content: string): string[] {
  const sanitized = sanitizeContent(content);
  const hashtagRegex = /#([a-zA-Z0-9_]{1,30})/g;
  const hashtags: string[] = [];
  let match;

  while ((match = hashtagRegex.exec(sanitized)) !== null) {
    if (hashtags.length < 30) {
      // Limit to 30 hashtags
      hashtags.push(match[1].toLowerCase());
    }
  }

  return [...new Set(hashtags)]; // Remove duplicates
}

/**
 * Validate user input for usernames
 */
export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];

  if (!username) {
    errors.push("Username is required");
    return { isValid: false, errors };
  }

  if (username.length < 3) {
    errors.push("Username must be at least 3 characters");
  }

  if (username.length > 15) {
    errors.push("Username cannot exceed 15 characters");
  }

  if (!/^[a-zA-Z0-9_]{3,15}$/.test(username)) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: username,
  };
}

/**
 * Validate email
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push("Email is required");
    return { isValid: false, errors };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Invalid email format");
  }

  if (email.length > 254) {
    errors.push("Email is too long");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: email.toLowerCase().trim(),
  };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push("Password is required");
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (password.length > 128) {
    errors.push("Password is too long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one digit");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate JSON request body
 */
export function validateRequestBody(
  body: any,
  requiredFields: string[]
): ValidationResult {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    errors.push("Request body must be a valid JSON object");
    return { isValid: false, errors };
  }

  for (const field of requiredFields) {
    if (!(field in body) || body[field] === undefined) {
      errors.push(`Required field missing: ${field}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: body,
  };
}

/**
 * Rate limit based on user ID with sliding window
 */
const rateLimitStore = new Map<string, number[]>();

export function checkRateLimit(
  userId: string,
  maxRequests: number = 30,
  windowSeconds: number = 60
): boolean {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const timestamps = rateLimitStore.get(userId) || [];

  // Remove old requests outside the window
  const recentRequests = timestamps.filter((ts) => now - ts < windowMs);

  if (recentRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  // Add current request
  recentRequests.push(now);
  rateLimitStore.set(userId, recentRequests);

  return true;
}

/**
 * Get remaining requests for user
 */
export function getRateLimitStatus(
  userId: string,
  maxRequests: number = 30,
  windowSeconds: number = 60
): { remaining: number; resetIn: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const timestamps = rateLimitStore.get(userId) || [];
  const recentRequests = timestamps.filter((ts) => now - ts < windowMs);

  const remaining = Math.max(0, maxRequests - recentRequests.length);
  const resetIn =
    recentRequests.length > 0
      ? Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      : 0;

  return { remaining, resetIn };
}

/**
 * Clear rate limit for user (useful for testing)
 */
export function clearRateLimit(userId: string): void {
  rateLimitStore.delete(userId);
}

/**
 * Validate sentiment analysis result
 */
export function validateSentimentResult(result: any): ValidationResult {
  const errors: string[] = [];

  if (!result) {
    errors.push("Sentiment result is required");
    return { isValid: false, errors };
  }

  const validSentiments = ["positive", "neutral", "negative", "hostile"];
  if (!validSentiments.includes(result.sentiment)) {
    errors.push(`Invalid sentiment. Must be one of: ${validSentiments.join(", ")}`);
  }

  if (!Array.isArray(result.emotionalTone)) {
    errors.push("Emotional tone must be an array");
  }

  if (typeof result.isPersonalAttack !== "boolean") {
    errors.push("isPersonalAttack must be a boolean");
  }

  if (typeof result.confidence !== "number" || result.confidence < 0 || result.confidence > 1) {
    errors.push("Confidence must be a number between 0 and 1");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: result,
  };
}

/**
 * Validate moderation result
 */
export function validateModerationResult(result: any): ValidationResult {
  const errors: string[] = [];

  if (!result) {
    errors.push("Moderation result is required");
    return { isValid: false, errors };
  }

  if (typeof result.isToxic !== "boolean") {
    errors.push("isToxic must be a boolean");
  }

  if (
    typeof result.toxicityScore !== "number" ||
    result.toxicityScore < 0 ||
    result.toxicityScore > 1
  ) {
    errors.push("toxicityScore must be a number between 0 and 1");
  }

  if (!result.reason || typeof result.reason !== "string") {
    errors.push("Reason must be a non-empty string");
  }

  if (typeof result.points !== "number" || result.points < 0) {
    errors.push("Points must be a non-negative number");
  }

  if (typeof result.shouldBlock !== "boolean") {
    errors.push("shouldBlock must be a boolean");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: result,
  };
}

/**
 * Validate empathy score result
 */
export function validateEmpathyResult(result: any): ValidationResult {
  const errors: string[] = [];

  if (!result) {
    errors.push("Empathy result is required");
    return { isValid: false, errors };
  }

  if (typeof result.score !== "number" || result.score < 0 || result.score > 1) {
    errors.push("Score must be a number between 0 and 1");
  }

  if (!Array.isArray(result.suggestions)) {
    errors.push("Suggestions must be an array");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: result,
  };
}
