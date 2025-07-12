
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

interface ViewTestimonialDialogProps {
  testimonial: Testimonial | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewTestimonialDialog = ({ testimonial, isOpen, onClose }: ViewTestimonialDialogProps) => {
  if (!testimonial) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Testimonial Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-black mb-2">From: {testimonial.name}</h3>
            <p className="text-sm text-gray-600 mb-2">Survey: {testimonial.survey.title}</p>
            <p className="text-sm text-gray-600 mb-4">
              {testimonial.email || "No email provided"} • {new Date(testimonial.created_at).toLocaleDateString()}
            </p>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Question:</p>
              <p className="text-sm text-gray-600 italic">{testimonial.survey.question}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Response:</p>
              <p className="text-gray-800 leading-relaxed">"{testimonial.testimonial}"</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
