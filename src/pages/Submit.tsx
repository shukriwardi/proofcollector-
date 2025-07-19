
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
  const [error, setError] = useState<string | null>(null);
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
    const fetchSurveyWithTimeout = async () => {
      if (!surveyId) {
        console.log('❌ No survey ID provided');
        setError('No survey ID provided');
        setNotFound(true);
        setLoading(false);
        return;
      }

      console.log('🔄 Starting survey fetch for ID:', surveyId);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('⏰ Survey fetch timeout after 10 seconds');
        setError('Request timeout - please try again');
        setLoading(false);
      }, 10000);

      try {
        const { data, error } = await supabase
          .from('surveys')
          .select('id, title, question, user_id, created_at')
          .eq('id', surveyId)
          .maybeSingle();

        clearTimeout(timeoutId);

        console.log('📋 Survey fetch result:', { data, error });

        if (error) {
          console.error('❌ Supabase error:', error);
          setError('Failed to load survey');
          setNotFound(true);
          return;
        }

        if (!data) {
          console.log('📭 No survey found with ID:', surveyId);
          setError('Survey not found');
          setNotFound(true);
          return;
        }

        console.log('✅ Survey loaded successfully:', data);
        setSurvey(data);
        setError(null);
        setNotFound(false);
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('💥 Unexpected error fetching survey:', err);
        setError('Unexpected error occurred');
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    // Reset state when surveyId changes
    setLoading(true);
    setError(null);
    setNotFound(false);
    setSurvey(null);
    
    fetchSurveyWithTimeout();
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

    console.log('🔄 Starting testimonial submission for survey:', survey.id);

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

    // Set timeout for submission
    const timeoutId = setTimeout(() => {
      console.log('⏰ Testimonial submission timeout');
      setSubmitting(false);
      toast({
        title: "Submission Timeout",
        description: "The submission is taking too long. Please try again.",
        variant: "destructive",
      });
    }, 15000);

    try {
      // Sanitize form data
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

      clearTimeout(timeoutId);

      if (error) {
        console.error('❌ Error inserting testimonial:', error);
        throw error;
      }

      console.log('✅ Testimonial submitted successfully:', data);

      setIsSubmitted(true);
      
      // Clear form data for security
      setFormData({ name: "", email: "", testimonial: "" });
      
      toast({
        title: "Thank you!",
        description: "Your testimonial has been submitted successfully.",
      });
      
    } catch (error) {
      clearTimeout(timeoutId);
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
    
    // Clear error when user starts typing
    if (errors[name as keyof TestimonialFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Loading state with timeout protection
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner message="Loading survey..." />
          <p className="text-gray-500 text-sm mt-4">
            Taking too long? <button 
              onClick={() => window.location.reload()} 
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Refresh page
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Error states
  if (error || notFound || !survey) {
    return <SurveyNotFound />;
  }

  // Success state
  if (isSubmitted) {
    return <TestimonialSuccess surveyTitle={survey?.title} />;
  }

  // Main form
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
