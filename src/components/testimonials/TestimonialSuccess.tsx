
import { Card } from "@/components/ui/card";
import { CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestimonialSuccessProps {
  surveyTitle?: string;
}

export const TestimonialSuccess = ({ surveyTitle }: TestimonialSuccessProps) => {
  const handleClose = () => {
    // Try to close the window/tab, fallback to going back
    if (window.opener) {
      window.close();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <Card className="p-12 lg:p-16 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl text-center max-w-lg w-full">
        <div className="w-24 h-24 bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-green-800">
          <CheckCircle className="h-12 w-12 text-green-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-6">🎉 Thank you!</h1>
        <p className="text-xl text-gray-200 mb-8 leading-relaxed">
          Thank you for your feedback{surveyTitle ? ` about ${surveyTitle}` : ''}! Your testimonial has been received and will help others make informed decisions.
        </p>
        
        <div className="flex justify-center space-x-1 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-7 w-7 text-yellow-400 fill-current" />
          ))}
        </div>
        
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <p className="text-gray-300 leading-relaxed text-lg">
            Your feedback is valuable and helps build trust in the community. 
            We'll review your testimonial and it will be published shortly.
          </p>
        </div>
        
        <div className="text-center pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-6">
            Powered by <span className="font-semibold text-purple-400">ProofCollector</span>
          </p>
          <Button 
            variant="outline" 
            className="rounded-lg border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-purple-500 transition-all duration-200"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};
