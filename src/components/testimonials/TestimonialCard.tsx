
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestimonialActions } from "./TestimonialActions";

interface Testimonial {
  id: string;
  name: string;
  email: string | null;
  testimonial: string;
  created_at: string;
  survey: {
    id: string;
    title: string;
    question: string;
  };
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  onView: (testimonial: Testimonial) => void;
  onEmbed: (testimonial: Testimonial) => void;
  onDownload: (testimonial: Testimonial) => void;
  onDelete: (testimonialId: string) => void;
}

export const TestimonialCard = ({ 
  testimonial, 
  onView, 
  onEmbed, 
  onDownload, 
  onDelete 
}: TestimonialCardProps) => {
  return (
    <Card className="p-6 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="font-semibold text-black">{testimonial.name}</h3>
            <Badge variant="default" className="text-xs">
              Published
            </Badge>
            <Badge variant="outline" className="text-xs">
              {testimonial.survey.title}
            </Badge>
          </div>
          
          <p className="text-gray-600 mb-3 line-clamp-3">
            "{testimonial.testimonial}"
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{testimonial.email || "No email provided"}</span>
            <span>•</span>
            <span>{new Date(testimonial.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <TestimonialActions
          testimonial={testimonial}
          onView={onView}
          onEmbed={onEmbed}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      </div>
    </Card>
  );
};
