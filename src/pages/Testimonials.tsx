import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TestimonialHeader } from "@/components/testimonials/TestimonialHeader";
import { TestimonialStats } from "@/components/testimonials/TestimonialStats";
import { TestimonialFilters } from "@/components/testimonials/TestimonialFilters";
import { TestimonialSearch } from "@/components/testimonials/TestimonialSearch";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { LoadingSpinner } from "@/components/testimonials/LoadingSpinner";

interface Testimonial {
  id: string;
  name: string;
  email: string;
  testimonial: string;
  created_at: string;
  surveys: {
    id: string;
    title: string;
  };
}

interface Survey {
  id: string;
  title: string;
}

const Testimonials = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  console.log('🔄 Testimonials: Component rendered (Stripe disabled) with user:', user?.id);

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      console.log('❌ Testimonials: No user ID, skipping fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📊 Testimonials: Starting data fetch (Stripe disabled) for user:', user.id);
      
      const startTime = Date.now();

      // Fetch surveys first
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .select('id, title')
        .eq('user_id', user.id)
        .order('title');

      const surveyQueryTime = Date.now() - startTime;
      console.log(`📊 Testimonials: Surveys query completed in ${surveyQueryTime}ms:`, { surveyData, surveyError });

      if (surveyError) throw surveyError;

      setSurveys(surveyData || []);

      // Fetch testimonials
      const testimonialsStartTime = Date.now();
      const { data: testimonialData, error: testimonialError } = await supabase
        .from('testimonials')
        .select(`
          id,
          name,
          email,
          testimonial,
          created_at,
          surveys!inner (
            id,
            title,
            user_id
          )
        `)
        .eq('surveys.user_id', user.id)
        .order('created_at', { ascending: false });

      const testimonialsQueryTime = Date.now() - testimonialsStartTime;
      console.log(`📊 Testimonials: Testimonials query completed in ${testimonialsQueryTime}ms:`, { testimonialData, testimonialError });

      if (testimonialError) throw testimonialError;

      setTestimonials(testimonialData || []);
      console.log('✅ Testimonials: Data loaded successfully');

    } catch (error) {
      console.error('❌ Testimonials: Error fetching data:', error);
      setTestimonials([]);
      setSurveys([]);
    } finally {
      const totalTime = Date.now();
      console.log(`📊 Testimonials: Setting loading to false - total time: ${totalTime}ms`);
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    console.log('🔄 Testimonials: useEffect triggered (Stripe disabled) with user.id:', user?.id);
    if (user?.id) {
      fetchData();
    } else {
      console.log('📊 Testimonials: No user, setting loading to false');
      setLoading(false);
    }
  }, [user?.id, fetchData]);

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(testimonial => {
      const matchesSurvey = selectedSurvey === "all" || testimonial.surveys.id === selectedSurvey;
      const matchesSearch = !searchTerm || 
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.surveys.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSurvey && matchesSearch;
    });
  }, [testimonials, selectedSurvey, searchTerm]);

  const handleDeleteTestimonial = useCallback(async (testimonialId: string) => {
    try {
      console.log('🗑️ Testimonials: Deleting testimonial:', testimonialId);
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) throw error;

      setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
      console.log('✅ Testimonials: Testimonial deleted successfully');
    } catch (error) {
      console.error('❌ Testimonials: Error deleting testimonial:', error);
    }
  }, []);

  console.log('📊 Testimonials: Current state (Stripe disabled):', { 
    loading, 
    testimonials: testimonials.length, 
    surveys: surveys.length,
    filtered: filteredTestimonials.length,
    user: !!user 
  });

  if (loading) {
    console.log('⏳ Testimonials: Showing loading spinner');
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner message="Loading testimonials..." />
        </div>
      </div>
    );
  }

  console.log('✅ Testimonials: Rendering main testimonials content (Stripe disabled)');

  return (
    <div className="min-h-screen bg-black">
      <div className="space-y-8 p-6 lg:p-8">
        <TestimonialHeader />
        
        <TestimonialStats 
          totalTestimonials={testimonials.length}
          totalSurveys={surveys.length}
          averageRating={0}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4">
            <TestimonialFilters
              surveys={surveys}
              selectedSurvey={selectedSurvey}
              onSurveyChange={setSelectedSurvey}
            />
          </div>

          <div className="lg:w-3/4">
            <TestimonialSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            <TestimonialList
              testimonials={filteredTestimonials}
              onDelete={handleDeleteTestimonial}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
