
import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [creatingSurvey, setCreatingSurvey] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Memoize survey stats to prevent recalculation on every render
  const totalTestimonials = useMemo(() => 
    surveys.reduce((sum, survey) => sum + (survey.testimonial_count || 0), 0), 
    [surveys]
  );

  const fetchSurveys = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('📊 Fetching surveys for user:', user.id);
      
      // Simple query without complex timeout handling
      const { data, error } = await supabase
        .from('surveys')
        .select('id, title, question, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching surveys:', error);
        throw error;
      }

      if (data && data.length > 0) {
        const surveyIds = data.map(s => s.id);
        
        // Fetch testimonial counts separately
        const { data: testimonialCounts } = await supabase
          .from('testimonials')
          .select('survey_id')
          .in('survey_id', surveyIds);

        const countMap = testimonialCounts?.reduce((acc, t) => {
          acc[t.survey_id] = (acc[t.survey_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const surveysWithCounts = data.map(survey => ({
          ...survey,
          testimonial_count: countMap[survey.id] || 0
        }));

        console.log('✅ Surveys fetched:', surveysWithCounts.length);
        setSurveys(surveysWithCounts);
      } else {
        setSurveys(data || []);
      }
    } catch (error: any) {
      console.error('❌ Error fetching surveys:', error);
      toast({
        title: "Error loading surveys",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      });
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    if (user?.id) {
      fetchSurveys();
    } else {
      setLoading(false);
    }
  }, [user?.id]); // Only depend on user.id

  const validateForm = useCallback((): boolean => {
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
  }, [formData]);

  const handleCreateSurvey = useCallback(async () => {
    if (creatingSurvey || !user?.id) {
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

    // Rate limiting for survey creation
    const rateCheck = checkRateLimit(`survey_creation_${user.id}`, 10, 60 * 60 * 1000);
    
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
      setCreatingSurvey(true);
      console.log('🔄 Creating survey...');

      const sanitizedData = {
        title: sanitizeText(formData.title),
        question: sanitizeText(formData.question),
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('surveys')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Survey created successfully');

      const newSurvey = { ...data, testimonial_count: 0 };
      setSurveys(prevSurveys => [newSurvey, ...prevSurveys]);
      
      setFormData({ title: "", question: "" });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Survey Created",
        description: "Your testimonial survey has been created successfully.",
      });

    } catch (error) {
      console.error('❌ Error creating survey:', error);
      toast({
        title: "Error",
        description: getGenericErrorMessage('database'),
        variant: "destructive",
      });
    } finally {
      setCreatingSurvey(false);
    }
  }, [creatingSurvey, validateForm, user?.id, formData, toast]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof SurveyFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const generateSurveyUrl = useCallback((surveyId: string) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${currentOrigin}/submit/${surveyId}`;
  }, []);

  const copyToClipboard = useCallback((text: string) => {
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
  }, [toast]);

  const shareLink = useCallback((url: string, surveyTitle: string) => {
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
  }, [copyToClipboard]);

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
            loading={creatingSurvey}
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
            loading={creatingSurvey}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
