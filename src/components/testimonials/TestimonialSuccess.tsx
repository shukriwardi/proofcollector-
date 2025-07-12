
import { Card } from "@/components/ui/card";
import { MessageCircle, Star } from "lucide-react";

export const TestimonialSuccess = () => {
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
};
