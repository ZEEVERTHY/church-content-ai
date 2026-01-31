# Security Implementation

This document outlines the security measures implemented in the ChurchContentAI application, following OWASP best practices.

## 1. Rate Limiting

### Implementation
- **Location**: `lib/security/rateLimiter.js`
- **Type**: IP-based and user-based rate limiting
- **Storage**: In-memory (consider Redis for production scale)

### Rate Limits

| Endpoint Type | Requests | Window | Notes |
|--------------|----------|--------|-------|
| Public | 100 | 15 minutes | Unauthenticated endpoints |
| Authenticated | 200 | 15 minutes | General authenticated endpoints |
| Generation | 10 | 1 hour | Content generation (expensive) |
| Regeneration | 20 | 1 hour | Section regeneration |
| Save | 50 | 15 minutes | Save/update/delete operations |
| Checkout | 5 | 15 minutes | Stripe checkout sessions |

### Response Headers
All rate-limited endpoints return:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds until retry (on 429)

### Graceful 429 Responses
When rate limit is exceeded:
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 3600
}
```

## 2. Input Validation & Sanitization

### Implementation
- **Location**: `lib/security/inputValidation.js`
- **Type**: Schema-based validation with strict type checking

### Features
- **Type Validation**: Ensures correct data types
- **Length Limits**: Prevents buffer overflow and DoS
- **Enum Validation**: Restricts values to allowed options
- **String Sanitization**: Removes null bytes, normalizes whitespace
- **HTML Sanitization**: Removes script tags, event handlers, javascript: protocol
- **Email Validation**: RFC-compliant email format checking
- **UUID Validation**: Ensures valid UUID format
- **Strict Mode**: Rejects unknown fields (prevents mass assignment)

### Validation Schemas

#### Generation Request
```javascript
{
  input: string (1-2000 chars, sanitized),
  mode: 'sermon' | 'study',
  sermonOptions: {
    audience: 'youth' | 'adults' | 'mixed',
    teachingStyle: 'narrative' | 'expository' | 'teaching',
    culturalContext: 'global' | 'african' | 'nigerian',
    tone: 'encouraging' | 'corrective' | 'prophetic',
    length: 'short' | 'medium' | 'long'
  }
}
```

#### Save Content Request
```javascript
{
  title: string (1-200 chars, sanitized),
  content: string (1-50000 chars, HTML sanitized),
  content_type: 'sermon' | 'study',
  topic: string (max 500 chars, optional),
  bible_verse: string (max 200 chars, optional),
  style: string (max 100 chars, optional),
  structured_data: string (valid JSON, optional)
}
```

#### Regenerate Section Request
```javascript
{
  section: 'introduction' | 'illustrations' | 'application' | 'points' | 'full',
  originalSermon: string (1-50000 chars, HTML sanitized),
  originalInputs: object (validated nested schema),
  additionalNote: string (max 500 chars, optional)
}
```

#### Checkout Request
```javascript
{
  priceId: string (starts with 'price_', max 200 chars),
  userId: string (valid UUID),
  userEmail: string (valid email format)
}
```

### Sanitization Functions

#### `sanitizeString(input, maxLength)`
- Removes null bytes (`\0`)
- Normalizes whitespace
- Truncates to maxLength

#### `sanitizeHTML(input, maxLength)`
- Removes `<script>` tags and content
- Removes event handlers (`onclick`, `onerror`, etc.)
- Removes `javascript:` protocol
- Removes null bytes
- Truncates to maxLength

## 3. API Key Security

### Environment Variables
All API keys are stored in environment variables and **never** hardcoded:

- `OPENAI_API_KEY` - Server-side only
- `STRIPE_SECRET_KEY` - Server-side only
- `STRIPE_WEBHOOK_SECRET` - Server-side only
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public (safe to expose)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Public (safe to expose)

### Key Rotation
1. Generate new keys in respective dashboards
2. Update `.env` file
3. Restart application
4. Verify functionality
5. Revoke old keys after verification

### Client-Side Exposure
- **Never** expose secret keys client-side
- Only `NEXT_PUBLIC_*` variables are exposed (by design)
- All API routes verify keys server-side

## 4. Authentication & Authorization

### Implementation
- **Provider**: Supabase Auth
- **Method**: Bearer token authentication
- **Location**: `lib/security/middleware.js`

### Security Checks
1. **Token Validation**: Verifies JWT with Supabase
2. **User Verification**: Ensures user exists and is active
3. **Resource Ownership**: Users can only access their own data
4. **User ID Verification**: Prevents user spoofing in requests

### Example Protection
```javascript
// User can only update their own content
.eq('user_id', user.id)

// Verify userId matches authenticated user
if (userId !== user.id) {
  return 403 // Forbidden
}
```

## 5. Security Headers

All API responses include:
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` - HSTS

## 6. Webhook Security

### Stripe Webhooks
- **Signature Verification**: All webhooks verified via Stripe signature
- **Rate Limiting**: IP-based rate limiting applied
- **Secret Validation**: Webhook secret validated before processing

### Implementation
```javascript
event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
```

## 7. Error Handling

### Security-Conscious Error Messages
- **Generic Messages**: Don't leak system information
- **Logging**: Detailed errors logged server-side only
- **User Messages**: User-friendly, non-technical messages

### Example
```javascript
// Server logs detailed error
serverError('❌ Invalid token:', error)

// User receives generic message
return NextResponse.json(
  { error: 'Authentication required' },
  { status: 401 }
)
```

## 8. Database Security

### Row-Level Security (RLS)
- All queries filter by `user_id`
- Users can only access their own data
- No direct database access from client

### Example
```javascript
// Always filter by user_id
.eq('user_id', user.id)
```

## 9. Security Middleware

### Usage
All API routes use the `withSecurity` wrapper:

```javascript
export const POST = withSecurity(handler, {
  requireAuth: true,
  rateLimitType: 'generation',
  validationSchema: generationSchema,
  allowedMethods: ['POST'],
})
```

### Options
- `requireAuth`: Require authentication (default: true)
- `rateLimitType`: Type of rate limit to apply
- `validationSchema`: Input validation schema
- `allowedMethods`: Allowed HTTP methods

## 10. OWASP Top 10 Coverage

| Risk | Mitigation |
|------|------------|
| Injection | Input validation, sanitization, parameterized queries |
| Broken Authentication | Token validation, user verification, secure session handling |
| Sensitive Data Exposure | Environment variables, no client-side secrets |
| XML External Entities | N/A (no XML processing) |
| Broken Access Control | User ID verification, resource ownership checks |
| Security Misconfiguration | Security headers, proper error handling |
| XSS | HTML sanitization, Content-Security-Policy ready |
| Insecure Deserialization | JSON validation, type checking |
| Using Components with Known Vulnerabilities | Regular dependency updates |
| Insufficient Logging | Comprehensive server-side logging |

## 11. Production Recommendations

1. **Rate Limiting**: Migrate to Redis for distributed systems
2. **Monitoring**: Implement security event logging
3. **WAF**: Consider Web Application Firewall
4. **DDoS Protection**: Use CDN with DDoS protection
5. **Key Rotation**: Implement automated key rotation
6. **Security Audits**: Regular security audits and penetration testing
7. **Dependency Updates**: Keep dependencies updated
8. **HTTPS Only**: Enforce HTTPS in production
9. **CSP Headers**: Implement Content Security Policy
10. **Security Headers**: Use security headers middleware

## 12. Incident Response

If a security issue is discovered:

1. **Immediate**: Disable affected functionality
2. **Assess**: Determine scope and impact
3. **Contain**: Prevent further damage
4. **Notify**: Inform affected users if necessary
5. **Fix**: Implement permanent fix
6. **Monitor**: Watch for similar issues
7. **Document**: Update security procedures

## 13. Security Checklist

- [x] Rate limiting on all endpoints
- [x] Input validation and sanitization
- [x] API keys in environment variables
- [x] Authentication on protected routes
- [x] Authorization checks (user ownership)
- [x] Security headers
- [x] Webhook signature verification
- [x] Error handling (no information leakage)
- [x] Database query filtering by user_id
- [x] HTTPS enforcement (production)
- [ ] Security monitoring and alerting
- [ ] Automated security scanning
- [ ] Regular security audits
