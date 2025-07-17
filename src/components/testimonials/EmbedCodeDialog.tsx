
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  onCopyEmbed: (testimonial: Testimonial, theme: 'light' | 'dark') => void;
}

export const EmbedCodeDialog = ({ testimonial, isOpen, onClose, onCopyEmbed }: EmbedCodeDialogProps) => {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light');
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('embed-theme-preference') as 'light' | 'dark' | null;
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  // Save theme preference to localStorage when changed
  const handleThemeChange = (theme: 'light' | 'dark') => {
    setSelectedTheme(theme);
    localStorage.setItem('embed-theme-preference', theme);
  };

  if (!testimonial) return null;

  const generateIframeCode = (testimonial: Testimonial, theme: 'light' | 'dark') => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const themeStyles = theme === 'dark' 
      ? `
      border-radius: 12px; 
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      background: #0a0a0a;
      border: 1px solid #333333;
    `
      : `
      border-radius: 12px; 
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      background: #ffffff;
      border: 1px solid #e5e7eb;
    `;

    return `<div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
  <iframe 
    src="${currentOrigin}/t/${testimonial.id}?theme=${theme}" 
    width="100%" 
    height="400" 
    frameborder="0" 
    style="${themeStyles}"
    loading="lazy"
    title="Testimonial by ${testimonial.name}"
  ></iframe>
</div>`;
  };

  const generateDirectLink = (testimonial: Testimonial) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${currentOrigin}/t/${testimonial.id}?theme=${selectedTheme}`;
  };

  const copyToClipboard = async (text: string, type: 'embed' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'embed') {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
        toast({
          title: "✅ Embed Code Copied!",
          description: `The ${selectedTheme}-themed iframe embed code has been copied to your clipboard.`,
        });
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        toast({
          title: "✅ Link Copied!",
          description: "The testimonial link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyEmbed = () => {
    onCopyEmbed(testimonial, selectedTheme);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-800 overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-white">Share Testimonial</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Theme Selection */}
          <div className="flex-shrink-0">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Choose Embed Theme</h3>
            <RadioGroup value={selectedTheme} onValueChange={handleThemeChange}>
              <div className={`flex items-center space-x-2 p-3 rounded-lg border transition-all cursor-pointer ${
                selectedTheme === 'light' 
                  ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}>
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center space-x-2 text-gray-300 cursor-pointer flex-1">
                  <Sun className="h-4 w-4" />
                  <span>Light Theme</span>
                  {selectedTheme === 'light' && <Check className="h-4 w-4 text-blue-400 ml-auto" />}
                </Label>
              </div>
              <div className={`flex items-center space-x-2 p-3 rounded-lg border transition-all cursor-pointer ${
                selectedTheme === 'dark' 
                  ? 'border-purple-500 bg-purple-500/10 ring-1 ring-purple-500/30' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}>
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center space-x-2 text-gray-300 cursor-pointer flex-1">
                  <Moon className="h-4 w-4" />
                  <span>Dark Theme</span>
                  {selectedTheme === 'dark' && <Check className="h-4 w-4 text-purple-400 ml-auto" />}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Direct Link Section */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-300">Direct Link</h3>
              <Button
                onClick={() => copyToClipboard(generateDirectLink(testimonial), 'link')}
                variant="outline"
                size="sm"
                className="text-xs bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                {copiedLink ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedLink ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Share this link directly with others:
            </p>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 max-h-20 overflow-y-auto">
              <pre className="text-sm text-gray-200 break-all whitespace-pre-wrap">
                {generateDirectLink(testimonial)}
              </pre>
            </div>
          </div>
          
          {/* Embed Code Section */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between mb-2 sticky top-0 bg-gray-900 py-2 z-10">
              <h3 className="text-sm font-medium text-gray-300">
                {selectedTheme === 'dark' ? 'Dark' : 'Light'} Theme Embed Code
              </h3>
              <Button
                onClick={() => copyToClipboard(generateIframeCode(testimonial, selectedTheme), 'embed')}
                variant="outline"
                size="sm"
                className="text-xs bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                {copiedEmbed ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedEmbed ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Copy this responsive iframe code with {selectedTheme} theme styling for your website:
            </p>
            <div className="bg-gray-800 rounded-lg border border-gray-700 max-h-64 overflow-y-auto">
              <pre className="text-sm text-gray-200 p-4 whitespace-pre-wrap break-all">
                {generateIframeCode(testimonial, selectedTheme)}
              </pre>
            </div>
          </div>
          
          {/* Features Info */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex-shrink-0">
            <h4 className="text-sm font-medium text-purple-400 mb-2">
              ✨ {selectedTheme === 'dark' ? 'Dark' : 'Light'} Theme Features:
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              {selectedTheme === 'dark' ? (
                <>
                  <li>• Consistent dark background (#0a0a0a)</li>
                  <li>• Purple and green accent colors</li>
                  <li>• High contrast for accessibility</li>
                  <li>• Subtle shadows and borders</li>
                </>
              ) : (
                <>
                  <li>• Clean white background</li>
                  <li>• Black text with subtle accents</li>
                  <li>• Light shadows and borders</li>
                  <li>• Professional appearance</li>
                </>
              )}
              <li>• Responsive design (max-width: 600px)</li>
              <li>• Works on all screen sizes</li>
              <li>• Clean integration on any website</li>
            </ul>
          </div>
        </div>
        
        {/* Fixed bottom button */}
        <div className="flex-shrink-0 pt-4 border-t border-gray-800">
          <Button
            onClick={handleCopyEmbed}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Copy {selectedTheme === 'dark' ? 'Dark' : 'Light'} Theme Embed Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
