/**
 * Rate Limiting Middleware
 * Implements IP-based and user-based rate limiting following OWASP best practices
 * 
 * Uses in-memory store for simplicity (consider Redis for production scale)
 */

// In-memory rate limit store
// In production, use Redis or similar for distributed systems
const rateLimitStore = new Map()

// Rate limit configuration
const RATE_LIMITS = {
  // Public endpoints (no auth required)
  public: {
    requests: 100, // requests per window
    window: 15 * 60 * 1000, // 15 minutes in milliseconds
  },
  // Authenticated endpoints
  authenticated: {
    requests: 200, // requests per window
    window: 15 * 60 * 1000, // 15 minutes
  },
  // Generation endpoints (expensive operations)
  generation: {
    requests: 10, // requests per window
    window: 60 * 60 * 1000, // 1 hour
  },
  // Regeneration endpoints
  regeneration: {
    requests: 20, // requests per window
    window: 60 * 60 * 1000, // 1 hour
  },
  // Save/update endpoints
  save: {
    requests: 50, // requests per window
    window: 15 * 60 * 1000, // 15 minutes
  },
  // Stripe checkout
  checkout: {
    requests: 5, // requests per window
    window: 15 * 60 * 1000, // 15 minutes
  },
}

/**
 * Get client identifier (IP address or user ID)
 * @param {Request} request - Next.js request object
 * @param {string|null} userId - Optional user ID for authenticated requests
 * @returns {string} Client identifier
 */
function getClientId(request, userId = null) {
  // For authenticated requests, use user ID (more accurate)
  if (userId) {
    return `user:${userId}`
  }
  
  // For unauthenticated requests, use IP address
  // Get IP from various headers (respects proxies)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
  
  return `ip:${ip}`
}

/**
 * Check rate limit for a client
 * @param {string} clientId - Client identifier
 * @param {string} limitType - Type of rate limit (public, authenticated, generation, etc.)
 * @returns {Object} Rate limit status
 */
function checkRateLimit(clientId, limitType) {
  const limit = RATE_LIMITS[limitType]
  if (!limit) {
    // No limit configured, allow request
    return { allowed: true, remaining: Infinity, resetTime: null }
  }

  const now = Date.now()
  const key = `${clientId}:${limitType}`
  const record = rateLimitStore.get(key)

  // Clean up old records periodically (every 1000 checks)
  if (Math.random() < 0.001) {
    cleanupOldRecords(now)
  }

  if (!record || now > record.resetTime) {
    // New window or expired, reset
    const resetTime = now + limit.window
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    })
    return {
      allowed: true,
      remaining: limit.requests - 1,
      resetTime,
    }
  }

  // Increment count
  record.count++

  if (record.count > limit.requests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  return {
    allowed: true,
    remaining: limit.requests - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Clean up old rate limit records
 * @param {number} now - Current timestamp
 */
function cleanupOldRecords(now) {
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Rate limiting middleware
 * @param {Request} request - Next.js request object
 * @param {string} limitType - Type of rate limit to apply
 * @param {string|null} userId - Optional user ID for authenticated requests
 * @returns {Object} Rate limit result or null if allowed
 */
export function rateLimit(request, limitType = 'public', userId = null) {
  const clientId = getClientId(request, userId)
  const result = checkRateLimit(clientId, limitType)

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000)
    return {
      error: 'Too many requests',
      status: 429,
      retryAfter,
      resetTime: result.resetTime,
    }
  }

  return null
}

/**
 * Get rate limit headers for response
 * @param {Request} request - Next.js request object
 * @param {string} limitType - Type of rate limit
 * @param {string|null} userId - Optional user ID
 * @returns {Object} Headers to add to response
 */
export function getRateLimitHeaders(request, limitType = 'public', userId = null) {
  const clientId = getClientId(request, userId)
  const limit = RATE_LIMITS[limitType]
  const key = `${clientId}:${limitType}`
  const record = rateLimitStore.get(key)

  if (!limit) {
    return {}
  }

  const remaining = record
    ? Math.max(0, limit.requests - record.count)
    : limit.requests
  const resetTime = record?.resetTime || Date.now() + limit.window

  return {
    'X-RateLimit-Limit': limit.requests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  }
}

/**
 * Reset rate limit for a client (admin function)
 * @param {string} clientId - Client identifier
 * @param {string} limitType - Type of rate limit
 */
export function resetRateLimit(clientId, limitType) {
  const key = `${clientId}:${limitType}`
  rateLimitStore.delete(key)
}
