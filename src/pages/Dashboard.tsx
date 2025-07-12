
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus, Link2, MessageCircle, Eye, Copy, ExternalLink, AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { surveySchema, type SurveyFormData } from "@/lib/validation";
import { sanitizeText, checkRateLimit, getGenericErrorMessage } from "@/lib/security";

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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your surveys...</p>
          </div>
        </div>
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
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6" disabled={rateLimited}>
                <Plus className="h-4 w-4 mr-2" />
                Create Survey
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Testimonial Survey</DialogTitle>
                <DialogDescription>
                  Create a new survey to collect testimonials from your customers.
                </DialogDescription>
              </DialogHeader>
              
              {rateLimited && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">Rate limit reached</p>
                    <p className="text-yellow-700 text-sm">You can create a maximum of 10 surveys per hour.</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="surveyTitle">Survey Title</Label>
                  <Input
                    id="surveyTitle"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., General Feedback, Product Review"
                    className={`mt-2 ${errors.title ? 'border-red-500' : ''}`}
                    maxLength={200}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <Label htmlFor="surveyQuestion">Survey Question</Label>
                  <Textarea
                    id="surveyQuestion"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    placeholder="e.g., What did you love about our service?"
                    className={`mt-2 ${errors.question ? 'border-red-500' : ''}`}
                    rows={3}
                    maxLength={500}
                  />
                  {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question}</p>}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateSurvey} 
                    className="bg-black text-white hover:bg-gray-800"
                    disabled={rateLimited}
                  >
                    Create Survey
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Surveys</p>
                <p className="text-2xl font-bold text-black">{surveys.length}</p>
              </div>
              <Link2 className="h-8 w-8 text-gray-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Testimonials</p>
                <p className="text-2xl font-bold text-black">{totalTestimonials}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Surveys</p>
                <p className="text-2xl font-bold text-black">{surveys.length}</p>
              </div>
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
          </Card>
        </div>

        {/* Surveys */}
        <div>
          <h2 className="text-xl font-semibold text-black mb-6">Your Surveys</h2>
          
          {surveys.length === 0 ? (
            <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">No surveys yet</h3>
              <p className="text-gray-600 mb-6">Create your first testimonial survey to get started.</p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Survey
                  </Button>
                </DialogTrigger>
              </Dialog>
            </Card>
          ) : (
            <div className="grid gap-4">
              {surveys.map((survey) => (
                <Card key={survey.id} className="p-6 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">{survey.title}</h3>
                      <p className="text-gray-600 mb-3">{survey.question}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Created: {new Date(survey.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{survey.testimonial_count || 0} testimonials</span>
                      </div>
                      <div className="mt-3 flex items-center space-x-2">
                        <Input
                          value={generateSurveyUrl(survey.id)}
                          readOnly
                          className="text-sm bg-gray-50 border-gray-200"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generateSurveyUrl(survey.id))}
                          className="rounded-lg"
                          title="Copy link"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareLink(generateSurveyUrl(survey.id), survey.title)}
                          className="rounded-lg"
                          title="Share link"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
