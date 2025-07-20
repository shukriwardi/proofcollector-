
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
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

interface TestimonialEmbedProps {
  testimonial: Testimonial;
  onClose: () => void;
}

export const TestimonialEmbed = ({ testimonial, onClose }: TestimonialEmbedProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateEmbedCode = () => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    return `<div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
  <iframe 
    src="${currentOrigin}/t/${testimonial.id}" 
    width="100%" 
    height="400" 
    frameborder="0" 
    style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); background: #ffffff; border: 1px solid #e5e7eb;"
    loading="lazy"
    title="Testimonial by ${testimonial.name}"
  ></iframe>
</div>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "✅ Embed Code Copied!",
        description: "The iframe embed code has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Embed Testimonial</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Embed Code</h3>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="text-xs bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-h-64 overflow-y-auto">
            <pre className="text-sm text-gray-200 p-4 whitespace-pre-wrap break-all">
              {generateEmbedCode()}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
