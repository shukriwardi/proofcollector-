
import DOMPurify from 'dompurify';

// Enhanced sanitization functions
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
};

// Enhanced text sanitization with additional security measures
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/[<>\"'&]/g, (match) => {
      const escapeMap: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match];
    })
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:/gi, '') // Remove data: protocols
    .replace(/vbscript:/gi, '') // Remove vbscript: protocols
    .trim();
};

// Server-side rate limiting using edge function
export const checkServerRateLimit = async (
  identifier: string,
  action: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000
): Promise<{ allowed: boolean; remainingRequests: number; resetTime: number; message?: string }> => {
  try {
    const response = await fetch('https://zzfyvjlqzblvufeoqslr.supabase.co/functions/v1/rate-limit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Znl2amxxemJsdnVmZW9xc2xyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjI3ODcsImV4cCI6MjA2NzgzODc4N30.EeL_FX3LF303N2V4_4FclHTWp6Y8Zt0W-Vb6vwB18z8',
        'x-csrf-token': generateCSRFToken(),
        'x-request-id': generateRequestId()
      },
      body: JSON.stringify({
        identifier: sanitizeText(identifier),
        action: sanitizeText(action),
        maxRequests,
        windowMs
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        const data = await response.json();
        return {
          allowed: false,
          remainingRequests: 0,
          resetTime: data.resetTime || Date.now() + windowMs,
          message: data.message || 'Rate limit exceeded'
        };
      }
      throw new Error(`Rate limit check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Fail safely - allow the request but log the error
    return {
      allowed: true,
      remainingRequests: maxRequests - 1,
      resetTime: Date.now() + windowMs
    };
  }
};

// Client-side rate limiting fallback (for backward compatibility)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  key: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remainingRequests: number; resetTime: number } => {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remainingRequests: maxRequests - 1, resetTime };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remainingRequests: 0, resetTime: existing.resetTime };
  }

  existing.count++;
  rateLimitStore.set(key, existing);
  return { allowed: true, remainingRequests: maxRequests - existing.count, resetTime: existing.resetTime };
};

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  if (typeof window !== 'undefined') {
    let token = sessionStorage.getItem('csrf-token');
    if (!token) {
      token = crypto.randomUUID();
      sessionStorage.setItem('csrf-token', token);
    }
    return token;
  }
  return crypto.randomUUID();
};

export const validateCSRFToken = (token: string): boolean => {
  if (typeof window === 'undefined') return true; // Skip validation on server
  const storedToken = sessionStorage.getItem('csrf-token');
  return storedToken === token;
};

// Request ID generation for tracking
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Enhanced error messages to prevent information disclosure
export const getSecureErrorMessage = (type: 'form' | 'auth' | 'database' | 'rate-limit' = 'form', context?: any): string => {
  // Log detailed error for debugging but return generic message
  if (context) {
    console.error(`Security error [${type}]:`, {
      timestamp: new Date().toISOString(),
      type,
      context: typeof context === 'object' ? JSON.stringify(context).substring(0, 200) : context
    });
  }

  const messages = {
    form: 'Please check your input and try again.',
    auth: 'Authentication failed. Please verify your credentials.',
    database: 'Unable to process your request. Please try again later.',
    'rate-limit': 'Too many requests. Please wait before trying again.'
  };
  return messages[type];
};

// Generic error message function (for backward compatibility)
export const getGenericErrorMessage = (type: 'form' | 'auth' | 'database' = 'form'): string => {
  return getSecureErrorMessage(type);
};

// Enhanced email masking for privacy
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return '';
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) return `${username[0]}*@${domain}`;
  
  const visibleChars = Math.max(1, Math.floor(username.length * 0.3));
  const maskedLength = username.length - (visibleChars * 2);
  const maskedUsername = 
    username.substring(0, visibleChars) + 
    '*'.repeat(Math.max(1, maskedLength)) + 
    username.substring(username.length - visibleChars);
  
  return `${maskedUsername}@${domain}`;
};

// Password strength validation
export const validatePasswordStrength = (password: string): { 
  isValid: boolean; 
  score: number; 
  feedback: string[] 
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Password must be at least 8 characters long');

  if (password.length >= 12) score += 1;
  else if (password.length >= 8) feedback.push('Consider using a longer password for better security');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Include special characters');

  // Check for common patterns
  const commonPatterns = [
    /(.)\1{2,}/, // Repeated characters
    /123456|abcdef|qwerty/i, // Common sequences
    /password|admin|login/i // Common words
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common patterns and words');
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  };
};

// Security event logging
export const logSecurityEvent = (event: {
  type: 'auth_failure' | 'rate_limit' | 'suspicious_input' | 'csrf_violation';
  details: any;
  userAgent?: string;
  ip?: string;
}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: event.type,
    details: sanitizeText(JSON.stringify(event.details)),
    userAgent: event.userAgent ? sanitizeText(event.userAgent) : 'unknown',
    ip: event.ip || 'unknown',
    sessionId: generateRequestId()
  };

  console.warn('Security Event:', logEntry);
  
  // In production, you might want to send this to a security monitoring service
  // sendToSecurityMonitoring(logEntry);
};

// Content Security Policy helper
export const getCSPDirectives = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://zzfyvjlqzblvufeoqslr.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
};
