import { useState, useEffect, useCallback } from "react";
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
  const surveyId = linkId || id;
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Dynamic SEO
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
        : 'Easily submit your testimonial using the secure ProofCollector form.',
    image: 'https://proofcollector.shacnisaas.com/og-submit.png',
    url: surveyId ? `https://proofcollector.shacnisaas.com/link/${surveyId}` : undefined,
    type: 'website'
  });

  const fetchSurvey = useCallback(async () => {
    if (!surveyId) {
      console.log('❌ No survey ID provided');
      setError('Invalid survey link');
      setLoading(false);
      return;
    }

    console.log('🔄 Fetching survey with ID:', surveyId);
    
    try {
      setLoading(true);
      setError(null);

      // Simple direct query without complex timeout handling
      const { data, error: fetchError } = await supabase
        .from('surveys')
        .select('id, title, question, user_id, created_at')
        .eq('id', surveyId)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Supabase error:', fetchError);
        throw new Error('Failed to load survey');
      }

      if (!data) {
        console.log('📭 No survey found with ID:', surveyId);
        setError('Survey not found');
        setSurvey(null);
        return;
      }

      console.log('✅ Survey loaded successfully:', data);
      setSurvey(data);
      setError(null);
    } catch (err: any) {
      console.error('💥 Error fetching survey:', err);
      setError('Unable to load survey - please check the link and try again');
      setSurvey(null);
    } finally {
      setLoading(false);
    }
  }, [surveyId]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

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
      console.error('❌ No survey available for submission');
      toast({
        title: "Error",
        description: "Survey not available. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    // Check rate limiting
    const clientIP = 'user';
    const rateCheck = checkRateLimit(`testimonial_${clientIP}`, 3, 15 * 60 * 1000);
    
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
      const sanitizedData = {
        survey_id: survey.id,
        name: sanitizeText(formData.name),
        email: formData.email ? sanitizeText(formData.email) : null,
        testimonial: sanitizeText(formData.testimonial)
      };

      console.log('📤 Submitting testimonial data:', sanitizedData);

      const { data, error } = await supabase
        .from('testimonials')
        .insert([sanitizedData])
        .select();

      if (error) {
        console.error('❌ Error inserting testimonial:', error);
        throw error;
      }

      console.log('✅ Testimonial submitted successfully:', data);

      setIsSubmitted(true);
      setFormData({ name: "", email: "", testimonial: "" });
      
      toast({
        title: "Thank you!",
        description: "Your testimonial has been submitted successfully.",
      });
      
    } catch (error) {
      console.error('💥 Error submitting testimonial:', error);
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
    
    if (errors[name as keyof TestimonialFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner message="Loading survey..." />
          <p className="text-gray-500 text-sm mt-4">
            Taking too long? <button 
              onClick={fetchSurvey} 
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (error || !survey) {
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
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-3">{survey.question}</h2>
              <p className="text-gray-400">Share your honest experience and help others make informed decisions.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter your full name"
                  required
                  disabled={submitting}
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 focus:outline-none"
                  placeholder="your.email@example.com"
                  disabled={submitting}
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="testimonial" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Testimonial *
                </label>
                <textarea
                  id="testimonial"
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 focus:outline-none resize-none"
                  placeholder="Share your experience, what you liked, and how it helped you..."
                  required
                  disabled={submitting}
                />
                {errors.testimonial && <p className="mt-1 text-sm text-red-400">{errors.testimonial}</p>}
              </div>

              {rateLimited && (
                <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    Please wait {cooldownTime} seconds before submitting another testimonial.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || rateLimited}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {submitting ? "Submitting..." : "Submit Testimonial"}
              </button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Submit;
