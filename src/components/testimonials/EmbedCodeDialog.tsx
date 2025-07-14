
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
    // Use the testimonial viewing URL (/t/:id) instead of embed
    return `<iframe src="${currentOrigin}/t/${testimonial.id}" width="400" height="300" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></iframe>`;
  };

  const generateDirectLink = (testimonial: Testimonial) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${currentOrigin}/t/${testimonial.id}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Testimonial</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Direct Link</h3>
            <p className="text-sm text-gray-600 mb-2">
              Share this link directly with others:
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <code className="text-sm text-gray-800 break-all">
                {generateDirectLink(testimonial)}
              </code>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Embed Code</h3>
            <p className="text-sm text-gray-600 mb-2">
              Copy this iframe code to embed the testimonial on your website:
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <code className="text-sm text-gray-800 whitespace-pre-wrap break-all">
                {generateIframeCode(testimonial)}
              </code>
            </div>
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
