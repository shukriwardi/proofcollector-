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

interface Survey {
  id: string;
  title: string;
  question: string;
}

const Submit = () => {
  const { linkId, id } = useParams();
  // Use either linkId (from /submit/:linkId) or id (from /link/:id)
  const surveyId = linkId || id;
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (surveyId) {
      fetchSurvey();
    } else {
      setLoading(false);
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
      const { data, error } = await supabase
        .from('surveys')
        .select('id, title, question')
        .eq('id', surveyId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Survey data fetched:', data);
      setSurvey(data);
    } catch (error) {
      console.error('Error fetching survey:', error);
      toast({
        title: "Survey Not Found",
        description: getGenericErrorMessage('database'),
        variant: "destructive",
      });
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
    
    if (!survey) return;

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

      const { error } = await supabase
        .from('testimonials')
        .insert([sanitizedData]);

      if (error) throw error;

      setIsSubmitted(true);
      
      // Clear form data for security
      setFormData({ name: "", email: "", testimonial: "" });
      
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
    return <LoadingSpinner message="Loading survey..." />;
  }

  if (!survey && surveyId) {
    return <SurveyNotFound />;
  }

  if (isSubmitted) {
    return <TestimonialSuccess />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <TestimonialHeader title={survey?.title} />
        
        <Card className="p-8 bg-white border-0 shadow-sm rounded-xl">
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
