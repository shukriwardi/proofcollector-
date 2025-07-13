
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordResetSession, setIsPasswordResetSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session, updatePassword } = useAuth();

  useEffect(() => {
    const checkPasswordResetSession = async () => {
      try {
        // Check if this is a password recovery session
        if (session && session.user) {
          // Additional check to see if this is a password recovery flow
          // We can detect this by checking if the URL has the recovery tokens
          const urlParams = new URLSearchParams(window.location.search);
          const hasRecoveryTokens = urlParams.has('access_token') || urlParams.has('token_hash');
          
          if (hasRecoveryTokens || window.location.hash.includes('access_token')) {
            console.log('Password recovery session detected');
            setIsPasswordResetSession(true);
          } else {
            console.log('Regular session, not password recovery');
            // If user has regular session but no recovery tokens, redirect to dashboard
            navigate('/dashboard');
          }
        } else {
          console.log('No session found, redirecting to forgot password');
          setTimeout(() => {
            navigate('/forgot-password');
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/forgot-password');
      } finally {
        setCheckingSession(false);
      }
    };

    checkPasswordResetSession();
  }, [session, navigate]);

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
      console.log('Attempting to update password for user:', user?.email);
      
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

  // Show loading while checking session validity
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Verifying reset link...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we verify your password reset request.</p>
        </div>
      </div>
    );
  }

  // If not a password reset session, show error message
  if (!isPasswordResetSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p>Invalid or expired reset link.</p>
          <p className="text-sm text-gray-600 mt-2">Redirecting to request a new reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <MessageCircle className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">ProofCollector</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Set Your New Password</CardTitle>
            <CardDescription className="text-center">
              Please enter your new password to complete the reset process
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  minLength={8}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Password must be at least 8 characters long.</p>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Updating Password..." : "Update Password"}
              </Button>
            </CardContent>
          </form>

          <CardContent className="pt-0">
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Request new reset link
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
