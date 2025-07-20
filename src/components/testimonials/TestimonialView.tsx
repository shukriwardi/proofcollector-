
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Mail } from "lucide-react";

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

interface TestimonialViewProps {
  testimonial: Testimonial;
  onClose: () => void;
}

export const TestimonialView = ({ testimonial, onClose }: TestimonialViewProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">View Testimonial</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with survey info */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-900/30 border-purple-500 text-purple-400">
              {testimonial.survey.title}
            </Badge>
            <Badge variant="secondary" className="bg-green-600 text-white border-green-500">
              Published
            </Badge>
          </div>

          {/* Survey Question */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Survey Question</h3>
            <p className="text-gray-200">{testimonial.survey.question}</p>
          </div>

          {/* Testimonial Content */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <blockquote className="text-lg text-gray-200 leading-relaxed">
              <span className="text-gray-500 text-2xl">"</span>
              {testimonial.testimonial}
              <span className="text-gray-500 text-2xl">"</span>
            </blockquote>
          </div>

          {/* Author Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-white font-medium">{testimonial.name}</span>
            </div>
            
            {testimonial.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{testimonial.email}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">
                {new Date(testimonial.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
