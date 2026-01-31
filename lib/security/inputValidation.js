/**
 * Input Validation & Sanitization
 * Schema-based validation following OWASP best practices
 * Prevents injection attacks, XSS, and data corruption
 */

/**
 * Sanitize string input
 * Removes potentially dangerous characters and normalizes whitespace
 * @param {string} input - Input string to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized string
 */
export function sanitizeString(input, maxLength = 10000) {
  if (typeof input !== 'string') {
    return ''
  }

  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength)

  // Remove null bytes (common in injection attacks)
  sanitized = sanitized.replace(/\0/g, '')

  // Normalize whitespace (prevent hidden characters)
  sanitized = sanitized.replace(/\s+/g, ' ')

  return sanitized
}

/**
 * Sanitize HTML content (for saved sermons/studies)
 * Removes script tags and dangerous attributes
 * @param {string} input - HTML content to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(input, maxLength = 50000) {
  if (typeof input !== 'string') {
    return ''
  }

  let sanitized = input.trim().slice(0, maxLength)

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')

  return sanitized
}

/**
 * Validate and sanitize email
 * @param {string} email - Email to validate
 * @returns {string|null} Validated email or null
 */
export function validateEmail(email) {
  if (typeof email !== 'string') {
    return null
  }

  const sanitized = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(sanitized) || sanitized.length > 254) {
    return null
  }

  return sanitized
}

/**
 * Validate UUID
 * @param {string} id - UUID to validate
 * @returns {boolean} True if valid UUID
 */
export function validateUUID(id) {
  if (typeof id !== 'string') {
    return false
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id.trim())
}

/**
 * Validation schema for generation request
 */
export const generationSchema = {
  input: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 2000, // Reasonable limit for topic/description
    sanitize: true,
  },
  mode: {
    type: 'string',
    required: true,
    enum: ['sermon', 'study'],
  },
  sermonOptions: {
    type: 'object',
    required: false,
    schema: {
      audience: {
        type: 'string',
        enum: ['youth', 'adults', 'mixed'],
      },
      teachingStyle: {
        type: 'string',
        enum: ['narrative', 'expository', 'teaching'],
      },
      culturalContext: {
        type: 'string',
        enum: ['global', 'african', 'nigerian'],
      },
      tone: {
        type: 'string',
        enum: ['encouraging', 'corrective', 'prophetic'],
      },
      length: {
        type: 'string',
        enum: ['short', 'medium', 'long'],
      },
    },
  },
}

/**
 * Validation schema for save content request
 */
export const saveContentSchema = {
  title: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200,
    sanitize: true,
  },
  content: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 50000, // Large content allowed for sermons
    sanitize: 'html', // Use HTML sanitization
  },
  content_type: {
    type: 'string',
    required: true,
    enum: ['sermon', 'study'],
  },
  topic: {
    type: 'string',
    required: false,
    maxLength: 500,
    sanitize: true,
  },
  bible_verse: {
    type: 'string',
    required: false,
    maxLength: 200,
    sanitize: true,
  },
  style: {
    type: 'string',
    required: false,
    maxLength: 100,
    sanitize: true,
  },
  structured_data: {
    type: 'string',
    required: false,
    maxLength: 100000, // JSON string
    validate: (value) => {
      try {
        JSON.parse(value)
        return true
      } catch {
        return false
      }
    },
  },
}

/**
 * Validation schema for regenerate section request
 */
export const regenerateSectionSchema = {
  section: {
    type: 'string',
    required: true,
    enum: ['introduction', 'illustrations', 'application', 'points', 'full'],
  },
  originalSermon: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 50000,
    sanitize: 'html',
  },
  originalInputs: {
    type: 'object',
    required: true,
    schema: {
      topic: {
        type: 'string',
        maxLength: 2000,
        sanitize: true,
      },
      verse: {
        type: 'string',
        maxLength: 200,
        sanitize: true,
      },
      audience: {
        type: 'string',
        enum: ['youth', 'adults', 'mixed'],
      },
      teachingStyle: {
        type: 'string',
        enum: ['narrative', 'expository', 'teaching'],
      },
      culturalContext: {
        type: 'string',
        enum: ['global', 'african', 'nigerian'],
      },
      tone: {
        type: 'string',
        enum: ['encouraging', 'corrective', 'prophetic'],
      },
      length: {
        type: 'string',
        enum: ['short', 'medium', 'long'],
      },
    },
  },
  additionalNote: {
    type: 'string',
    required: false,
    maxLength: 500,
    sanitize: true,
  },
}

/**
 * Validation schema for checkout session
 */
export const checkoutSchema = {
  priceId: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200,
    sanitize: true,
    // Stripe price IDs start with 'price_'
    validate: (value) => value.startsWith('price_'),
  },
  userId: {
    type: 'string',
    required: true,
    validate: validateUUID,
  },
  userEmail: {
    type: 'string',
    required: true,
    validate: validateEmail,
  },
}

/**
 * Validate object against schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @param {boolean} strict - If true, reject unknown fields
 * @returns {Object} Validation result
 */
export function validateSchema(data, schema, strict = true) {
  const errors = []
  const sanitized = {}

  // Check for unknown fields if strict mode
  if (strict && typeof data === 'object' && data !== null) {
    const allowedFields = Object.keys(schema)
    const unknownFields = Object.keys(data).filter(key => !allowedFields.includes(key))
    
    if (unknownFields.length > 0) {
      errors.push(`Unexpected fields: ${unknownFields.join(', ')}`)
    }
  }

  // Validate each field in schema
  for (const [field, rules] of Object.entries(schema)) {
    const value = data?.[field]

    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`)
      continue
    }

    // Skip validation if field is not required and not provided
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue
    }

    // Type checking
    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be of type ${rules.type}`)
      continue
    }

    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(', ')}`)
      continue
    }

    // String length validation
    if (rules.type === 'string' && typeof value === 'string') {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`)
        continue
      }
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`)
        continue
      }
    }

    // Custom validation
    if (rules.validate && !rules.validate(value)) {
      errors.push(`${field} failed validation`)
      continue
    }

    // Sanitization
    let sanitizedValue = value
    if (rules.sanitize === true) {
      sanitizedValue = sanitizeString(value, rules.maxLength || 10000)
    } else if (rules.sanitize === 'html') {
      sanitizedValue = sanitizeHTML(value, rules.maxLength || 50000)
    }

    // Nested object validation
    if (rules.type === 'object' && rules.schema && typeof value === 'object' && value !== null) {
      const nestedResult = validateSchema(value, rules.schema, strict)
      if (!nestedResult.valid) {
        errors.push(...nestedResult.errors.map(e => `${field}.${e}`))
        continue
      }
      sanitizedValue = nestedResult.data
    }

    sanitized[field] = sanitizedValue
  }

  return {
    valid: errors.length === 0,
    errors,
    data: sanitized,
  }
}

/**
 * Validate request body against schema
 * @param {Object} body - Request body
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result
 */
export function validateRequest(body, schema) {
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      errors: ['Request body must be a valid JSON object'],
      data: null,
    }
  }

  return validateSchema(body, schema, true)
}
