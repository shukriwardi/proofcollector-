
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TestimonialFormContainer } from "@/components/testimonials/TestimonialFormContainer";
import { TestimonialSuccess } from "@/components/testimonials/TestimonialSuccess";
import { SurveyNotFound } from "@/components/testimonials/SurveyNotFound";
import { LoadingSpinner } from "@/components/testimonials/LoadingSpinner";

interface Survey {
  id: string;
  title: string;
  question: string;
  is_public?: boolean;
}

const Submit = () => {
  const { linkId } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('🔄 Submit: Component rendered with linkId:', linkId);

  useEffect(() => {
    const fetchSurvey = async () => {
      console.log('📊 Submit: fetchSurvey called with linkId:', linkId);
      
      if (!linkId) {
        console.log('❌ Submit: No linkId provided');
        setError("Invalid survey link");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('📊 Submit: Fetching survey with ID:', linkId);
        
        const startTime = Date.now();
        
        // Use RPC call to get public survey data
        const { data, error } = await supabase
          .rpc('get_public_survey', { link_id: linkId })
          .then(res => {
            if (Array.isArray(res.data)) {
              return { data: res.data[0], error: res.error };
            }
            return res;
          });

        const queryTime = Date.now() - startTime;
        console.log(`📊 Submit: Survey RPC query completed in ${queryTime}ms:`, { data, error, linkId });

        if (error) {
          console.error('❌ Submit: Database error:', error);
          console.error('❌ Submit: Error details:', {
            message: error.message,
            code: error.code,
            hint: error.hint,
            details: error.details
          });
          throw error;
        }

        if (!data) {
          console.log('❌ Submit: Survey not found or not accessible');
          setError("Survey not found or not accessible");
          setSurvey(null);
        } else {
          console.log('✅ Submit: Survey loaded successfully:', data);
          setSurvey(data);
          setError(null);
        }

      } catch (error: any) {
        console.error('❌ Submit: Error fetching survey:', error);
        console.error('❌ Submit: Full error object:', {
          name: error.name,
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details,
          stack: error.stack
        });
        setError(error.message || "Failed to load survey");
        setSurvey(null);
      } finally {
        console.log('📊 Submit: Setting loading to false');
        setLoading(false);
      }
    };

    // Add timeout fallback
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.error('⏰ Submit: Query timeout after 10 seconds');
        setError("Request timed out. Please try again.");
        setLoading(false);
      }
    }, 10000);

    fetchSurvey().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [linkId]);

  const handleSubmitSuccess = () => {
    console.log('✅ Submit: Testimonial submitted successfully');
    setSubmitted(true);
  };

  console.log('📊 Submit: Current state:', { 
    loading, 
    survey: !!survey, 
    submitted, 
    error,
    linkId 
  });

  if (loading) {
    console.log('⏳ Submit: Showing loading spinner');
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner message="Loading survey..." />
        </div>
      </div>
    );
  }

  if (error || !survey) {
    console.log('⚠️ Submit: Showing survey not found');
    return <SurveyNotFound />;
  }

  if (submitted) {
    console.log('🎉 Submit: Showing success message');
    return <TestimonialSuccess />;
  }

  console.log('✅ Submit: Rendering testimonial form');

  return (
    <div className="min-h-screen bg-black">
      <TestimonialFormContainer 
        survey={survey}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </div>
  );
};

export default Submit;
