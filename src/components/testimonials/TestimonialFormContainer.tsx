
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TestimonialForm } from "./TestimonialForm";
import { toast } from "sonner";

interface Survey {
  id: string;
  title: string;
  question: string;
}

interface TestimonialFormContainerProps {
  survey: Survey;
  onSubmitSuccess: () => void;
}

interface FormData {
  name: string;
  email: string;
  testimonial: string;
}

const validateForm = (data: FormData) => {
  console.log('🔍 TestimonialFormContainer: Validating form data:', data);
  
  const errors: Partial<FormData> = {};

  if (!data.name?.trim()) {
    errors.name = "Name is required";
  }

  if (!data.testimonial?.trim()) {
    errors.testimonial = "Testimonial is required";
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  const hasErrors = Object.keys(errors).length > 0;
  console.log('🔍 TestimonialFormContainer: Validation result:', { hasErrors, errors });

  if (hasErrors) {
    return { success: false, errors };
  }

  return { success: true, data };
};

export const TestimonialFormContainer = ({ survey, onSubmitSuccess }: TestimonialFormContainerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('🔄 TestimonialFormContainer: Component rendered with survey:', survey.id);

  const handleSubmit = async (formData: FormData) => {
    console.log('📝 TestimonialFormContainer: handleSubmit called with data:', formData);
    
    const validation = validateForm(formData);
    
    if (!validation.success) {
      console.log('❌ TestimonialFormContainer: Validation failed:', validation.errors);
      toast.error("Please fix the form errors");
      return;
    }

    console.log('✅ TestimonialFormContainer: Validation passed, submitting testimonial');

    setIsSubmitting(true);

    try {
      const startTime = Date.now();
      console.log('📊 TestimonialFormContainer: Starting database insert');

      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          survey_id: survey.id,
          name: validation.data.name,
          email: validation.data.email || null,
          testimonial: validation.data.testimonial,
        })
        .select()
        .single();

      const queryTime = Date.now() - startTime;
      console.log(`📊 TestimonialFormContainer: Insert completed in ${queryTime}ms:`, { data, error });

      if (error) {
        console.error('❌ TestimonialFormContainer: Database error:', error);
        console.error('❌ TestimonialFormContainer: Error details:', {
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details
        });
        throw error;
      }

      console.log('✅ TestimonialFormContainer: Testimonial saved successfully:', data);
      toast.success("Thank you for your testimonial!");
      onSubmitSuccess();

    } catch (error: any) {
      console.error('❌ TestimonialFormContainer: Error submitting testimonial:', error);
      console.error('❌ TestimonialFormContainer: Full error object:', {
        name: error.name,
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details,
        stack: error.stack
      });
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      console.log('📊 TestimonialFormContainer: Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  return (
    <TestimonialForm
      survey={survey}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
