
import { MessageCircle, Star } from "lucide-react";

interface TestimonialHeaderProps {
  title?: string;
}

export const TestimonialHeader = ({ title }: TestimonialHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
        <MessageCircle className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold text-black mb-4">
        {title || "Share Your Experience"}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        We'd love to hear about your experience. Your testimonial helps others learn about our services and builds trust in our community.
      </p>
      
      {/* Rating display */}
      <div className="flex justify-center mt-6 space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
        ))}
      </div>
    </div>
  );
};
