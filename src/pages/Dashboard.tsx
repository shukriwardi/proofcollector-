
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
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
    }
  }, [user]);

  const fetchSurveys = async () => {
    try {
      const { data: surveysData, error } = await supabase
        .from('surveys')
        .select(`
          *,
          testimonials(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const surveysWithCounts = surveysData?.map(survey => ({
        ...survey,
        testimonial_count: survey.testimonials?.[0]?.count || 0
      })) || [];

      setSurveys(surveysWithCounts);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast({
        title: "Error",
        description: getGenericErrorMessage('database'),
        variant: "destructive",
      });
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

  if (loading) {
    return (
      <AppLayout>
        <LoadingSpinner message="Loading your surveys..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your testimonial surveys</p>
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

        {/* Stats Overview */}
        <DashboardStats 
          totalSurveys={surveys.length}
          totalTestimonials={totalTestimonials}
          activeSurveys={surveys.length}
        />

        {/* Surveys */}
        <div>
          <h2 className="text-xl font-semibold text-black mb-6">Your Surveys</h2>
          
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
    </AppLayout>
  );
};

export default Dashboard;
