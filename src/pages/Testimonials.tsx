
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { TestimonialStats } from "@/components/testimonials/TestimonialStats";
import { TestimonialFilters } from "@/components/testimonials/TestimonialFilters";
import { TestimonialView } from "@/components/testimonials/TestimonialView";
import { TestimonialEmbed } from "@/components/testimonials/TestimonialEmbed";
import { TestimonialDownload } from "@/components/testimonials/TestimonialDownload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/testimonials/LoadingSpinner";

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

interface Survey {
  id: string;
  title: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState("all");
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null);
  const [embeddingTestimonial, setEmbeddingTestimonial] = useState<Testimonial | null>(null);
  const [downloadingTestimonial, setDownloadingTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  console.log('🔄 Testimonials: Component rendered with user:', user?.id, 'authLoading:', authLoading);

  useEffect(() => {
    console.log('🔄 Testimonials: useEffect triggered with user.id:', user?.id, 'authLoading:', authLoading);
    if (!authLoading) {
      fetchTestimonials();
      fetchSurveys();
    }
  }, [user?.id, authLoading]);

  const fetchTestimonials = async () => {
    console.log('📊 Testimonials: fetchTestimonials called for user:', user?.id);
    
    if (!user?.id) {
      console.log('❌ Testimonials: No user ID, setting loading to false');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('📊 Testimonials: Starting testimonials fetch');
      const startTime = Date.now();
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*, survey:survey_id(id, title, question)')
        .order('created_at', { ascending: false });

      const queryTime = Date.now() - startTime;
      console.log(`📊 Testimonials: Query completed in ${queryTime}ms:`, { 
        dataCount: data?.length, 
        error,
        userId: user.id 
      });

      if (error) {
        console.error("❌ Testimonials: Error fetching testimonials:", error);
        toast({
          title: "Error",
          description: "Failed to load testimonials.",
          variant: "destructive",
        });
        setTestimonials([]);
      } else {
        console.log('✅ Testimonials: Successfully loaded testimonials:', data?.length || 0);
        setTestimonials(data || []);
      }
    } catch (error) {
      console.error("❌ Testimonials: Unexpected error fetching testimonials:", error);
      toast({
        title: "Unexpected Error",
        description: "Failed to load testimonials due to an unexpected error.",
        variant: "destructive",
      });
      setTestimonials([]);
    } finally {
      console.log('📊 Testimonials: Setting loading to false');
      setLoading(false);
    }
  };

  const fetchSurveys = async () => {
    console.log('📊 Testimonials: fetchSurveys called for user:', user?.id);
    
    if (!user?.id) {
      console.log('❌ Testimonials: No user ID for surveys fetch');
      return;
    }

    try {
      console.log('📊 Testimonials: Starting surveys fetch');
      const startTime = Date.now();
      
      const { data, error } = await supabase
        .from('surveys')
        .select('id, title')
        .eq('user_id', user.id);

      const queryTime = Date.now() - startTime;
      console.log(`📊 Testimonials: Surveys query completed in ${queryTime}ms:`, { 
        dataCount: data?.length, 
        error,
        userId: user.id 
      });

      if (error) {
        console.error("❌ Testimonials: Error fetching surveys:", error);
        toast({
          title: "Error",
          description: "Failed to load surveys.",
          variant: "destructive",
        });
        setSurveys([]);
      } else {
        console.log('✅ Testimonials: Successfully loaded surveys:', data?.length || 0);
        setSurveys(data || []);
      }
    } catch (error) {
      console.error("❌ Testimonials: Unexpected error fetching surveys:", error);
      toast({
        title: "Unexpected Error",
        description: "Failed to load surveys due to an unexpected error.",
        variant: "destructive",
      });
      setSurveys([]);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    console.log('🗑️ Testimonials: Deleting testimonial:', testimonialId);
    try {
      const startTime = Date.now();
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      const queryTime = Date.now() - startTime;
      console.log(`📊 Testimonials: Delete query completed in ${queryTime}ms:`, { error });

      if (error) {
        console.error("❌ Testimonials: Error deleting testimonial:", error);
        toast({
          title: "Error",
          description: "Failed to delete testimonial.",
          variant: "destructive",
        });
      } else {
        console.log('✅ Testimonials: Testimonial deleted successfully');
        setTestimonials(testimonials.filter(t => t.id !== testimonialId));
        toast({
          title: "Success",
          description: "Testimonial deleted successfully.",
        });
      }
    } catch (error) {
      console.error("❌ Testimonials: Unexpected error deleting testimonial:", error);
      toast({
        title: "Unexpected Error",
        description: "Failed to delete testimonial due to an unexpected error.",
        variant: "destructive",
      });
    }
  };

  const handleSurveyChange = (surveyId: string) => {
    console.log('🔄 Testimonials: Survey filter changed to:', surveyId);
    setSelectedSurvey(surveyId);
  };

  const filteredTestimonials = selectedSurvey === "all"
    ? testimonials
    : testimonials.filter(t => t.survey.id === selectedSurvey);

  const totalTestimonials = testimonials.length;
  const totalSurveys = surveys.length;
  const averageRating = 5;

  console.log('📊 Testimonials: Current state:', { 
    loading, 
    authLoading,
    testimonials: testimonials.length, 
    surveys: surveys.length,
    user: !!user,
    userId: user?.id 
  });

  if (authLoading) {
    console.log('⏳ Testimonials: Auth still loading, showing spinner');
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner message="Authenticating..." />
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('⏳ Testimonials: Data loading, showing spinner');
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner message="Loading testimonials..." />
        </div>
      </div>
    );
  }

  console.log('✅ Testimonials: Rendering main testimonials content');

  return (
    <div className="container mx-auto py-10">
      {/* Stats Section */}
      <TestimonialStats
        totalTestimonials={totalTestimonials}
        totalSurveys={totalSurveys}
        averageRating={averageRating}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {/* Filters Section */}
        <div className="md:col-span-1">
          <TestimonialFilters
            surveys={surveys}
            selectedSurvey={selectedSurvey}
            onSurveyChange={handleSurveyChange}
          />
        </div>

        {/* List and Search Section */}
        <div className="md:col-span-3">
          <div className="mb-4 flex items-center">
            <Input
              type="search"
              placeholder="Search testimonials..."
              className="bg-gray-800 border-gray-700 text-white shadow-none focus-visible:ring-purple-500 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" className="ml-2">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <TestimonialList
            testimonials={filteredTestimonials}
            searchTerm={searchTerm}
            onView={(testimonial) => setViewingTestimonial(testimonial)}
            onEmbed={(testimonial) => setEmbeddingTestimonial(testimonial)}
            onDownload={(testimonial) => setDownloadingTestimonial(testimonial)}
            onDelete={handleDeleteTestimonial}
          />
        </div>
      </div>

      {/* Modals */}
      {viewingTestimonial && (
        <TestimonialView
          testimonial={viewingTestimonial}
          onClose={() => setViewingTestimonial(null)}
        />
      )}
      {embeddingTestimonial && (
        <TestimonialEmbed
          testimonial={embeddingTestimonial}
          onClose={() => setEmbeddingTestimonial(null)}
        />
      )}
      {downloadingTestimonial && (
        <TestimonialDownload
          testimonial={downloadingTestimonial}
          onClose={() => setDownloadingTestimonial(null)}
        />
      )}
    </div>
  );
};

export default Testimonials;
