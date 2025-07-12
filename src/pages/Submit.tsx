
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MessageCircle, Star, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { testimonialSchema, type TestimonialFormData } from "@/lib/validation";
import { sanitizeText, checkRateLimit, getGenericErrorMessage } from "@/lib/security";

interface Survey {
  id: string;
  title: string;
  question: string;
}

const Submit = () => {
  const { linkId } = useParams();
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
    if (linkId) {
      fetchSurvey();
    } else {
      setLoading(false);
    }
  }, [linkId]);

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
      const { data, error } = await supabase
        .from('surveys')
        .select('id, title, question')
        .eq('id', linkId)
        .single();

      if (error) throw error;

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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!survey && linkId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center max-w-md w-full">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">Survey Not Found</h1>
          <p className="text-gray-600">
            The survey you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">Thank you!</h1>
          <p className="text-gray-600 mb-6">
            Your testimonial has been submitted successfully. We really appreciate you taking the time to share your experience.
          </p>
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Your feedback helps us improve and helps others make informed decisions.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <MessageCircle className="h-12 w-12 text-black mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-black mb-2">
            {survey?.title || "Share Your Experience"}
          </h1>
          <p className="text-gray-600">
            We'd love to hear about your experience. Your testimonial helps others learn about our services.
          </p>
        </div>

        <Card className="p-8 bg-white border-0 shadow-sm rounded-xl">
          {rateLimited && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">Rate limit reached</p>
                <p className="text-yellow-700 text-sm">
                  Please wait {Math.floor(cooldownTime / 60)}m {cooldownTime % 60}s before submitting again.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-black font-medium">Your Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                  maxLength={100}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-black font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email (optional)"
                  maxLength={254}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                <p className="text-xs text-gray-500 mt-1">Optional - only used for follow-up if needed</p>
              </div>
            </div>

            <div>
              <Label htmlFor="testimonial" className="text-black font-medium">
                {survey?.question || "Your Testimonial"} *
              </Label>
              <Textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                rows={6}
                className={`mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black resize-none ${errors.testimonial ? 'border-red-500' : ''}`}
                placeholder="Tell us about your experience... What did you like? How did we help you? What would you tell others?"
                maxLength={1000}
                required
              />
              {errors.testimonial && <p className="text-red-500 text-sm mt-1">{errors.testimonial}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {formData.testimonial.length}/1000 characters
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Tips for a great testimonial:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Be specific about what you liked or found helpful</li>
                <li>• Mention the results or benefits you experienced</li>
                <li>• Share what you'd tell others considering our services</li>
                <li>• Be authentic and honest about your experience</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              disabled={submitting || rateLimited}
              className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3 text-lg disabled:opacity-50"
            >
              {submitting ? "Submitting..." : rateLimited ? `Wait ${Math.floor(cooldownTime / 60)}m ${cooldownTime % 60}s` : "Submit Testimonial"}
            </Button>

            <p className="text-center text-xs text-gray-500">
              By submitting this testimonial, you give us permission to use it for marketing purposes. 
              We respect your privacy and will only use the information you provide here.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Submit;
