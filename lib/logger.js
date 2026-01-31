/**
 * Logger utility that only logs in development
 * Use this instead of console.log for cleaner production builds
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const log = (...args) => {
  if (isDevelopment) {
    console.log(...args)
  }
}

export const logError = (...args) => {
  // Always log errors, even in production
  console.error(...args)
}

export const logWarn = (...args) => {
  if (isDevelopment) {
    console.warn(...args)
  }
}

export const logInfo = (...args) => {
  if (isDevelopment) {
    console.info(...args)
  }
}

// For API routes and server-side code
export const serverLog = (...args) => {
  // Server logs are useful in production for debugging
  // But we can still filter by environment if needed
  if (isDevelopment || process.env.ENABLE_SERVER_LOGS === 'true') {
    console.log('[SERVER]', ...args)
  }
}

export const serverError = (...args) => {
  // Always log server errors
  console.error('[SERVER ERROR]', ...args)
}

