
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UsageData {
  surveys: { current: number; limit: number };
  responses: { current: number; limit: number };
  downloads: { current: number; limit: number };
}

const USAGE_CACHE_KEY = 'usage_cache_v2';

export const useUsageTracking = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const [usage, setUsage] = useState<UsageData>({
    surveys: { current: 0, limit: 2 },
    responses: { current: 0, limit: 10 },
    downloads: { current: 0, limit: 3 },
  });
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  const isPro = subscription.subscription_tier === 'pro';

  const fetchUsage = useCallback(async () => {
    if (!user || fetchingRef.current) {
      setLoading(false);
      return;
    }

    try {
      fetchingRef.current = true;
      setLoading(true);
      
      // Load from cache first
      const cached = localStorage.getItem(USAGE_CACHE_KEY);
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached);
          const cacheAge = Date.now() - (parsedCache.cached_at || 0);
          
          // Use cache if less than 1 minute old
          if (cacheAge < 60000) {
            setUsage(parsedCache.usage);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Invalid usage cache:', e);
        }
      }

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Use Promise.all for parallel requests with timeout
      const fetchPromises = [
        supabase
          .from('surveys')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString()),
        
        supabase
          .from('testimonials')
          .select('surveys!inner(*)', { count: 'exact', head: true })
          .eq('surveys.user_id', user.id)
          .gte('created_at', startOfMonth.toISOString())
      ];

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Usage fetch timeout')), 10000);
      });

      const [surveysResult, responsesResult] = await Promise.race([
        Promise.all(fetchPromises),
        timeoutPromise
      ]) as any[];

      // Set limits based on subscription tier
      const limits = isPro
        ? { surveys: Infinity, responses: 250, downloads: Infinity }
        : { surveys: 2, responses: 10, downloads: 3 };

      const newUsage = {
        surveys: { current: surveysResult.count || 0, limit: limits.surveys },
        responses: { current: responsesResult.count || 0, limit: limits.responses },
        downloads: { current: 0, limit: limits.downloads }, // TODO: Track downloads
      };

      setUsage(newUsage);
      
      // Cache the result
      localStorage.setItem(USAGE_CACHE_KEY, JSON.stringify({
        usage: newUsage,
        cached_at: Date.now(),
      }));

    } catch (error) {
      console.error('Error fetching usage:', error);
      
      // Don't show error toast for timeout - just use defaults
      if (error instanceof Error && !error.message.includes('timeout')) {
        toast({
          title: "Usage data unavailable",
          description: "Showing estimated limits. Please refresh if needed.",
          variant: "destructive",
        });
      }
      
      // Fallback to default limits
      const limits = isPro
        ? { surveys: Infinity, responses: 250, downloads: Infinity }
        : { surveys: 2, responses: 10, downloads: 3 };

      setUsage({
        surveys: { current: 0, limit: limits.surveys },
        responses: { current: 0, limit: limits.responses },
        downloads: { current: 0, limit: limits.downloads },
      });
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }, [user, isPro, toast]);

  useEffect(() => {
    if (user) {
      fetchUsage();
    } else {
      setLoading(false);
    }
  }, [fetchUsage]);

  const checkLimit = useCallback((type: 'surveys' | 'responses' | 'downloads'): boolean => {
    return usage[type].current >= usage[type].limit;
  }, [usage]);

  const canPerformAction = useCallback((type: 'surveys' | 'responses' | 'downloads'): boolean => {
    if (isPro && (type === 'surveys' || type === 'downloads')) {
      return true; // Unlimited for Pro users
    }
    return !checkLimit(type);
  }, [isPro, checkLimit]);

  const showLimitAlert = useCallback((type: 'surveys' | 'responses' | 'downloads') => {
    if (!isPro) {
      // Free user reached limit
      toast({
        title: "🔒 Monthly Limit Reached",
        description: "You've reached your monthly free limit. Upgrade for just $4/month to unlock unlimited surveys, 250 responses, and more — or wait until next month to reset.",
        variant: "destructive",
        duration: 8000,
      });
    } else if (type === 'responses') {
      // Pro user reached response limit
      toast({
        title: "⚠️ Response Limit Reached",
        description: "You've reached the 250 response limit for your Pro plan this month. Please wait for your next billing cycle for responses to reset.",
        variant: "destructive",
        duration: 8000,
      });
    }
  }, [isPro, toast]);

  const enforceLimit = useCallback((type: 'surveys' | 'responses' | 'downloads'): boolean => {
    if (!canPerformAction(type)) {
      showLimitAlert(type);
      return false; // Block the action
    }
    return true; // Allow the action
  }, [canPerformAction, showLimitAlert]);

  return {
    usage,
    loading,
    checkLimit,
    canPerformAction,
    enforceLimit,
    showLimitAlert,
    isPro,
    refreshUsage: fetchUsage,
  };
};
