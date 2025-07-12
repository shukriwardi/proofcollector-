import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { TestimonialStats } from "@/components/testimonials/TestimonialStats";
import { TestimonialSearch } from "@/components/testimonials/TestimonialSearch";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { ViewTestimonialDialog } from "@/components/testimonials/ViewTestimonialDialog";
import { EmbedCodeDialog } from "@/components/testimonials/EmbedCodeDialog";

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

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTestimonials();
    }
  }, [user]);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          *,
          survey:surveys (
            id,
            title,
            question
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to load testimonials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) throw error;

      setTestimonials(testimonials.filter(t => t.id !== testimonialId));
      toast({
        title: "Testimonial Deleted",
        description: "The testimonial has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      ctx.fillText('Testimonial', canvas.width / 2, 80);

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

  const handleViewTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setViewDialogOpen(true);
  };

  const handleEmbedTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setEmbedDialogOpen(true);
  };

  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTestimonials = testimonials.length;
  const uniqueSurveys = new Set(testimonials.map(t => t.survey.id)).size;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading proof collection...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">ProofCollector</h1>
            <p className="text-gray-600 mt-2">Manage and display your collected social proof</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <TestimonialSearch 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />
          </div>
        </div>

        <TestimonialStats 
          totalTestimonials={totalTestimonials} 
          uniqueSurveys={uniqueSurveys} 
        />

        <div className="space-y-4">
          {filteredTestimonials.length === 0 ? (
            <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center">
              <p className="text-gray-500">
                {searchTerm ? "No proof found matching your search." : "No social proof yet. Share your survey links to start collecting testimonials!"}
              </p>
            </Card>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onView={handleViewTestimonial}
                onEmbed={handleEmbedTestimonial}
                onDownload={downloadTestimonialAsImage}
                onDelete={handleDeleteTestimonial}
              />
            ))
          )}
        </div>

        <ViewTestimonialDialog
          testimonial={selectedTestimonial}
          isOpen={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
        />

        <EmbedCodeDialog
          testimonial={selectedTestimonial}
          isOpen={embedDialogOpen}
          onClose={() => setEmbedDialogOpen(false)}
          onCopyEmbed={copyEmbedCode}
        />
      </div>
    </AppLayout>
  );
};

export default Testimonials;
