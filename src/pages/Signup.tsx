
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, formData.username);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else if (error.message.includes('username')) {
          toast({
            title: "Username taken",
            description: "This username is already taken. Please choose another one.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success!",
          description: "Account created successfully. Please check your email to verify your account.",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-black" />
            <span className="text-2xl font-semibold text-black">Testimonials</span>
          </Link>
        </div>

        <Card className="p-8 bg-white border-0 shadow-sm rounded-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-2">Create your account</h1>
            <p className="text-gray-600">Start collecting testimonials in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-black font-medium">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                placeholder="Choose a username"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-black font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-black font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                placeholder="Create a password"
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-black font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-8">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-black hover:underline">Terms of Service</a> and{" "}
          <a href="#" className="text-black hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
