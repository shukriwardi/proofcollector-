
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

  const downloadTestimonialAsImage = async (testimonial: Testimonial) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      canvas.width = 800;
      canvas.height = 600;

      // Dark background matching website theme
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rounded container with shadow effect
      const containerPadding = 40;
      const containerWidth = canvas.width - (containerPadding * 2);
      const containerHeight = canvas.height - (containerPadding * 2);
      
      // Draw rounded container background
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.roundRect(containerPadding, containerPadding, containerWidth, containerHeight, 12);
      ctx.fill();

      // Draw subtle border
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(containerPadding, containerPadding, containerWidth, containerHeight, 12);
      ctx.stroke();

      // Header with purple accent
      ctx.fillStyle = '#8e44ad';
      ctx.font = 'bold 28px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ProofCollector', canvas.width / 2, 100);

      // Survey title
      ctx.fillStyle = '#e0e0e0';
      ctx.font = '20px Inter, Arial, sans-serif';
      ctx.fillText(testimonial.survey.title, canvas.width / 2, 140);

      // Testimonial content with proper text wrapping
      ctx.fillStyle = '#ffffff';
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

      // Author name with green accent
      ctx.fillStyle = '#2ecc71';
      ctx.font = 'bold 20px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`— ${testimonial.name}`, canvas.width / 2, y + 60);

      // Date
      ctx.fillStyle = '#888888';
      ctx.font = '16px Inter, Arial, sans-serif';
      const date = new Date(testimonial.created_at).toLocaleDateString();
      ctx.fillText(date, canvas.width / 2, y + 90);

      // Verified badge with green checkmark
      ctx.fillStyle = '#2ecc71';
      ctx.font = 'bold 14px Inter, Arial, sans-serif';
      ctx.fillText('✓ Verified Testimonial', canvas.width / 2, canvas.height - 60);

      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Failed to create image');
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `testimonial-${testimonial.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "✅ Testimonial Downloaded!",
          description: "The testimonial image has been saved to your device.",
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

  const copyEmbedCode = (testimonial: Testimonial) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    // Enhanced embed code with dark theme styling
    const embedCode = `<div style="max-width: 500px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
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
    
    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "✅ Embed Code Copied!",
        description: "The dark-themed iframe embed code has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy embed code. Please try again.",
        variant: "destructive",
      });
    });
  };

  const copyTestimonialLink = (testimonial: Testimonial) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const testimonialUrl = `${currentOrigin}/t/${testimonial.id}`;
    
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
