/**
 * Production-grade utilities for AI features
 * Handles: Retry logic, rate limiting, circuit breakers, request timeouts, caching
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CircuitBreakerState {
  state: "closed" | "open" | "half-open";
  failureCount: number;
  lastFailureTime: number;
  successCount?: number;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry<any>>();

// Circuit breaker states for different services
const circuitBreakers = new Map<string, CircuitBreakerState>();

/**
 * Initialize circuit breaker for a service
 */
export function initCircuitBreaker(serviceName: string): void {
  if (!circuitBreakers.has(serviceName)) {
    circuitBreakers.set(serviceName, {
      state: "closed",
      failureCount: 0,
      lastFailureTime: 0,
      successCount: 0,
    });
  }
}

/**
 * Check circuit breaker state
 */
export function checkCircuitBreaker(serviceName: string): boolean {
  const breaker = circuitBreakers.get(serviceName);
  if (!breaker) {
    initCircuitBreaker(serviceName);
    return true;
  }

  if (breaker.state === "closed") {
    return true;
  }

  if (breaker.state === "open") {
    // Try to transition to half-open after timeout (30 seconds)
    if (Date.now() - breaker.lastFailureTime > 30000) {
      breaker.state = "half-open";
      breaker.successCount = 0;
      return true;
    }
    return false;
  }

  // Half-open state
  return true;
}

/**
 * Record circuit breaker failure
 */
export function recordCircuitBreakerFailure(serviceName: string): void {
  const breaker = circuitBreakers.get(serviceName);
  if (!breaker) {
    initCircuitBreaker(serviceName);
    return;
  }

  breaker.failureCount++;
  breaker.lastFailureTime = Date.now();

  // Open circuit after 5 failures
  if (breaker.failureCount >= 5) {
    breaker.state = "open";
    console.warn(
      `[CIRCUIT BREAKER] Service ${serviceName} is now OPEN after ${breaker.failureCount} failures`
    );
  }
}

/**
 * Record circuit breaker success
 */
export function recordCircuitBreakerSuccess(serviceName: string): void {
  const breaker = circuitBreakers.get(serviceName);
  if (!breaker) return;

  if (breaker.state === "half-open") {
    breaker.successCount = (breaker.successCount ?? 0) + 1;
    // Close circuit after 2 successful requests in half-open state
    if (breaker.successCount >= 2) {
      breaker.state = "closed";
      breaker.failureCount = 0;
      console.info(`[CIRCUIT BREAKER] Service ${serviceName} is now CLOSED`);
    }
  } else if (breaker.state === "closed") {
    breaker.failureCount = Math.max(0, breaker.failureCount - 1);
  }
}

/**
 * Get from cache
 */
export function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  // Check if expired
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Set in cache with TTL
 */
export function setInCache<T>(key: string, data: T, ttlMs: number = 300000): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  });

  // Cleanup old entries every 5 minutes
  if (cache.size > 1000) {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (now - v.timestamp > v.ttl) {
        cache.delete(k);
      }
    }
  }
}

/**
 * Clear cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelayMs: number = 100,
  maxDelayMs: number = 5000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts) {
        // Exponential backoff with jitter
        const delay = Math.min(
          baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * baseDelayMs,
          maxDelayMs
        );

        console.warn(
          `[RETRY] Attempt ${attempt}/${maxAttempts} failed. Retrying in ${Math.round(delay)}ms. Error: ${lastError.message}`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Request timeout wrapper
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = "Request timeout"
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Rate limiter with token bucket algorithm
 */
export class RateLimiter {
  private tokens: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second
  private lastRefillTime: number;

  constructor(maxTokens: number = 10, refillRatePerSecond: number = 5) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRatePerSecond;
    this.tokens = maxTokens;
    this.lastRefillTime = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const secondsElapsed = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = secondsElapsed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  public async acquire(tokens: number = 1): Promise<void> {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return;
    }

    // Calculate wait time
    const waitSeconds = (tokens - this.tokens) / this.refillRate;
    const waitMs = waitSeconds * 1000;

    console.warn(
      `[RATE LIMITER] Limit reached. Waiting ${Math.round(waitMs)}ms before retry`
    );

    await new Promise((resolve) => setTimeout(resolve, waitMs));
    this.refill();
    this.tokens -= tokens;
  }

  public getAvailableTokens(): number {
    this.refill();
    return this.tokens;
  }
}

/**
 * Create a rate limiter for OpenRouter API (2 requests per second typical limit)
 */
export const openRouterRateLimiter = new RateLimiter(10, 2);

/**
 * Validate AI service response
 */
export function validateAIResponse(response: any, expectedFields: string[]): boolean {
  if (!response || typeof response !== "object") {
    return false;
  }

  for (const field of expectedFields) {
    if (!(field in response)) {
      return false;
    }
  }

  return true;
}

/**
 * Parse JSON safely with fallback
 */
export function safeParseJSON<T>(
  content: string,
  fallback: T
): T {
  try {
    // Try to extract JSON from content (in case it's wrapped in markdown or extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    return JSON.parse(content) as T;
  } catch {
    console.error("[JSON_PARSE_ERROR] Failed to parse response:", content);
    return fallback;
  }
}

/**
 * Health check for AI services
 */
export interface ServiceHealth {
  isHealthy: boolean;
  lastCheckTime: number;
  status: "ok" | "degraded" | "down";
}

const serviceHealth = new Map<string, ServiceHealth>();

export function getServiceHealth(serviceName: string): ServiceHealth {
  return (
    serviceHealth.get(serviceName) || {
      isHealthy: true,
      lastCheckTime: Date.now(),
      status: "ok",
    }
  );
}

export function setServiceHealth(
  serviceName: string,
  health: ServiceHealth
): void {
  serviceHealth.set(serviceName, {
    ...health,
    lastCheckTime: Date.now(),
  });
}

/**
 * Production logger with context
 */
export class ProductionLogger {
  private context: Record<string, any>;

  constructor(context: Record<string, any> = {}) {
    this.context = context;
  }

  private formatLog(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr =
      Object.keys(this.context).length > 0
        ? ` [${Object.entries(this.context)
            .map(([k, v]) => `${k}=${v}`)
            .join(", ")}]`
        : "";

    const dataStr = data ? ` ${JSON.stringify(data)}` : "";

    return `${timestamp} [${level}]${contextStr} ${message}${dataStr}`;
  }

  info(message: string, data?: any): void {
    console.log(this.formatLog("INFO", message, data));
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatLog("WARN", message, data));
  }

  error(message: string, data?: any): void {
    console.error(this.formatLog("ERROR", message, data));
  }

  debug(message: string, data?: any): void {
    if (process.env.DEBUG === "true") {
      console.log(this.formatLog("DEBUG", message, data));
    }
  }
}

/**
 * Batch requests with timeout
 */
export async function batchRequests<T>(
  requests: Promise<T>[],
  timeoutMs: number = 30000,
  onError?: (error: Error, index: number) => void
): Promise<(T | null)[]> {
  return Promise.all(
    requests.map(async (promise, index) => {
      try {
        return await withTimeout(promise, timeoutMs);
      } catch (error) {
        onError?.(error as Error, index);
        return null;
      }
    })
  );
}
