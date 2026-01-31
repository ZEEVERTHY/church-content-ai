/**
 * Security Middleware
 * Combines rate limiting, authentication, and input validation
 * Following OWASP best practices
 */

import { NextResponse } from 'next/server'
import { supabase } from '../supabase'
import { rateLimit, getRateLimitHeaders } from './rateLimiter'
import { validateRequest } from './inputValidation'
import { serverLog, serverError } from '../logger'

/**
 * Get user from authorization header
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object|null>} User object or null
 */
export async function authenticateRequest(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    serverError('Authentication error:', error)
    return null
  }
}

/**
 * Security middleware wrapper
 * @param {Function} handler - API route handler
 * @param {Object} options - Security options
 * @returns {Function} Wrapped handler
 */
export function withSecurity(handler, options = {}) {
  const {
    requireAuth = true,
    rateLimitType = 'public',
    validationSchema = null,
    allowedMethods = ['POST'],
  } = options

  return async (request) => {
    try {
      // Check HTTP method
      if (!allowedMethods.includes(request.method)) {
        return NextResponse.json(
          { error: `Method ${request.method} not allowed` },
          { status: 405 }
        )
      }

      // Authenticate if required
      let user = null
      if (requireAuth) {
        user = await authenticateRequest(request)
        if (!user) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          )
        }
      }

      // Apply rate limiting
      const rateLimitResult = rateLimit(
        request,
        rateLimitType,
        user?.id || null
      )

      if (rateLimitResult) {
        const headers = {
          'Retry-After': rateLimitResult.retryAfter.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
        
        return NextResponse.json(
          {
            error: 'Too many requests. Please try again later.',
            retryAfter: rateLimitResult.retryAfter,
          },
          {
            status: 429,
            headers,
          }
        )
      }

      // Validate input if schema provided
      // Note: Request body can only be read once, so we clone the request
      let validatedData = null
      if (validationSchema) {
        // Clone request to allow reading body multiple times
        const clonedRequest = request.clone()
        const body = await clonedRequest.json().catch(() => ({}))
        const validation = validateRequest(body, validationSchema)

        if (!validation.valid) {
          return NextResponse.json(
            {
              error: 'Invalid request data',
              details: validation.errors,
            },
            { status: 400 }
          )
        }

        validatedData = validation.data
      }

      // Add rate limit headers to response
      const rateLimitHeaders = getRateLimitHeaders(
        request,
        rateLimitType,
        user?.id || null
      )

      // Call original handler with validated data and user
      const response = await handler(request, {
        user,
        validatedData,
        rateLimitHeaders,
      })

      // Add security headers
      const securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        ...rateLimitHeaders,
      }

      // Merge headers with response
      if (response instanceof NextResponse) {
        Object.entries(securityHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
      }

      return response
    } catch (error) {
      serverError('Security middleware error:', error)
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      )
    }
  }
}
