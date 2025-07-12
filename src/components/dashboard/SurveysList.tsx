
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Copy, ExternalLink, Plus } from "lucide-react";
import { CreateSurveyDialog } from "./CreateSurveyDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { type SurveyFormData } from "@/lib/validation";

interface Survey {
  id: string;
  title: string;
  question: string;
  created_at: string;
  testimonial_count?: number;
}

interface SurveysListProps {
  surveys: Survey[];
  isCreateDialogOpen: boolean;
  onCreateDialogChange: (open: boolean) => void;
  formData: SurveyFormData;
  errors: Partial<SurveyFormData>;
  rateLimited: boolean;
  onCreateSurvey: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCopyLink: (url: string) => void;
  onShareLink: (url: string, title: string) => void;
  generateSurveyUrl: (surveyId: string) => string;
}

export const SurveysList = ({
  surveys,
  isCreateDialogOpen,
  onCreateDialogChange,
  formData,
  errors,
  rateLimited,
  onCreateSurvey,
  onChange,
  onCopyLink,
  onShareLink,
  generateSurveyUrl
}: SurveysListProps) => {
  if (surveys.length === 0) {
    return (
      <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center">
        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-black mb-2">No surveys yet</h3>
        <p className="text-gray-600 mb-6">Create your first testimonial survey to get started.</p>
        <CreateSurveyDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={onCreateDialogChange}
          formData={formData}
          errors={errors}
          rateLimited={rateLimited}
          onSubmit={onCreateSurvey}
          onChange={onChange}
        />
      </Card>
    );
  }

  return (
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
                  onClick={() => onCopyLink(generateSurveyUrl(survey.id))}
                  className="rounded-lg"
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShareLink(generateSurveyUrl(survey.id), survey.title)}
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
  );
};
