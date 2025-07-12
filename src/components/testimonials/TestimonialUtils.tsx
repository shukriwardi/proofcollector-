
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

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      ctx.fillStyle = '#374151';
      ctx.font = '24px Arial, sans-serif';
      ctx.textAlign = 'center';

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillText('Social Proof', canvas.width / 2, 80);

      ctx.fillStyle = '#6b7280';
      ctx.font = '18px Arial, sans-serif';
      ctx.fillText(`From: ${testimonial.survey.title}`, canvas.width / 2, 120);

      ctx.fillStyle = '#374151';
      ctx.font = '20px Arial, sans-serif';
      ctx.textAlign = 'left';
      
      const maxWidth = canvas.width - 120;
      const lineHeight = 30;
      const words = `"${testimonial.testimonial}"`.split(' ');
      let line = '';
      let y = 180;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, 60, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 60, y);

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`- ${testimonial.name}`, canvas.width / 2, canvas.height - 80);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px Arial, sans-serif';
      const date = new Date(testimonial.created_at).toLocaleDateString();
      ctx.fillText(date, canvas.width / 2, canvas.height - 50);

      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Failed to create image');
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proof-${testimonial.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "✅ Proof Downloaded!",
          description: "The proof image has been saved to your device.",
        });
      }, 'image/png');

    } catch (error) {
      console.error('Error downloading proof:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download proof. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyEmbedCode = (testimonial: Testimonial) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const embedCode = `<iframe src="${currentOrigin}/embed/${testimonial.id}" width="400" height="300" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></iframe>`;
    
    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "✅ Embed Code Copied!",
        description: "The iframe embed code has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy embed code. Please try again.",
        variant: "destructive",
      });
    });
  };

  return {
    downloadTestimonialAsImage,
    copyEmbedCode
  };
};
