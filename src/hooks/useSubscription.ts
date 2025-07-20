
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_end?: string;
  verified?: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription] = useState<SubscriptionData>({
    subscribed: true, // Simulate Pro for testing
    subscription_tier: 'pro',
    verified: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔒 Subscription: Stripe disabled - simulating Pro subscription');
    setLoading(false);
  }, [user]);

  const checkSubscription = async () => {
    console.log('🔒 Subscription check disabled (Stripe removed)');
    return subscription;
  };

  const createCheckout = async () => {
    console.log('🔒 Checkout disabled (Stripe removed)');
  };

  const openCustomerPortal = async () => {
    console.log('🔒 Customer portal disabled (Stripe removed)');
  };

  return {
    subscription,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
