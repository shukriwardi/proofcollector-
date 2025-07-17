
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { testimonialSchema, type TestimonialFormData } from "@/lib/validation";
import { sanitizeText, checkRateLimit, getGenericErrorMessage } from "@/lib/security";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import { TestimonialHeader } from "@/components/testimonials/TestimonialHeader";
import { TestimonialSuccess } from "@/components/testimonials/TestimonialSuccess";
import { SurveyNotFound } from "@/components/testimonials/SurveyNotFound";
import { LoadingSpinner } from "@/components/testimonials/LoadingSpinner";
import { useSEO } from "@/hooks/useSEO";

interface Survey {
  id: string;
  title: string;
  question: string;
  user_id: string;
  created_at: string;
}

const Submit = () => {
  const { linkId, id } = useParams();
  // Use either linkId (from /submit/:linkId) or id (from /link/:id)
  const surveyId = linkId || id;
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    email: "",
    testimonial: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<TestimonialFormData>>({});
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const { toast } = useToast();

  // Dynamic SEO based on survey data and submission state
  useSEO({
    title: isSubmitted 
      ? 'Thank You! | Testimonial Submitted — ProofCollector'
      : survey 
        ? `Submit Testimonial: ${survey.title} | ProofCollector`
        : 'Submit a Testimonial | ProofCollector',
    description: isSubmitted
      ? 'Thank you for submitting your testimonial! Your feedback helps build trust and credibility.'
      : survey
        ? `Share your experience about ${survey.title}. Your testimonial will help others make informed decisions.`
        : 'Easily submit your testimonial using the secure ProofCollector form. Help build trust and credibility.',
    image: 'https://proofcollector.shacnisaas.com/og-submit.png',
    url: surveyId ? `https://proofcollector.shacnisaas.com/link/${surveyId}` : undefined,
    type: 'website'
  });

  useEffect(() => {
    if (surveyId) {
      fetchSurvey();
    } else {
      setLoading(false);
      setNotFound(true);
    }
  }, [surveyId]);

  // Cooldown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            setRateLimited(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  const fetchSurvey = async () => {
    try {
      console.log('Fetching survey with ID:', surveyId);
      
      // Fetch the survey directly without authentication requirements
      const { data, error } = await supabase
        .from('surveys')
        .select('id, title, question, user_id, created_at')
        .eq('id', surveyId)
        .maybeSingle();

      console.log('Survey fetch result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        setNotFound(true);
        return;
      }

      if (!data) {
        console.log('No survey found with ID:', surveyId);
        setNotFound(true);
        return;
      }

      console.log('Survey data fetched successfully:', data);
      setSurvey(data);
    } catch (error) {
      console.error('Error fetching survey:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    try {
      testimonialSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<TestimonialFormData> = {};
      error.errors?.forEach((err: any) => {
        const field = err.path[0] as keyof TestimonialFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!survey) {
      console.error('No survey available for submission');
      return;
    }

    console.log('Starting testimonial submission for survey:', survey.id);

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    // Check rate limiting
    const clientIP = 'user'; // In production, get actual IP
    const rateCheck = checkRateLimit(`testimonial_${clientIP}`, 3, 15 * 60 * 1000); // 3 submissions per 15 minutes
    
    if (!rateCheck.allowed) {
      setRateLimited(true);
      setCooldownTime(Math.ceil((rateCheck.resetTime - Date.now()) / 1000));
      toast({
        title: "Too Many Submissions",
        description: "Please wait before submitting another testimonial.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);

    try {
      // Sanitize form data
      const sanitizedData = {
        survey_id: survey.id,
        name: sanitizeText(formData.name),
        email: formData.email ? sanitizeText(formData.email) : null,
        testimonial: sanitizeText(formData.testimonial)
      };

      console.log('Submitting testimonial data:', sanitizedData);

      const { data, error } = await supabase
        .from('testimonials')
        .insert([sanitizedData])
        .select();

      if (error) {
        console.error('Error inserting testimonial:', error);
        throw error;
      }

      console.log('Testimonial submitted successfully:', data);

      setIsSubmitted(true);
      
      // Clear form data for security
      setFormData({ name: "", email: "", testimonial: "" });
      
      toast({
        title: "Thank you!",
        description: "Your testimonial has been submitted successfully.",
      });
      
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Submission Failed",
        description: getGenericErrorMessage('database'),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof TestimonialFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner message="Loading survey..." />
      </div>
    );
  }

  if (notFound || !survey) {
    return <SurveyNotFound />;
  }

  if (isSubmitted) {
    return <TestimonialSuccess surveyTitle={survey?.title} />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <TestimonialHeader title={survey?.title} />
        
        <Card className="p-8 bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
          <TestimonialForm
            formData={formData}
            errors={errors}
            rateLimited={rateLimited}
            cooldownTime={cooldownTime}
            submitting={submitting}
            surveyQuestion={survey?.question}
            onSubmit={handleSubmit}
            onChange={handleChange}
          />
        </Card>
      </div>
    </div>
  );
};

export default Submit;
