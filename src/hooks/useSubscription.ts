import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_end?: string;
  verified?: boolean;
}

const CACHE_KEY = 'subscription_cache_v3';
const VERIFIED_KEY = 'subscription_verified';
const PRO_LOCK_KEY = 'pro_status_locked';
const CHECK_COOLDOWN = 10000; // 10 seconds cooldown between checks

export const useSubscription = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'free',
  });
  const [loading, setLoading] = useState(true);
  const checkingRef = useRef(false);
  const lastCheckTime = useRef(0);
  const retryCountRef = useRef(0);

  // Load cached subscription on mount
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const verified = localStorage.getItem(VERIFIED_KEY) === 'true';
    const proLocked = localStorage.getItem(PRO_LOCK_KEY) === 'true';
    
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        const isProStatus = parsedCache.subscription_tier === 'pro';
        
        // If Pro status is locked or recently verified, use cache immediately
        if ((proLocked && isProStatus) || (verified && isProStatus)) {
          console.log('🎉 Using locked Pro status from cache');
          setSubscription({
            subscribed: true,
            subscription_tier: 'pro',
            subscription_end: parsedCache.subscription_end,
            verified: true,
          });
          setLoading(false);
          return;
        }

        // Use recent cache (within 30 seconds)
        const cacheAge = Date.now() - (parsedCache.cached_at || 0);
        if (cacheAge < 30000) {
          console.log('📋 Using recent cache');
          setSubscription({
            subscribed: parsedCache.subscribed || false,
            subscription_tier: parsedCache.subscription_tier || 'free',
            subscription_end: parsedCache.subscription_end,
            verified: verified,
          });
          
          if (isProStatus) {
            setLoading(false);
          }
        }
      } catch (e) {
        console.warn('Invalid subscription cache:', e);
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(VERIFIED_KEY);
        localStorage.removeItem(PRO_LOCK_KEY);
      }
    }
  }, []);

  const checkSubscription = useCallback(async (skipLoading = false, forceCheck = false) => {
    if (!user || !session) {
      setSubscription({ subscribed: false, subscription_tier: 'free' });
      setLoading(false);
      return { subscribed: false, subscription_tier: 'free' as const };
    }

    // Cooldown check (unless forced)
    const now = Date.now();
    if (!forceCheck && now - lastCheckTime.current < CHECK_COOLDOWN) {
      console.log('⏱️ Subscription check on cooldown');
      setLoading(false);
      return subscription;
    }

    // Prevent multiple simultaneous checks
    if (checkingRef.current && !forceCheck) {
      console.log('⏸️ Subscription check already in progress');
      return subscription;
    }

    // Don't overwrite locked Pro status unless forced
    const proLocked = localStorage.getItem(PRO_LOCK_KEY) === 'true';
    if (proLocked && subscription.subscription_tier === 'pro' && !forceCheck) {
      console.log('🔒 Pro status is locked, skipping check');
      setLoading(false);
      return subscription;
    }

    try {
      checkingRef.current = true;
      if (!skipLoading) setLoading(true);
      
      console.log('🔄 Checking subscription status...');
      lastCheckTime.current = now;
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('❌ Subscription check error:', error);
        
        // Retry logic with exponential backoff
        if (retryCountRef.current < 2) {
          retryCountRef.current++;
          console.log(`🔄 Retrying subscription check (${retryCountRef.current}/2)...`);
          
          const delay = Math.pow(2, retryCountRef.current - 1) * 2000;
          setTimeout(() => {
            checkSubscription(skipLoading, forceCheck);
          }, delay);
          return subscription;
        }
        
        // Keep verified Pro status despite API errors
        if (proLocked && subscription.subscription_tier === 'pro') {
          console.log('⚠️ Keeping locked Pro status despite API errors');
          setLoading(false);
          return subscription;
        }
        
        throw error;
      }

      retryCountRef.current = 0;

      const newSubscription: SubscriptionData = {
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || 'free',
        subscription_end: data.subscription_end,
        verified: data.subscription_tier === 'pro',
      };

      console.log('✅ Subscription status updated:', newSubscription);

      setSubscription(newSubscription);
      
      // Cache with timestamp
      const cacheData = {
        ...newSubscription,
        cached_at: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      
      // Lock Pro status to prevent reverting
      if (newSubscription.subscription_tier === 'pro') {
        localStorage.setItem(VERIFIED_KEY, 'true');
        localStorage.setItem(PRO_LOCK_KEY, 'true');
        console.log('🔒 Pro subscription locked and verified!');
        
        // Show success message only once
        if (subscription.subscription_tier !== 'pro') {
          toast({
            title: "🎉 Pro subscription activated!",
            description: "You now have access to all Pro features.",
          });
        }
      } else {
        localStorage.removeItem(VERIFIED_KEY);
        localStorage.removeItem(PRO_LOCK_KEY);
      }

      return newSubscription;
    } catch (error) {
      console.error('❌ Error checking subscription:', error);
      
      // Don't overwrite locked Pro status on errors
      const proLocked = localStorage.getItem(PRO_LOCK_KEY) === 'true';
      if (proLocked && subscription.subscription_tier === 'pro') {
        console.log('⚠️ Keeping locked Pro status despite error');
        setLoading(false);
        return subscription;
      }
      
      setSubscription({ subscribed: false, subscription_tier: 'free' });
      
      // Only show error if user was actively trying to check subscription
      if (forceCheck) {
        toast({
          title: "Connection Issue",
          description: "Having trouble checking your subscription status. Please refresh the page.",
          variant: "destructive",
        });
      }
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
      console.log('🛒 Creating checkout session...');
      
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

      // Open checkout in new tab and monitor for completion
      const checkoutWindow = window.open(data.url, '_blank');
      
      if (checkoutWindow) {
        let pollCount = 0;
        const maxPolls = 600; // 10 minutes max
        
        const pollForCompletion = () => {
          const interval = setInterval(async () => {
            pollCount++;
            
            if (checkoutWindow.closed || pollCount >= maxPolls) {
              console.log('🔄 Checkout window closed - forcing subscription check...');
              clearInterval(interval);
              
              // Force immediate check when window closes
              setTimeout(() => {
                checkSubscription(false, true);
              }, 1000);
            }
          }, 1000);
        };

        pollForCompletion();
      }

    } catch (error) {
      console.error('❌ Error creating checkout:', error);
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

      window.open(data.url, '_blank');
    } catch (error) {
      console.error('❌ Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    }
  }, [session, toast]);

  // Auto-check subscription when auth is ready (with delay)
  useEffect(() => {
    if (user && session && !checkingRef.current) {
      const timer = setTimeout(() => {
        checkSubscription();
      }, 1000); // Delay to ensure auth is fully ready
      
      return () => clearTimeout(timer);
    }
  }, [user, session, checkSubscription]);

  // Listen for Stripe return with optimized event handling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleVisibilityChange = () => {
      if (!document.hidden && user && session) {
        // Debounce the check to avoid multiple rapid calls
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.log('🔄 Page became visible - checking subscription...');
          checkSubscription(true, true);
        }, 1000);
      }
    };

    const handleFocus = () => {
      if (user && session) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.log('🔄 Window focused - checking subscription...');
          checkSubscription(true, true);
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, session, checkSubscription]);

  return {
    subscription,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
