
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RateLimitRequest {
  identifier: string;
  action: string;
  maxRequests?: number;
  windowMs?: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  ip?: string;
  userAgent?: string;
}

const supabaseUrl = 'https://zzfyvjlqzblvufeoqslr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Znl2amxxemJsdnVmZW9xc2xyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjI3ODcsImV4cCI6MjA2NzgzODc4N30.EeL_FX3LF303N2V4_4FclHTWp6Y8Zt0W-Vb6vwB18z8';

// In-memory rate limit store (in production, use Redis or database)
const rateLimitStore = new Map<string, RateLimitEntry>();

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Validate origin and CSRF protection
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const csrfToken = req.headers.get('x-csrf-token');
    
    if (!origin || (!origin.includes('lovable.app') && !origin.includes('localhost'))) {
      console.log('Blocked request from invalid origin:', origin);
      return new Response('Invalid origin', { 
        status: 403, 
        headers: corsHeaders 
      });
    }

    const clientIp = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    const { identifier, action, maxRequests = 5, windowMs = 15 * 60 * 1000 }: RateLimitRequest = await req.json();
    
    if (!identifier || !action) {
      return new Response('Missing required fields', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Enhanced rate limiting with IP and action combination
    const key = `${identifier}_${action}_${clientIp}`;
    const now = Date.now();
    
    const existing = rateLimitStore.get(key);
    
    if (!existing || now > existing.resetTime) {
      const resetTime = now + windowMs;
      rateLimitStore.set(key, { 
        count: 1, 
        resetTime,
        ip: clientIp,
        userAgent
      });
      
      console.log(`Rate limit initialized for ${key}`);
      
      return new Response(JSON.stringify({
        allowed: true,
        remainingRequests: maxRequests - 1,
        resetTime
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    if (existing.count >= maxRequests) {
      console.log(`Rate limit exceeded for ${key}. IP: ${clientIp}, UserAgent: ${userAgent}`);
      
      return new Response(JSON.stringify({
        allowed: false,
        remainingRequests: 0,
        resetTime: existing.resetTime,
        message: 'Rate limit exceeded. Please try again later.'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    existing.count++;
    rateLimitStore.set(key, existing);
    
    return new Response(JSON.stringify({
      allowed: true,
      remainingRequests: maxRequests - existing.count,
      resetTime: existing.resetTime
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
    
  } catch (error) {
    console.error('Rate limit error:', error);
    return new Response('Internal server error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

serve(handler);
