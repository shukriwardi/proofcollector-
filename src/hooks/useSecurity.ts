
import { useState, useCallback } from 'react';
import { checkServerRateLimit, logSecurityEvent, validatePasswordStrength } from '@/lib/security';
import { validateOnServer } from '@/lib/validation';
import { z } from 'zod';

export const useSecurity = () => {
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const checkRateLimit = useCallback(async (
    identifier: string,
    action: string,
    maxRequests?: number,
    windowMs?: number
  ) => {
    try {
      const result = await checkServerRateLimit(identifier, action, maxRequests, windowMs);
      
      if (!result.allowed) {
        setRateLimited(true);
        const remainingTime = Math.max(0, result.resetTime - Date.now());
        setCooldownTime(Math.ceil(remainingTime / 1000));
        
        // Start countdown
        const interval = setInterval(() => {
          setCooldownTime(prev => {
            if (prev <= 1) {
              setRateLimited(false);
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        logSecurityEvent({
          type: 'rate_limit',
          details: { identifier, action, resetTime: result.resetTime }
        });
      }
      
      return result;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return { allowed: true, remainingRequests: 5, resetTime: Date.now() + 900000 };
    }
  }, []);

  const validateInput = useCallback(async <T>(
    schema: z.ZodSchema<T>,
    data: unknown
  ) => {
    const userAgent = navigator.userAgent;
    const result = await validateOnServer(schema, data, { userAgent });
    
    if (!result.success) {
      if ('errors' in result) {
        logSecurityEvent({
          type: 'suspicious_input',
          details: { errors: result.errors, data: JSON.stringify(data).substring(0, 100) },
          userAgent
        });
      }
    }
    
    return result;
  }, []);

  const checkPasswordStrength = useCallback((password: string) => {
    return validatePasswordStrength(password);
  }, []);

  const logAuthFailure = useCallback((reason: string, email?: string) => {
    logSecurityEvent({
      type: 'auth_failure',
      details: { reason, email: email ? email.substring(0, 3) + '***' : 'unknown' },
      userAgent: navigator.userAgent
    });
  }, []);

  return {
    rateLimited,
    cooldownTime,
    checkRateLimit,
    validateInput,
    checkPasswordStrength,
    logAuthFailure
  };
};
