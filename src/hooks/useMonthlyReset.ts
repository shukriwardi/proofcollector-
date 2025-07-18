
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useMonthlyReset = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkMonthlyReset = () => {
      const now = new Date();
      const lastReset = localStorage.getItem(`lastReset_${user.id}`);
      const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;

      if (lastReset !== currentMonth) {
        // Month has changed, reset local usage tracking
        localStorage.setItem(`lastReset_${user.id}`, currentMonth);
        
        // Clear any cached usage data
        localStorage.removeItem(`usage_${user.id}`);
        
        console.log('Monthly usage limits have been reset');
      }
    };

    // Check on component mount
    checkMonthlyReset();

    // Check every hour
    const interval = setInterval(checkMonthlyReset, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);
};
