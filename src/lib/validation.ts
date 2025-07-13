
import { z } from 'zod';

// Enhanced validation with stricter security rules
const sanitizeInput = (value: string) => {
  return value
    .trim()
    .replace(/[<>\"'&]/g, (match) => {
      const escapeMap: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match];
    });
};

// Enhanced email validation with domain checking
const emailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email must be less than 254 characters')
  .refine((email) => {
    // Block suspicious email patterns
    const suspiciousPatterns = [
      /\+.*\+/, // Multiple plus signs
      /\.{2,}/, // Multiple consecutive dots
      /@.*@/, // Multiple @ symbols
      /script/i, // Script injection attempts
      /javascript/i, // JavaScript injection attempts
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(email));
  }, 'Email contains invalid patterns')
  .transform(sanitizeInput);

// Enhanced name validation
const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters')
  .refine((name) => {
    // Block names that are too short or suspicious
    const trimmed = name.trim();
    return trimmed.length >= 2 && !(/^\s+$/.test(name));
  }, 'Name must be at least 2 characters and contain valid content')
  .transform(sanitizeInput);

// Enhanced text content validation
const textContentSchema = (minLength: number, maxLength: number, fieldName: string) => 
  z.string()
    .min(minLength, `${fieldName} must be at least ${minLength} characters`)
    .max(maxLength, `${fieldName} must be less than ${maxLength} characters`)
    .refine((text) => {
      // Block suspicious content patterns
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i, // Event handlers like onclick=
        /data:/i, // Data URLs
        /vbscript:/i,
        /expression\s*\(/i, // CSS expression attacks
      ];
      return !suspiciousPatterns.some(pattern => pattern.test(text));
    }, `${fieldName} contains potentially harmful content`)
    .refine((text) => {
      // Ensure minimum meaningful content
      const trimmed = text.trim();
      const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length;
      return wordCount >= (minLength < 50 ? 2 : 5); // Require at least 2-5 words depending on field
    }, `${fieldName} must contain meaningful content`)
    .transform(sanitizeInput);

// Validation schemas with enhanced security
export const testimonialSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional().or(z.literal('')),
  testimonial: textContentSchema(10, 1000, 'Testimonial')
});

export const surveySchema = z.object({
  title: textContentSchema(1, 200, 'Title'),
  question: textContentSchema(1, 500, 'Question')
});

export const profileSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .refine((username) => {
      // Block reserved usernames
      const reserved = ['admin', 'root', 'system', 'null', 'undefined', 'api', 'www'];
      return !reserved.includes(username.toLowerCase());
    }, 'Username is reserved')
    .transform(sanitizeInput)
});

// Server-side validation function
export const validateOnServer = async <T>(
  schema: z.ZodSchema<T>, 
  data: unknown,
  context?: { userAgent?: string; ip?: string }
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> => {
  try {
    const validatedData = await schema.parseAsync(data);
    
    // Additional server-side security checks
    if (context) {
      // Log suspicious patterns for monitoring
      const dataStr = JSON.stringify(data);
      const suspiciousIndicators = [
        /\bscript\b/i,
        /\bonload\b/i,
        /\bonerror\b/i,
        /\bjavascript:/i,
        /\bdata:/i,
      ];
      
      if (suspiciousIndicators.some(pattern => pattern.test(dataStr))) {
        console.warn('Suspicious input detected:', {
          ip: context.ip,
          userAgent: context.userAgent,
          timestamp: new Date().toISOString(),
          data: dataStr.substring(0, 200) + '...'
        });
      }
    }
    
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
};

// Rate limiting validation
export const rateLimitSchema = z.object({
  identifier: z.string().min(1).max(100),
  action: z.enum(['testimonial', 'survey', 'auth', 'general']),
  maxRequests: z.number().min(1).max(100).optional(),
  windowMs: z.number().min(1000).max(3600000).optional() // 1 second to 1 hour
});

// Type exports
export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type SurveyFormData = z.infer<typeof surveySchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type RateLimitData = z.infer<typeof rateLimitSchema>;
