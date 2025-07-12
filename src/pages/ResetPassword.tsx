
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have the required tokens in the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      toast({
        title: "Invalid Reset Link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password Updated",
          description: "Your password has been updated successfully. You can now log in with your new password.",
        });
        navigate("/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-black" />
            <span className="text-2xl font-semibold text-black">ProofCollector</span>
          </Link>
        </div>

        <Card className="p-8 bg-white border-0 shadow-sm rounded-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-2">Reset Your Password</h1>
            <p className="text-gray-600">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-black font-medium">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                placeholder="Enter your new password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-black font-medium">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                placeholder="Confirm your new password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3"
              disabled={loading}
            >
              {loading ? "Updating Password..." : "Update Password"}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-black hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
