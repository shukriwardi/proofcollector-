
import { MessageCircle } from "lucide-react";

interface TestimonialHeaderProps {
  title?: string;
}

export const TestimonialHeader = ({ title }: TestimonialHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <MessageCircle className="h-10 w-10 text-white" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-4">
        {title || 'Share Your Experience'}
      </h1>
      
      <p className="text-gray-300 text-xl leading-relaxed max-w-lg mx-auto">
        We'd love to hear about your experience. Your testimonial helps others learn about our services.
      </p>
    </div>
  );
};
