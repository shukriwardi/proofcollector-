
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestimonialActions } from "./TestimonialActions";
import { User, Calendar } from "lucide-react";

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
  onDownload: (testimonial: Testimonial, theme?: 'light' | 'dark') => void;
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
    <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-200 rounded-xl group hover:border-purple-500/50">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <h3 className="font-semibold text-white truncate">{testimonial.name}</h3>
            </div>
            <Badge variant="secondary" className="bg-green-600 text-white border-green-500 text-xs px-2 py-1 hover:bg-green-700">
              Published
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-1 bg-purple-900/30 border-purple-500 text-purple-400">
              {testimonial.survey.title}
            </Badge>
          </div>
          
          {/* Testimonial Content */}
          <blockquote className="text-gray-300 mb-4 leading-relaxed">
            <span className="text-gray-500">"</span>
            <span className="line-clamp-3">{testimonial.testimonial}</span>
            <span className="text-gray-500">"</span>
          </blockquote>
          
          {/* Meta Information */}
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="truncate">{testimonial.email || "No email provided"}</span>
            <span className="text-gray-600">•</span>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(testimonial.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <TestimonialActions
            testimonial={testimonial}
            onView={onView}
            onEmbed={onEmbed}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        </div>
      </div>
    </Card>
  );
};
