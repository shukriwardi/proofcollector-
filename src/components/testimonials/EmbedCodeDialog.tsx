
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface EmbedCodeDialogProps {
  testimonial: Testimonial | null;
  isOpen: boolean;
  onClose: () => void;
  onCopyEmbed: (testimonial: Testimonial) => void;
}

export const EmbedCodeDialog = ({ testimonial, isOpen, onClose, onCopyEmbed }: EmbedCodeDialogProps) => {
  if (!testimonial) return null;

  const generateIframeCode = (testimonial: Testimonial) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    return `<iframe src="${currentOrigin}/embed/${testimonial.id}" width="400" height="300" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></iframe>`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Embed Code</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Copy this iframe code to embed the proof on your website:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <code className="text-sm text-gray-800 whitespace-pre-wrap break-all">
              {generateIframeCode(testimonial)}
            </code>
          </div>
          <Button
            onClick={() => onCopyEmbed(testimonial)}
            className="w-full"
          >
            Copy Embed Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
