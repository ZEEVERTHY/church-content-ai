/**
 * Environment Variable Validation
 * Validates required environment variables at startup
 */

const requiredEnvVars = {
  // Core
  NEXT_PUBLIC_APP_URL: 'App URL (e.g., https://yourdomain.com)',
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anon key',
  OPENAI_API_KEY: 'OpenAI API key',
  
  // Stripe
  STRIPE_SECRET_KEY: 'Stripe secret key',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'Stripe publishable key',
  STRIPE_PRICE_ID: 'Stripe price ID',
  STRIPE_WEBHOOK_SECRET: 'Stripe webhook secret (for production)',
}

const optionalEnvVars = {
  FEEDBACK_EMAIL: 'Email for receiving feedback',
  EMAIL_SERVICE_ID: 'EmailJS service ID (optional)',
  EMAIL_TEMPLATE_ID: 'EmailJS template ID (optional)',
  EMAIL_PUBLIC_KEY: 'EmailJS public key (optional)',
}

/**
 * Validate environment variables
 * @param {boolean} strict - If true, throws error on missing required vars
 * @returns {Object} Validation result
 */
export function validateEnv(strict = false) {
  const missing = []
  const warnings = []
  
  // Check required variables
  for (const [key, description] of Object.entries(requiredEnvVars)) {
    if (!process.env[key]) {
      missing.push({ key, description })
    }
  }
  
  // Check optional but recommended variables
  for (const [key, description] of Object.entries(optionalEnvVars)) {
    if (!process.env[key]) {
      warnings.push({ key, description })
    }
  }
  
  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables:\n${missing.map(m => `  - ${m.key}: ${m.description}`).join('\n')}`
    
    if (strict) {
      throw new Error(errorMessage)
    } else {
      console.error('❌', errorMessage)
    }
  }
  
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Optional environment variables not set:\n', 
      warnings.map(w => `  - ${w.key}: ${w.description}`).join('\n'))
  }
  
  return {
    valid: missing.length === 0,
    missing,
    warnings
  }
}

/**
 * Validate environment variables for API routes
 * Use this in API route handlers
 */
export function validateApiEnv() {
  // Server-side only validation
  if (typeof window !== 'undefined') {
    return { valid: true, missing: [] }
  }
  
  return validateEnv(false) // Don't throw, just log
}

/**
 * Get environment variable with fallback
 */
export function getEnv(key, fallback = null) {
  return process.env[key] || fallback
}

// Auto-validate on module load (server-side only)
if (typeof window === 'undefined') {
  validateEnv(false)
}

