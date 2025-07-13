
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
  const { user, session, updatePassword } = useAuth();

  const checkForPasswordResetSession = () => {
    // Check URL parameters for recovery tokens
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const hasAccessToken = urlParams.has('access_token') || hashParams.has('access_token');
    const hasTokenHash = urlParams.has('token_hash') || hashParams.has('token_hash');
    const hasType = urlParams.get('type') === 'recovery' || hashParams.get('type') === 'recovery';
    
    console.log('URL params:', Object.fromEntries(urlParams));
    console.log('Hash params:', Object.fromEntries(hashParams));
    console.log('Has access token:', hasAccessToken);
    console.log('Has token hash:', hasTokenHash);
    console.log('Has recovery type:', hasType);
    
    // If we have recovery tokens in URL or session indicates password recovery
    if ((hasAccessToken && hasType) || (hasTokenHash && hasType)) {
      console.log('Valid password recovery session detected');
      setIsValidResetSession(true);
      setCheckingSession(false);
    } else if (session && user) {
      // Check if this is a fresh login from password recovery
      console.log('User session exists, checking if from recovery...');
      // For now, assume if we have a session but no tokens, redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      console.log('No valid reset session, redirecting to forgot password');
      setTimeout(() => {
        navigate('/forgot-password');
      }, 2000);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure URL params are fully loaded
    setTimeout(checkForPasswordResetSession, 100);
  }, [session, user, navigate]);

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
