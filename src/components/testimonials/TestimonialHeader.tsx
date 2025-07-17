
import { MessageCircle } from "lucide-react";

interface TestimonialHeaderProps {
  title?: string;
}

export const TestimonialHeader = ({ title }: TestimonialHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
          <MessageCircle className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-2">
        {title ? `Share your experience with ${title}` : 'Share your testimonial'}
      </h1>
      
      <p className="text-gray-400 text-lg">
        Your feedback helps build trust and credibility
      </p>
    </div>
  );
};
