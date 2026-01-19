// Rate limiting utility for API routes
// Uses in-memory storage (for production, use Redis)

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Max requests per window
}

const defaultConfig: RateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
};

const authConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 auth attempts per 15 minutes
};

const strictConfig: RateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 requests per minute
};

export type RateLimitType = 'default' | 'auth' | 'strict';

const configs: Record<RateLimitType, RateLimitConfig> = {
    default: defaultConfig,
    auth: authConfig,
    strict: strictConfig,
};

export function checkRateLimit(
    identifier: string,
    type: RateLimitType = 'default'
): { allowed: boolean; remaining: number; resetIn: number } {
    const config = configs[type];
    const now = Date.now();
    const key = `${type}:${identifier}`;

    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
        // Create new entry
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetIn: config.windowMs,
        };
    }

    if (entry.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetIn: entry.resetTime - now,
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(key, entry);

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetIn: entry.resetTime - now,
    };
}

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 60 * 1000); // Clean up every minute

// Helper for API routes
export function getRateLimitHeaders(result: { remaining: number; resetIn: number }) {
    return {
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(result.resetIn / 1000).toString(),
    };
}
