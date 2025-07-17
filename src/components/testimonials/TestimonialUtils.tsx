
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

export const useTestimonialUtils = () => {
  const { toast } = useToast();

  const downloadTestimonialAsImage = async (testimonial: Testimonial, theme: 'light' | 'dark' = 'dark') => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      canvas.width = 800;
      canvas.height = 600;

      // Theme-specific colors
      const colors = theme === 'dark' 
        ? {
            background: '#0a0a0a',
            container: '#111111',
            border: '#333333',
            header: '#8e44ad',
            text: '#ffffff',
            subtext: '#e0e0e0',
            accent: '#2ecc71',
            muted: '#888888'
          }
        : {
            background: '#ffffff',
            container: '#f9fafb',
            border: '#e5e7eb',
            header: '#6366f1',
            text: '#111827',
            subtext: '#4b5563',
            accent: '#059669',
            muted: '#6b7280'
          };

      // Background
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rounded container
      const containerPadding = 40;
      const containerWidth = canvas.width - (containerPadding * 2);
      const containerHeight = canvas.height - (containerPadding * 2);
      
      // Draw container background
      ctx.fillStyle = colors.container;
      ctx.beginPath();
      ctx.roundRect(containerPadding, containerPadding, containerWidth, containerHeight, 12);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(containerPadding, containerPadding, containerWidth, containerHeight, 12);
      ctx.stroke();

      // Header with theme accent
      ctx.fillStyle = colors.header;
      ctx.font = 'bold 28px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ProofCollector', canvas.width / 2, 100);

      // Survey title
      ctx.fillStyle = colors.subtext;
      ctx.font = '20px Inter, Arial, sans-serif';
      ctx.fillText(testimonial.survey.title, canvas.width / 2, 140);

      // Testimonial content
      ctx.fillStyle = colors.text;
      ctx.font = '18px Inter, Arial, sans-serif';
      ctx.textAlign = 'left';
      
      const maxWidth = containerWidth - 80;
      const lineHeight = 28;
      const words = `"${testimonial.testimonial}"`.split(' ');
      let line = '';
      let y = 200;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, 80, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 80, y);

      // Author name with accent color
      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 20px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`— ${testimonial.name}`, canvas.width / 2, y + 60);

      // Date
      ctx.fillStyle = colors.muted;
      ctx.font = '16px Inter, Arial, sans-serif';
      const date = new Date(testimonial.created_at).toLocaleDateString();
      ctx.fillText(date, canvas.width / 2, y + 90);

      // Verified badge
      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 14px Inter, Arial, sans-serif';
      ctx.fillText('✓ Verified Testimonial', canvas.width / 2, canvas.height - 60);

      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Failed to create image');
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `testimonial-${testimonial.name.replace(/\s+/g, '-').toLowerCase()}-${theme}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "✅ Testimonial Downloaded!",
          description: `The ${theme} theme testimonial image has been saved to your device.`,
        });
      }, 'image/png');

    } catch (error) {
      console.error('Error downloading testimonial:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyEmbedCode = (testimonial: Testimonial, theme: 'light' | 'dark' = 'dark') => {
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

    const embedCode = `<div style="max-width: 500px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
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
    
    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "✅ Embed Code Copied!",
        description: `The ${theme}-themed iframe embed code has been copied to your clipboard.`,
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy embed code. Please try again.",
        variant: "destructive",
      });
    });
  };

  const copyTestimonialLink = (testimonial: Testimonial, theme: 'light' | 'dark' = 'light') => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const testimonialUrl = `${currentOrigin}/t/${testimonial.id}?theme=${theme}`;
    
    navigator.clipboard.writeText(testimonialUrl).then(() => {
      toast({
        title: "✅ Link Copied!",
        description: "The testimonial link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    });
  };

  return {
    downloadTestimonialAsImage,
    copyEmbedCode,
    copyTestimonialLink
  };
};
