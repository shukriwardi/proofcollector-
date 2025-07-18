
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';

interface UsageData {
  surveys: { current: number; limit: number };
  responses: { current: number; limit: number };
  downloads: { current: number; limit: number };
}

export const useUsageTracking = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [usage, setUsage] = useState<UsageData>({
    surveys: { current: 0, limit: 2 },
    responses: { current: 0, limit: 10 },
    downloads: { current: 0, limit: 3 },
  });
  const [loading, setLoading] = useState(true);

  const isPro = subscription.subscription_tier === 'pro';

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUsage = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get surveys count for this month
        const { count: surveysCount } = await supabase
          .from('surveys')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString());

        // Get responses count for this month
        const { count: responsesCount } = await supabase
          .from('testimonials')
          .select('surveys!inner(*)', { count: 'exact', head: true })
          .eq('surveys.user_id', user.id)
          .gte('created_at', startOfMonth.toISOString());

        // Set limits based on subscription tier
        const limits = isPro
          ? { surveys: Infinity, responses: 250, downloads: Infinity }
          : { surveys: 2, responses: 10, downloads: 3 };

        setUsage({
          surveys: { current: surveysCount || 0, limit: limits.surveys },
          responses: { current: responsesCount || 0, limit: limits.responses },
          downloads: { current: 0, limit: limits.downloads }, // TODO: Track downloads
        });
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [user, isPro]);

  const checkLimit = (type: 'surveys' | 'responses' | 'downloads'): boolean => {
    return usage[type].current >= usage[type].limit;
  };

  const canPerformAction = (type: 'surveys' | 'responses' | 'downloads'): boolean => {
    if (isPro && (type === 'surveys' || type === 'downloads')) {
      return true; // Unlimited for Pro users
    }
    return !checkLimit(type);
  };

  return {
    usage,
    loading,
    checkLimit,
    canPerformAction,
    isPro,
  };
};
