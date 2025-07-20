
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UsageData {
  surveys: { current: number; limit: number };
  responses: { current: number; limit: number };
  downloads: { current: number; limit: number };
}

export const useUsageTracking = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData>({
    surveys: { current: 0, limit: Infinity },
    responses: { current: 0, limit: Infinity },
    downloads: { current: 0, limit: Infinity },
  });
  const [loading, setLoading] = useState(false);
  
  const isPro = false; // No subscription system

  const fetchUsage = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
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
        surveys: { current: surveysResult.count || 0, limit: Infinity },
        responses: { current: responsesResult.count || 0, limit: Infinity },
        downloads: { current: 0, limit: Infinity },
      };

      setUsage(newUsage);
    } catch (error) {
      console.error('Error fetching usage:', error);
      setUsage({
        surveys: { current: 0, limit: Infinity },
        responses: { current: 0, limit: Infinity },
        downloads: { current: 0, limit: Infinity },
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUsage();
    } else {
      setLoading(false);
    }
  }, [user?.id, fetchUsage]);

  const checkLimit = useCallback(() => false, []);
  const canPerformAction = useCallback(() => true, []);
  const enforceLimit = useCallback(() => true, []);
  const showLimitAlert = useCallback(() => {}, []);
  const refreshUsage = useCallback(() => fetchUsage(), [fetchUsage]);

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
