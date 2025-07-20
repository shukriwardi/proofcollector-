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
  is_public?: boolean;
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

  console.log('🔄 Dashboard: Component rendered (Stripe disabled) with user:', user?.id);

  const totalTestimonials = useMemo(() => 
    surveys.reduce((sum, survey) => sum + (survey.testimonial_count || 0), 0), 
    [surveys]
  );

  const fetchSurveys = useCallback(async () => {
    if (!user?.id) {
      console.log('❌ Dashboard: No user ID, skipping fetch');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('📊 Dashboard: Starting fetchSurveys (Stripe disabled) for user:', user.id);
      
      const startTime = Date.now();
      
      const { data, error } = await supabase
        .from('surveys')
        .select('id, title, question, created_at, is_public')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const queryTime = Date.now() - startTime;
      console.log(`📊 Dashboard: Surveys query completed in ${queryTime}ms:`, { data, error });

      if (error) {
        console.error('❌ Dashboard: Error fetching surveys:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('📊 Dashboard: Found surveys, fetching testimonial counts...');
        const surveyIds = data.map(s => s.id);
        
        const testimonialsStartTime = Date.now();
        const { data: testimonialCounts, error: countError } = await supabase
          .from('testimonials')
          .select('survey_id')
          .in('survey_id', surveyIds);

        const testimonialsQueryTime = Date.now() - testimonialsStartTime;
        console.log(`📊 Dashboard: Testimonial counts query completed in ${testimonialsQueryTime}ms:`, { testimonialCounts, countError });

        const countMap = testimonialCounts?.reduce((acc, t) => {
          acc[t.survey_id] = (acc[t.survey_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const surveysWithCounts = data.map(survey => ({
          ...survey,
          testimonial_count: countMap[survey.id] || 0
        }));

        console.log('✅ Dashboard: Final surveys data:', surveysWithCounts);
        setSurveys(surveysWithCounts);
      } else {
        console.log('📊 Dashboard: No surveys found, setting empty array');
        setSurveys(data || []);
      }
      
      console.log('✅ Dashboard: Loading completed successfully');
    } catch (error: any) {
      console.error('❌ Dashboard: Error in fetchSurveys:', error);
      toast({
        title: "Error loading surveys",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      });
      setSurveys([]);
    } finally {
      const totalTime = Date.now();
      console.log(`📊 Dashboard: Setting loading to false - total time: ${totalTime}ms`);
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    console.log('🔄 Dashboard: useEffect triggered (Stripe disabled) with user.id:', user?.id);
    if (user?.id) {
      fetchSurveys();
    } else {
      console.log('📊 Dashboard: No user, setting loading to false');
      setLoading(false);
    }
  }, [user?.id, fetchSurveys]);

  const validateForm = useCallback((): boolean => {
    console.log('🔍 Dashboard: Validating form data:', formData);
    try {
      surveySchema.parse(formData);
      setErrors({});
      console.log('✅ Dashboard: Form validation passed');
      return true;
    } catch (error: any) {
      console.log('❌ Dashboard: Form validation failed:', error);
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
    console.log('🔄 Dashboard: handleCreateSurvey called (no usage limits)');
    if (creatingSurvey || !user?.id) {
      console.log('❌ Dashboard: Already creating or no user, aborting');
      return;
    }

    if (!validateForm()) {
      console.log('❌ Dashboard: Form validation failed');
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingSurvey(true);
      console.log('🔄 Dashboard: Creating survey with data:', formData);

      const sanitizedData = {
        title: sanitizeText(formData.title),
        question: sanitizeText(formData.question),
        user_id: user.id
      };

      console.log('🔄 Dashboard: Sanitized survey data:', sanitizedData);

      const { data, error } = await supabase
        .from('surveys')
        .insert([sanitizedData])
        .select()
        .single();

      console.log('📊 Dashboard: Survey creation response:', { data, error });

      if (error) throw error;

      console.log('✅ Dashboard: Survey created successfully:', data);

      const newSurvey = { ...data, testimonial_count: 0 };
      setSurveys(prevSurveys => {
        console.log('📊 Dashboard: Adding new survey to list');
        return [newSurvey, ...prevSurveys];
      });
      
      setFormData({ title: "", question: "" });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Survey Created",
        description: "Your testimonial survey has been created successfully.",
      });

    } catch (error) {
      console.error('❌ Dashboard: Error creating survey:', error);
      toast({
        title: "Error",
        description: getGenericErrorMessage('database'),
        variant: "destructive",
      });
    } finally {
      console.log('📊 Dashboard: Setting creatingSurvey to false');
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

  const toggleSurveyPublic = useCallback(async (surveyId: string, currentPublicState: boolean) => {
    try {
      const { error } = await supabase
        .from('surveys')
        .update({ is_public: !currentPublicState })
        .eq('id', surveyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setSurveys(prev => prev.map(survey => 
        survey.id === surveyId 
          ? { ...survey, is_public: !currentPublicState }
          : survey
      ));

      toast({
        title: !currentPublicState ? "Survey Made Public" : "Survey Made Private",
        description: !currentPublicState 
          ? "Anyone with the link can now access this survey"
          : "Only you can access this survey now",
      });
    } catch (error) {
      console.error('Error toggling survey public state:', error);
      toast({
        title: "Error",
        description: "Failed to update survey visibility",
        variant: "destructive",
      });
    }
  }, [user?.id, toast]);

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

  console.log('📊 Dashboard: Current state (Stripe disabled):', { loading, surveys: surveys.length, user: !!user });

  if (loading) {
    console.log('⏳ Dashboard: Showing loading spinner');
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner message="Loading your surveys..." />
        </div>
      </div>
    );
  }

  console.log('✅ Dashboard: Rendering main dashboard content (Stripe disabled)');

  return (
    <div className="min-h-screen bg-black">
      <div className="space-y-8 p-6 lg:p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your testimonial surveys (Testing Mode - No Limits)</p>
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

        <DashboardStats 
          totalSurveys={surveys.length}
          totalTestimonials={totalTestimonials}
          activeSurveys={surveys.length}
        />

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
            onTogglePublic={toggleSurveyPublic}
            generateSurveyUrl={generateSurveyUrl}
            loading={creatingSurvey}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
