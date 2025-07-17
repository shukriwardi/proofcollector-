
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
        <Button className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-6 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20" disabled={rateLimited}>
          <Plus className="h-4 w-4 mr-2" />
          Create Survey
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create Testimonial Survey</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new survey to collect testimonials from your customers.
          </DialogDescription>
        </DialogHeader>
        
        {rateLimited && (
          <div className="p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium">Rate limit reached</p>
              <p className="text-yellow-300 text-sm">You can create a maximum of 10 surveys per hour.</p>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="surveyTitle" className="text-gray-300">Survey Title</Label>
            <Input
              id="surveyTitle"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="e.g., General Feedback, Product Review"
              className={`mt-2 bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 ${errors.title ? 'border-red-500' : ''}`}
              maxLength={200}
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <Label htmlFor="surveyQuestion" className="text-gray-300">Survey Question</Label>
            <Textarea
              id="surveyQuestion"
              name="question"
              value={formData.question}
              onChange={onChange}
              placeholder="e.g., What did you love about our service?"
              className={`mt-2 bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 ${errors.question ? 'border-red-500' : ''}`}
              rows={3}
              maxLength={500}
            />
            {errors.question && <p className="text-red-400 text-sm mt-1">{errors.question}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button 
              onClick={onSubmit} 
              className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20"
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
