
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { surveySchema, type SurveyFormData } from "@/lib/validation";
import { sanitizeText, checkRateLimit, getGenericErrorMessage } from "@/lib/security";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CreateSurveyDialog } from "@/components/dashboard/CreateSurveyDialog";
import { SurveysList } from "@/components/dashboard/SurveysList";
import { LoadingSpinner } from "@/components/testimonials/LoadingSpinner";

interface Survey {
  id: string;
  title: string;
  question: string;
  created_at: string;
  testimonial_count?: number;
}

const Dashboard = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [formData, setFormData] = useState<SurveyFormData>({
    title: "",
    question: ""
  });
  const [errors, setErrors] = useState<Partial<SurveyFormData>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSurveys();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSurveys = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('📊 Fetching surveys for user:', user?.id);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Survey fetch timeout')), 15000);
      });

      const surveysPromise = supabase
        .from('surveys')
        .select(`
          id,
          title,
          question,
          created_at,
          testimonials(count)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      const { data, error } = await Promise.race([
        surveysPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('❌ Error fetching surveys:', error);
        throw error;
      }

      const surveysWithCounts = data?.map((survey: any) => ({
        ...survey,
        testimonial_count: survey.testimonials?.[0]?.count || 0
      })) || [];

      console.log('✅ Surveys fetched:', surveysWithCounts.length);
      setSurveys(surveysWithCounts);
    } catch (error) {
      console.error('❌ Error fetching surveys:', error);
      
      // Show helpful error message
      const isTimeout = error instanceof Error && error.message.includes('timeout');
      toast({
        title: isTimeout ? "Loading timeout" : "Error",
        description: isTimeout 
          ? "Surveys are taking longer to load. Please refresh the page." 
          : getGenericErrorMessage('database'),
        variant: "destructive",
      });
      
      // Don't leave user stuck - show empty state
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    try {
      surveySchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<SurveyFormData> = {};
      error.errors?.forEach((err: any) => {
        const field = err.path[0] as keyof SurveyFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleCreateSurvey = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    // Rate limiting for survey creation
    const rateCheck = checkRateLimit(`survey_creation_${user?.id}`, 10, 60 * 60 * 1000); // 10 surveys per hour
    
    if (!rateCheck.allowed) {
      setRateLimited(true);
      toast({
        title: "Rate Limit Exceeded",
        description: "You can create a maximum of 10 surveys per hour.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Sanitize form data
      const sanitizedData = {
        title: sanitizeText(formData.title),
        question: sanitizeText(formData.question),
        user_id: user?.id
      };

      const { data, error } = await supabase
        .from('surveys')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) throw error;

      setSurveys([{ ...data, testimonial_count: 0 }, ...surveys]);
      setFormData({ title: "", question: "" });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Survey Created",
        description: "Your testimonial survey has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating survey:', error);
      toast({
        title: "Error",
        description: getGenericErrorMessage('database'),
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof SurveyFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const generateSurveyUrl = (surveyId: string) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${currentOrigin}/submit/${surveyId}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The survey link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: getGenericErrorMessage('form'),
        variant: "destructive",
      });
    });
  };

  const shareLink = (url: string, surveyTitle: string) => {
    if (navigator.share) {
      navigator.share({
        title: `${surveyTitle} - Testimonial Survey`,
        text: `Please share your testimonial using this link:`,
        url: url,
      }).catch(() => {
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };

  const totalTestimonials = surveys.reduce((sum, survey) => sum + (survey.testimonial_count || 0), 0);

  // Don't show loading spinner forever
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner message="Loading your surveys..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Dark themed app layout with purple accents */}
      <div className="space-y-8 p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your testimonial surveys</p>
          </div>
          
          <CreateSurveyDialog
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            formData={formData}
            errors={errors}
            rateLimited={rateLimited}
            onSubmit={handleCreateSurvey}
            onChange={handleChange}
          />
        </div>

        {/* Stats Overview with dark theme */}
        <DashboardStats 
          totalSurveys={surveys.length}
          totalTestimonials={totalTestimonials}
          activeSurveys={surveys.length}
        />

        {/* Surveys */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Your Surveys</h2>
          
          <SurveysList
            surveys={surveys}
            isCreateDialogOpen={isCreateDialogOpen}
            onCreateDialogChange={setIsCreateDialogOpen}
            formData={formData}
            errors={errors}
            rateLimited={rateLimited}
            onCreateSurvey={handleCreateSurvey}
            onChange={handleChange}
            onCopyLink={copyToClipboard}
            onShareLink={shareLink}
            generateSurveyUrl={generateSurveyUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
