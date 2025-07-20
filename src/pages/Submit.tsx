
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
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

  console.log('🔄 Submit: Component rendered (Stripe disabled) with linkId:', linkId);

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!linkId) {
        console.log('❌ Submit: No linkId provided');
        setError("Invalid survey link");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('📊 Submit: Fetching survey (Stripe disabled) with ID:', linkId);
        
        const startTime = Date.now();
        
        // Updated query to include is_public column for RLS policy
        const { data, error } = await supabase
          .from('surveys')
          .select('id, title, question, is_public')
          .eq('id', linkId)
          .maybeSingle();

        const queryTime = Date.now() - startTime;
        console.log(`📊 Submit: Survey query completed in ${queryTime}ms:`, { data, error });

        if (error) {
          console.error('❌ Submit: Database error:', error);
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
        setError(error.message || "Failed to load survey");
        setSurvey(null);
      } finally {
        const totalTime = Date.now();
        console.log(`📊 Submit: Setting loading to false - total time: ${totalTime}ms`);
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [linkId]);

  const handleSubmitSuccess = () => {
    console.log('✅ Submit: Testimonial submitted successfully');
    setSubmitted(true);
  };

  console.log('📊 Submit: Current state (Stripe disabled):', { 
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

  console.log('✅ Submit: Rendering testimonial form (Stripe disabled)');

  return (
    <div className="min-h-screen bg-black">
      <TestimonialForm 
        survey={survey}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </div>
  );
};

export default Submit;
