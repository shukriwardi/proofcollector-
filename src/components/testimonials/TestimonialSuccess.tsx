
import { Card } from "@/components/ui/card";
import { MessageCircle, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TestimonialSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <Card className="p-12 lg:p-16 bg-white border border-gray-100 shadow-lg rounded-2xl text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-black mb-4">Thank you!</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your testimonial has been submitted successfully. We really appreciate you taking the time to share your experience with us.
        </p>
        
        <div className="flex justify-center space-x-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-600 leading-relaxed">
            Your feedback helps us improve and helps others make informed decisions. 
            We'll review your testimonial and it will be published shortly.
          </p>
        </div>
        
        <div className="text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-4">
            Powered by <span className="font-semibold text-black">ProofCollector</span>
          </p>
          <Button 
            variant="outline" 
            className="rounded-lg border-gray-200 hover:bg-gray-50"
            onClick={() => window.close()}
          >
            Close window
          </Button>
        </div>
      </Card>
    </div>
  );
};
