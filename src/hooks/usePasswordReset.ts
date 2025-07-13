
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSecurity } from "@/hooks/useSecurity";
import { validatePasswordStrength, logSecurityEvent } from "@/lib/security";

export const usePasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidResetSession, setIsValidResetSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, score: 0, feedback: [] });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { checkRateLimit, logAuthFailure } = useSecurity();

  useEffect(() => {
    const checkResetSession = () => {
      // Enhanced token validation
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
      const tokenType = urlParams.get('type') || hashParams.get('type');
      const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
      
      console.log('Checking reset session - Access token exists:', !!accessToken);
      console.log('Token type:', tokenType);
      console.log('Refresh token exists:', !!refreshToken);
      
      // Enhanced validation - require both access token and proper type
      if (accessToken && tokenType === 'recovery') {
        // Additional validation checks
        try {
          // Basic JWT structure validation (without decoding sensitive data)
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            console.log('Valid password recovery session detected');
            setIsValidResetSession(true);
            
            // Log successful token validation
            logSecurityEvent({
              type: 'auth_failure', // Using as general auth event
              details: { event: 'password_reset_token_validated' },
              userAgent: navigator.userAgent
            });
          } else {
            throw new Error('Invalid token structure');
          }
        } catch (error) {
          console.error('Invalid reset token:', error);
          logSecurityEvent({
            type: 'auth_failure',
            details: { event: 'invalid_password_reset_token', error: error.message },
            userAgent: navigator.userAgent
          });
          
          setTimeout(() => {
            navigate('/forgot-password');
          }, 2000);
        }
      } else {
        console.log('No valid reset session found, redirecting to forgot password');
        logSecurityEvent({
          type: 'auth_failure',
          details: { event: 'unauthorized_password_reset_access' },
          userAgent: navigator.userAgent
        });
        
        setTimeout(() => {
          navigate('/forgot-password');
        }, 2000);
      }
      
      setCheckingSession(false);
    };

    checkResetSession();
  }, [navigate]);

  // Real-time password strength checking
  useEffect(() => {
    if (password) {
      const strength = validatePasswordStrength(password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ isValid: false, score: 0, feedback: [] });
    }
  }, [password]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const rateLimitCheck = await checkRateLimit(
      'password_reset',
      'auth',
      3, // Max 3 attempts per 15 minutes
      15 * 60 * 1000
    );

    if (!rateLimitCheck.allowed) {
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive",
      });
      return;
    }

    // Enhanced password validation
    if (password !== confirmPassword) {
      logAuthFailure('password_mismatch');
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (!passwordStrength.isValid) {
      logAuthFailure('weak_password');
      toast({
        title: "Password too weak",
        description: passwordStrength.feedback.join(' '),
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      logAuthFailure('password_too_short');
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
        logAuthFailure('password_update_failed', error.message);
        
        toast({
          title: "Error updating password",
          description: "Unable to update your password. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Password updated successfully');
        
        // Log successful password reset
        logSecurityEvent({
          type: 'auth_failure', // Using as general auth event
          details: { event: 'password_reset_successful' },
          userAgent: navigator.userAgent
        });
        
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
      logAuthFailure('unexpected_error', error.message);
      
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
    passwordStrength,
    handleResetPassword
  };
};
