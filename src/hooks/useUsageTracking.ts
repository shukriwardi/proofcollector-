
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { toast } = useToast();
  const [usage, setUsage] = useState<UsageData>({
    surveys: { current: 0, limit: 999 }, // Set high limits to effectively disable restrictions
    responses: { current: 0, limit: 999 },
    downloads: { current: 0, limit: 999 },
  });
  const [loading, setLoading] = useState(false); // Disabled loading
  
  // Simplified - always return true for Pro-like experience
  const isPro = true;

  const fetchUsage = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('📊 UsageTracking: Fetching basic usage data (Stripe disabled)...');
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [surveysResult, responsesResult] = await Promise.all([
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

      const newUsage = {
        surveys: { current: surveysResult.count || 0, limit: 999 },
        responses: { current: responsesResult.count || 0, limit: 999 },
        downloads: { current: 0, limit: 999 },
      };

      setUsage(newUsage);
      console.log('✅ UsageTracking: Usage data updated (no limits):', newUsage);

    } catch (error) {
      console.error('❌ UsageTracking: Error fetching usage:', error);
      // Set fallback with high limits
      setUsage({
        surveys: { current: 0, limit: 999 },
        responses: { current: 0, limit: 999 },
        downloads: { current: 0, limit: 999 },
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchUsage();
    } else {
      setLoading(false);
    }
  }, [user?.id, fetchUsage]);

  const checkLimit = useCallback(() => false, []); // Always return false (no limits)
  const canPerformAction = useCallback(() => true, []); // Always return true
  const enforceLimit = useCallback(() => true, []); // Always allow
  const showLimitAlert = useCallback(() => {}, []); // No-op
  const refreshUsage = useCallback(() => fetchUsage(true), [fetchUsage]);

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
