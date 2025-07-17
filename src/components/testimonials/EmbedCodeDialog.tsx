
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";

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

    return `<div style="max-width: 500px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
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

  const handleCopyEmbed = () => {
    onCopyEmbed(testimonial, selectedTheme);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Share Testimonial</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Choose Embed Theme</h3>
            <RadioGroup value={selectedTheme} onValueChange={(value: 'light' | 'dark') => setSelectedTheme(value)}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                  <Sun className="h-4 w-4" />
                  <span>Light Theme</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  <span>Dark Theme</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

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
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              {selectedTheme === 'dark' ? 'Dark' : 'Light'} Theme Embed Code
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              Copy this responsive iframe code with {selectedTheme} theme styling for your website:
            </p>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 max-h-48 overflow-y-auto">
              <code className="text-sm text-gray-200 whitespace-pre-wrap break-all">
                {generateIframeCode(testimonial, selectedTheme)}
              </code>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
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
              <li>• Rounded corners and responsive design</li>
              <li>• Works on all screen sizes</li>
            </ul>
          </div>
          
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
