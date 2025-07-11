
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MessageCircle, Star } from "lucide-react";

const Submit = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    testimonial: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Testimonial submitted:", formData);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">Thank you!</h1>
          <p className="text-gray-600 mb-6">
            Your testimonial has been submitted successfully. We really appreciate you taking the time to share your experience.
          </p>
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Your feedback helps us improve and helps others make informed decisions.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <MessageCircle className="h-12 w-12 text-black mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-black mb-2">Share Your Experience</h1>
          <p className="text-gray-600">
            We'd love to hear about your experience. Your testimonial helps others learn about our services.
          </p>
        </div>

        <Card className="p-8 bg-white border-0 shadow-sm rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-black font-medium">Your Name *</Label>
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
                  placeholder="Enter your email (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">Optional - only used for follow-up if needed</p>
              </div>
            </div>

            <div>
              <Label htmlFor="testimonial" className="text-black font-medium">Your Testimonial *</Label>
              <Textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                rows={6}
                className="mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black resize-none"
                placeholder="Tell us about your experience... What did you like? How did we help you? What would you tell others?"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.testimonial.length}/500 characters
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Tips for a great testimonial:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Be specific about what you liked or found helpful</li>
                <li>• Mention the results or benefits you experienced</li>
                <li>• Share what you'd tell others considering our services</li>
                <li>• Be authentic and honest about your experience</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3 text-lg"
            >
              Submit Testimonial
            </Button>

            <p className="text-center text-xs text-gray-500">
              By submitting this testimonial, you give us permission to use it for marketing purposes. 
              We respect your privacy and will only use the information you provide here.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Submit;
