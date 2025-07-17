
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Since we're using Google auth only, password reset is not needed
  const resetPassword = async (email: string) => {
    toast({
      title: "Password Reset Not Available",
      description: "Please use Google authentication to sign in.",
      variant: "destructive",
    });
    return { success: false };
  };

  return {
    resetPassword,
    loading
  };
};
