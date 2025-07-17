
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useSEO({
    title: 'Sign Up | ProofCollector',
    description: 'Create your ProofCollector account and start collecting powerful testimonials today.',
    url: 'https://proofcollector.shacnisaas.com/signup'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
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

    if (username.length < 3) {
      toast({
        title: "Username too short",
        description: "Username must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, username);
      
      if (error) {
        toast({
          title: "Error creating account",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
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
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <MessageCircle className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold text-white">ProofCollector</span>
          </Link>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Create your account</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Start collecting testimonials in minutes
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  minLength={3}
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  minLength={8}
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  minLength={8}
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="text-sm text-gray-400">
                Password must be at least 8 characters long. Username must be at least 3 characters long.
              </div>
              <Button 
                type="submit" 
                className="w-full bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20" 
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </CardContent>
          </form>

          <CardContent className="pt-0">
            <div className="text-center">
              <span className="text-gray-400">Already have an account? </span>
              <Link 
                to="/login" 
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
