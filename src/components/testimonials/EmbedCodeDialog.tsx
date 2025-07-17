
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
    return `<div style="max-width: 500px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
  <iframe 
    src="${currentOrigin}/t/${testimonial.id}" 
    width="100%" 
    height="400" 
    frameborder="0" 
    style="
      border-radius: 12px; 
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      background: #0a0a0a;
      border: 1px solid #333333;
    "
    loading="lazy"
    title="Testimonial by ${testimonial.name}"
  ></iframe>
</div>`;
  };

  const generateDirectLink = (testimonial: Testimonial) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${currentOrigin}/t/${testimonial.id}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Share Dark-Themed Testimonial</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Direct Link</h3>
            <p className="text-sm text-gray-400 mb-2">
              Share this link directly with others:
            </p>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <code className="text-sm text-gray-200 break-all">
                {generateDirectLink(testimonial)}
              </code>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Dark Theme Embed Code</h3>
            <p className="text-sm text-gray-400 mb-2">
              Copy this responsive iframe code with dark theme styling for your website:
            </p>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 max-h-48 overflow-y-auto">
              <code className="text-sm text-gray-200 whitespace-pre-wrap break-all">
                {generateIframeCode(testimonial)}
              </code>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium text-purple-400 mb-2">✨ Dark Theme Features:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Consistent dark background (#0a0a0a)</li>
              <li>• Purple and green accent colors</li>
              <li>• Rounded corners and subtle shadows</li>
              <li>• Responsive design for all screen sizes</li>
              <li>• High contrast for accessibility</li>
            </ul>
          </div>
          
          <Button
            onClick={() => onCopyEmbed(testimonial)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Copy Dark Theme Embed Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
