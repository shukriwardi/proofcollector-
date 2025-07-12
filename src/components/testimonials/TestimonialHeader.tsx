
import { MessageCircle } from "lucide-react";

interface TestimonialHeaderProps {
  title?: string;
}

export const TestimonialHeader = ({ title }: TestimonialHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <MessageCircle className="h-12 w-12 text-black mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-black mb-2">
        {title || "Share Your Experience"}
      </h1>
      <p className="text-gray-600">
        We'd love to hear about your experience. Your testimonial helps others learn about our services.
      </p>
    </div>
  );
};
