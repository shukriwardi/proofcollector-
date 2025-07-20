
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TestimonialForm } from "./TestimonialForm";
import { toast } from "sonner";
import { validateTestimonial } from "@/lib/validation";
import type { TestimonialFormData } from "@/lib/validation";

interface Survey {
  id: string;
  title: string;
  question: string;
}

interface TestimonialFormContainerProps {
  survey: Survey;
  onSubmitSuccess: () => void;
}

export const TestimonialFormContainer = ({ survey, onSubmitSuccess }: TestimonialFormContainerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    email: "",
    testimonial: ""
  });
  const [errors, setErrors] = useState<Partial<TestimonialFormData>>({});
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  console.log('🔄 TestimonialFormContainer: Component rendered with survey:', survey.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('📝 TestimonialFormContainer: Form field changed:', { name, value });
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof TestimonialFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 TestimonialFormContainer: handleSubmit called with form data:', formData);
    
    const validation = validateTestimonial(formData);
    
    if (!validation.success) {
      console.log('❌ TestimonialFormContainer: Validation failed:', validation.errors);
      setErrors(validation.errors);
      toast.error("Please fix the form errors");
      return;
    }

    console.log('✅ TestimonialFormContainer: Validation passed, submitting testimonial');
    setErrors({});
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
      
      // Reset form
      setFormData({ name: "", email: "", testimonial: "" });
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
      formData={formData}
      errors={errors}
      rateLimited={rateLimited}
      cooldownTime={cooldownTime}
      submitting={isSubmitting}
      surveyQuestion={survey.question}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
};
