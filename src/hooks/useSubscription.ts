
import { useState } from 'react';

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_end?: string;
  verified?: boolean;
}

export const useSubscription = () => {
  const [subscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'free',
    verified: true,
  });
  const [loading] = useState(false);

  const checkSubscription = async () => {
    return subscription;
  };

  const createCheckout = async () => {
    console.log('Checkout not available - billing removed');
  };

  const openCustomerPortal = async () => {
    console.log('Customer portal not available - billing removed');
  };

  return {
    subscription,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
