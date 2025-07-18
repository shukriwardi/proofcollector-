
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_end?: string;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'free',
  });
  const [loading, setLoading] = useState(true);

  const checkSubscription = useCallback(async (skipLoading = false) => {
    if (!user || !session) {
      setSubscription({ subscribed: false, subscription_tier: 'free' });
      setLoading(false);
      return;
    }

    try {
      if (!skipLoading) setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      const newSubscription = {
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || 'free',
        subscription_end: data.subscription_end,
      };

      setSubscription(newSubscription);
      
      // Store in localStorage for faster initial loads
      localStorage.setItem('subscription_cache', JSON.stringify({
        ...newSubscription,
        cached_at: Date.now(),
      }));

    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription({ subscribed: false, subscription_tier: 'free' });
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  const createCheckout = useCallback(async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Redirecting to checkout...",
        description: "Please wait while we set up your payment",
      });

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      const checkoutWindow = window.open(data.url, '_blank');
      
      // Poll for subscription changes after checkout
      const pollForSubscription = () => {
        const interval = setInterval(async () => {
          if (checkoutWindow?.closed) {
            // Window closed, check subscription immediately
            await checkSubscription(true);
            clearInterval(interval);
          }
        }, 1000);

        // Stop polling after 5 minutes
        setTimeout(() => clearInterval(interval), 300000);
      };

      pollForSubscription();

    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  }, [session, toast, checkSubscription]);

  const openCustomerPortal = useCallback(async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage subscription",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Opening customer portal...",
        description: "Please wait while we redirect you",
      });

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    }
  }, [session, toast]);

  useEffect(() => {
    // Try to load from cache first for faster initial load
    const cached = localStorage.getItem('subscription_cache');
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        const cacheAge = Date.now() - parsedCache.cached_at;
        
        // Use cache if less than 30 seconds old
        if (cacheAge < 30000) {
          setSubscription({
            subscribed: parsedCache.subscribed,
            subscription_tier: parsedCache.subscription_tier,
            subscription_end: parsedCache.subscription_end,
          });
        }
      } catch (e) {
        // Invalid cache, ignore
      }
    }

    checkSubscription();
  }, [checkSubscription]);

  // Listen for URL changes to detect returning from Stripe
  useEffect(() => {
    const handleFocus = () => {
      // When window regains focus, check subscription status
      checkSubscription(true);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSubscription(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkSubscription]);

  return {
    subscription,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
