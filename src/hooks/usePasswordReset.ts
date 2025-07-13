
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const usePasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidResetSession, setIsValidResetSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  useEffect(() => {
    const checkResetSession = () => {
      // Check URL parameters for recovery tokens
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Look for access_token and type=recovery in either URL params or hash
      const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
      const tokenType = urlParams.get('type') || hashParams.get('type');
      
      console.log('Checking reset session - Access token exists:', !!accessToken);
      console.log('Token type:', tokenType);
      
      if (accessToken && tokenType === 'recovery') {
        console.log('Valid password recovery session detected');
        setIsValidResetSession(true);
      } else {
        console.log('No valid reset session found, redirecting to forgot password');
        // Redirect to forgot password if no valid reset session
        setTimeout(() => {
          navigate('/forgot-password');
        }, 2000);
      }
      
      setCheckingSession(false);
    };

    checkResetSession();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to update password...');
      
      const { error } = await updatePassword(password);

      if (error) {
        console.error('Password update error:', error);
        toast({
          title: "Error updating password",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Password updated successfully');
        toast({
          title: "Password updated successfully",
          description: "Your password has been changed. Redirecting to dashboard...",
        });
        
        // Clear URL parameters after successful password update
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect to dashboard after successful password update
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    isValidResetSession,
    checkingSession,
    handleResetPassword
  };
};
