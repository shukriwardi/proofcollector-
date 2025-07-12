
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setSent(true);
        toast({
          title: "Reset email sent",
          description: "Check your email for the password reset link.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle className="text-2xl text-center">Forgot your password?</CardTitle>
            <CardDescription className="text-center">
              {sent 
                ? "We've sent you a password reset link"
                : "Enter your email address and we'll send you a link to reset your password"
              }
            </CardDescription>
          </CardHeader>

          {sent ? (
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-gray-600">
                <p>Check your email inbox for a password reset link.</p>
                <p className="mt-2">If you don't see it, check your spam folder.</p>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
              </CardFooter>
            </form>
          )}

          <CardFooter className="flex justify-center">
            <Link 
              to="/login" 
              className="flex items-center text-sm text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
