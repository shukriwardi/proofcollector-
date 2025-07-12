
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { TestimonialStats } from "@/components/testimonials/TestimonialStats";
import { TestimonialFilters } from "@/components/testimonials/TestimonialFilters";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { ViewTestimonialDialog } from "@/components/testimonials/ViewTestimonialDialog";
import { EmbedCodeDialog } from "@/components/testimonials/EmbedCodeDialog";
import { useTestimonialUtils } from "@/components/testimonials/TestimonialUtils";

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
  const { downloadTestimonialAsImage, copyEmbedCode } = useTestimonialUtils();

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
      console.error('Error fetching ProofCollector data:', error);
      toast({
        title: "Error",
        description: "Failed to load ProofCollector data. Please try again.",
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
        title: "Proof Deleted",
        description: "The proof has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting proof:', error);
      toast({
        title: "Error",
        description: "Failed to delete proof. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setViewDialogOpen(true);
  };

  const handleEmbedTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setEmbedDialogOpen(true);
  };

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
        <TestimonialFilters 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        <TestimonialStats 
          totalTestimonials={totalTestimonials} 
          uniqueSurveys={uniqueSurveys} 
        />

        <TestimonialList
          testimonials={testimonials}
          searchTerm={searchTerm}
          onView={handleViewTestimonial}
          onEmbed={handleEmbedTestimonial}
          onDownload={downloadTestimonialAsImage}
          onDelete={handleDeleteTestimonial}
        />

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
