
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

interface TestimonialDownloadProps {
  testimonial: Testimonial;
  onClose: () => void;
}

export const TestimonialDownload = ({ testimonial, onClose }: TestimonialDownloadProps) => {
  const { toast } = useToast();

  const downloadAsImage = () => {
    // For now, we'll just show a message that this feature is coming soon
    toast({
      title: "Coming Soon",
      description: "Image download feature will be available soon.",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Download Testimonial</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-2">{testimonial.name}</h3>
            <p className="text-gray-300 text-sm mb-2">"{testimonial.testimonial}"</p>
            <p className="text-gray-400 text-xs">
              {new Date(testimonial.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <Button
            onClick={downloadAsImage}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download as Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
