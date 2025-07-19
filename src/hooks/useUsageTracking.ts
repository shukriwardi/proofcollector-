
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

const USAGE_CACHE_KEY = 'usage_cache_v3';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

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
  const lastFetchTime = useRef(0);

  const isPro = subscription.subscription_tier === 'pro';

  const fetchUsage = useCallback(async (forceRefresh = false) => {
    if (!user || fetchingRef.current) {
      setLoading(false);
      return;
    }

    // Check cache first (unless forced refresh)
    if (!forceRefresh) {
      const now = Date.now();
      if (now - lastFetchTime.current < CACHE_DURATION) {
        console.log('📊 Using cached usage data');
        setLoading(false);
        return;
      }

      const cached = localStorage.getItem(USAGE_CACHE_KEY);
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached);
          const cacheAge = now - (parsedCache.cached_at || 0);
          
          if (cacheAge < CACHE_DURATION) {
            console.log('📊 Using localStorage cached usage data');
            setUsage(parsedCache.usage);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Invalid usage cache:', e);
          localStorage.removeItem(USAGE_CACHE_KEY);
        }
      }
    }

    try {
      fetchingRef.current = true;
      setLoading(true);
      console.log('📊 Fetching fresh usage data...');
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Batch queries with timeout for better performance
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Usage fetch timeout')), 8000);
      });

      const fetchPromises = Promise.all([
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
      ]);

      const [surveysResult, responsesResult] = await Promise.race([
        fetchPromises,
        timeoutPromise
      ]) as any[];

      // Set limits based on subscription tier with safer defaults
      const limits = isPro
        ? { surveys: 999, responses: 250, downloads: 999 } // Use large numbers instead of Infinity
        : { surveys: 2, responses: 10, downloads: 3 };

      const newUsage = {
        surveys: { current: surveysResult.count || 0, limit: limits.surveys },
        responses: { current: responsesResult.count || 0, limit: limits.responses },
        downloads: { current: 0, limit: limits.downloads },
      };

      setUsage(newUsage);
      lastFetchTime.current = Date.now();
      
      // Cache the result
      localStorage.setItem(USAGE_CACHE_KEY, JSON.stringify({
        usage: newUsage,
        cached_at: Date.now(),
      }));

      console.log('✅ Usage data updated:', newUsage);

    } catch (error) {
      console.error('❌ Error fetching usage:', error);
      
      // Use fallback limits and don't show toast for timeout
      const limits = isPro
        ? { surveys: 999, responses: 250, downloads: 999 }
        : { surveys: 2, responses: 10, downloads: 3 };

      setUsage({
        surveys: { current: 0, limit: limits.surveys },
        responses: { current: 0, limit: limits.responses },
        downloads: { current: 0, limit: limits.downloads },
      });

      if (!(error instanceof Error && error.message.includes('timeout'))) {
        toast({
          title: "Usage data temporarily unavailable",
          description: "Using default limits. Data will refresh automatically.",
          variant: "destructive",
        });
      }
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }, [user, isPro, toast]);

  // Initial fetch with debounce
  useEffect(() => {
    if (user && subscription.subscription_tier) {
      const timer = setTimeout(() => {
        fetchUsage();
      }, 500); // Small delay to batch initial renders
      
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [user, subscription.subscription_tier, fetchUsage]);

  const checkLimit = useCallback((type: 'surveys' | 'responses' | 'downloads'): boolean => {
    return usage[type].current >= usage[type].limit;
  }, [usage]);

  const canPerformAction = useCallback((type: 'surveys' | 'responses' | 'downloads'): boolean => {
    if (isPro && (type === 'surveys' || type === 'downloads')) {
      return true;
    }
    return !checkLimit(type);
  }, [isPro, checkLimit]);

  const showLimitAlert = useCallback((type: 'surveys' | 'responses' | 'downloads') => {
    if (!isPro) {
      toast({
        title: "🔒 Monthly Limit Reached",
        description: "You've reached your monthly free limit. Upgrade for just $4/month to unlock unlimited surveys, 250 responses, and more — or wait until next month to reset.",
        variant: "destructive",
        duration: 8000,
      });
    } else if (type === 'responses') {
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
      return false;
    }
    return true;
  }, [canPerformAction, showLimitAlert]);

  // Throttled refresh function
  const refreshUsage = useCallback(() => {
    const now = Date.now();
    if (now - lastFetchTime.current > 2000) { // Throttle to max once per 2 seconds
      fetchUsage(true);
    }
  }, [fetchUsage]);

  return {
    usage,
    loading,
    checkLimit,
    canPerformAction,
    enforceLimit,
    showLimitAlert,
    isPro,
    refreshUsage,
  };
};
