
import { useState, useEffect } from "react";
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
      console.log('Fetching testimonials for user:', user?.id);
      
      // Fetch testimonials that belong to surveys owned by the current user
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          *,
          survey:surveys!inner (
            id,
            title,
            question,
            user_id
          )
        `)
        .eq('survey.user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }

      console.log('Testimonials fetched:', data);
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
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading testimonials...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="space-y-8 p-6 lg:p-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Testimonials</h1>
          <p className="text-gray-400 mt-2">Manage and organize your collected testimonials</p>
        </div>

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
    </div>
  );
};

export default Testimonials;
