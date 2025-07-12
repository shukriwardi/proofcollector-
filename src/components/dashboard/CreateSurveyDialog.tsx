
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus, AlertTriangle } from "lucide-react";
import { surveySchema, type SurveyFormData } from "@/lib/validation";

interface CreateSurveyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: SurveyFormData;
  errors: Partial<SurveyFormData>;
  rateLimited: boolean;
  onSubmit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const CreateSurveyDialog = ({
  isOpen,
  onOpenChange,
  formData,
  errors,
  rateLimited,
  onSubmit,
  onChange
}: CreateSurveyDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onChange={onChange}
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
              onChange={onChange}
              placeholder="e.g., What did you love about our service?"
              className={`mt-2 ${errors.question ? 'border-red-500' : ''}`}
              rows={3}
              maxLength={500}
            />
            {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={onSubmit} 
              className="bg-black text-white hover:bg-gray-800"
              disabled={rateLimited}
            >
              Create Survey
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
