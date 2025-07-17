
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password Reset Not Available",
      description: "Please use Google authentication to sign in.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-white">Reset Password</CardTitle>
          <CardDescription className="text-gray-400">
            Password reset is not available. Please use Google authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                disabled
              />
            </div>
            <Button type="submit" className="w-full" disabled>
              Send Reset Link (Not Available)
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-purple-400 hover:text-purple-300 text-sm">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
