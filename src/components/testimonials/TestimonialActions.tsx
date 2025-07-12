
import { Button } from "@/components/ui/button";
import { Eye, Code, Download, Trash2 } from "lucide-react";

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

interface TestimonialActionsProps {
  testimonial: Testimonial;
  onView: (testimonial: Testimonial) => void;
  onEmbed: (testimonial: Testimonial) => void;
  onDownload: (testimonial: Testimonial) => void;
  onDelete: (testimonialId: string) => void;
}

export const TestimonialActions = ({ 
  testimonial, 
  onView, 
  onEmbed, 
  onDownload, 
  onDelete 
}: TestimonialActionsProps) => {
  return (
    <div className="flex items-center space-x-2 ml-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onView(testimonial)}
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        title="Get Embed Code"
        onClick={() => onEmbed(testimonial)}
      >
        <Code className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        title="Download as Image"
        onClick={() => onDownload(testimonial)}
      >
        <Download className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-600 hover:text-red-700"
        title="Delete Proof"
        onClick={() => onDelete(testimonial.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
