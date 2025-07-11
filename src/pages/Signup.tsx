
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup form submitted:", formData);
    // Handle signup logic here
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
              <Label htmlFor="name" className="text-black font-medium">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                placeholder="Enter your full name"
                required
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
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3"
            >
              Create Account
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
