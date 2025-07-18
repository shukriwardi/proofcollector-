
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_end?: string;
  verified?: boolean; // Track if this was verified from Stripe
}

const CACHE_KEY = 'subscription_cache_v2';
const VERIFIED_KEY = 'subscription_verified';

export const useSubscription = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'free',
  });
  const [loading, setLoading] = useState(true);
  const checkingRef = useRef(false);
  const retryCountRef = useRef(0);

  // Load cached subscription on mount
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const verified = localStorage.getItem(VERIFIED_KEY);
    
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        const isVerified = verified === 'true';
        
        // Only use cache if it's recent (30 seconds) or if it's a verified Pro status
        const cacheAge = Date.now() - (parsedCache.cached_at || 0);
        const shouldUseCache = cacheAge < 30000 || (isVerified && parsedCache.subscription_tier === 'pro');
        
        if (shouldUseCache) {
          setSubscription({
            subscribed: parsedCache.subscribed || false,
            subscription_tier: parsedCache.subscription_tier || 'free',
            subscription_end: parsedCache.subscription_end,
            verified: isVerified,
          });
          
          // If we have verified Pro status, don't show loading
          if (isVerified && parsedCache.subscription_tier === 'pro') {
            setLoading(false);
          }
        }
      } catch (e) {
        console.warn('Invalid subscription cache:', e);
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(VERIFIED_KEY);
      }
    }
  }, []);

  const checkSubscription = useCallback(async (skipLoading = false, forceCheck = false) => {
    if (!user || !session) {
      setSubscription({ subscribed: false, subscription_tier: 'free' });
      setLoading(false);
      return { subscribed: false, subscription_tier: 'free' as const };
    }

    // Prevent multiple simultaneous checks
    if (checkingRef.current && !forceCheck) {
      return subscription;
    }

    // Don't overwrite verified Pro status unless forced
    const verified = localStorage.getItem(VERIFIED_KEY) === 'true';
    if (verified && subscription.subscription_tier === 'pro' && !forceCheck) {
      setLoading(false);
      return subscription;
    }

    try {
      checkingRef.current = true;
      if (!skipLoading) setLoading(true);
      
      console.log('🔄 Checking subscription status...');
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('❌ Subscription check error:', error);
        
        // Retry logic - max 3 attempts
        if (retryCountRef.current < 3) {
          retryCountRef.current++;
          console.log(`🔄 Retrying subscription check (${retryCountRef.current}/3)...`);
          
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, retryCountRef.current - 1) * 1000;
          setTimeout(() => {
            checkSubscription(skipLoading, forceCheck);
          }, delay);
          return subscription;
        }
        
        // After max retries, don't overwrite verified Pro status
        if (verified && subscription.subscription_tier === 'pro') {
          console.log('⚠️ Keeping verified Pro status despite API errors');
          setLoading(false);
          return subscription;
        }
        
        throw error;
      }

      // Reset retry counter on success
      retryCountRef.current = 0;

      const newSubscription: SubscriptionData = {
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || 'free',
        subscription_end: data.subscription_end,
        verified: data.subscription_tier === 'pro', // Mark Pro as verified
      };

      console.log('✅ Subscription status updated:', newSubscription);

      setSubscription(newSubscription);
      
      // Cache the result with timestamp
      const cacheData = {
        ...newSubscription,
        cached_at: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      
      // Mark as verified if Pro
      if (newSubscription.subscription_tier === 'pro') {
        localStorage.setItem(VERIFIED_KEY, 'true');
        console.log('🎉 Pro subscription verified and cached!');
      } else {
        localStorage.removeItem(VERIFIED_KEY);
      }

      return newSubscription;
    } catch (error) {
      console.error('❌ Error checking subscription:', error);
      
      // Don't overwrite verified Pro status on errors
      const verified = localStorage.getItem(VERIFIED_KEY) === 'true';
      if (verified && subscription.subscription_tier === 'pro') {
        console.log('⚠️ Keeping verified Pro status despite error');
        setLoading(false);
        return subscription;
      }
      
      // Only fallback to free if we don't have verified Pro status
      setSubscription({ subscribed: false, subscription_tier: 'free' });
      
      toast({
        title: "Connection Issue",
        description: "Having trouble checking your subscription status. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      checkingRef.current = false;
      setLoading(false);
    }
  }, [user, session, subscription, toast]);

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
      
      if (checkoutWindow) {
        // Monitor window close and URL changes for instant sync
        const pollForSubscription = () => {
          const interval = setInterval(async () => {
            if (checkoutWindow.closed) {
              console.log('🔄 Checkout window closed - checking subscription...');
              // Force immediate check when window closes
              await checkSubscription(false, true);
              clearInterval(interval);
            }
          }, 1000);

          // Stop polling after 10 minutes
          setTimeout(() => clearInterval(interval), 600000);
        };

        pollForSubscription();
      }

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

  // Auto-check subscription when auth state is ready
  useEffect(() => {
    if (user && session && !checkingRef.current) {
      // Delay slightly to ensure auth is fully ready
      const timer = setTimeout(() => {
        checkSubscription();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, session, checkSubscription]);

  // Listen for window focus to detect return from Stripe
  useEffect(() => {
    const handleFocus = () => {
      // Check if we might be returning from Stripe
      const urlParams = new URLSearchParams(window.location.search);
      const hasStripeParams = urlParams.has('success') || urlParams.has('canceled');
      
      if (hasStripeParams || document.visibilityState === 'visible') {
        console.log('🔄 Window focused - checking subscription...');
        checkSubscription(true, true); // Force check on focus
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page visible - checking subscription...');
        checkSubscription(true, true);
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
