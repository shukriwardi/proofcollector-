
import DOMPurify from 'dompurify';

// Sanitize HTML content to prevent XSS attacks
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

// Sanitize text content for display
export const sanitizeText = (text: string): string => {
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
    .trim();
};

// Rate limiting storage (in a real app, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  identifier: string, 
  maxRequests: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remainingRequests: number; resetTime: number } => {
  const now = Date.now();
  const key = `rate_limit_${identifier}`;
  
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
  
  return { 
    allowed: true, 
    remainingRequests: maxRequests - existing.count, 
    resetTime: existing.resetTime 
  };
};

// Clean up expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

// Generic error messages to prevent information disclosure
export const getGenericErrorMessage = (type: 'form' | 'auth' | 'database' = 'form'): string => {
  const messages = {
    form: 'Please check your input and try again.',
    auth: 'Authentication failed. Please try again.',
    database: 'Something went wrong. Please try again later.'
  };
  return messages[type];
};

// Mask email for privacy
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return '';
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
  return `${maskedUsername}@${domain}`;
};
