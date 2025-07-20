
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TestimonialForm } from "./TestimonialForm";
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
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    email: "",
    testimonial: ""
  });
  const [errors, setErrors] = useState<Partial<TestimonialFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  console.log('🔄 TestimonialFormContainer: Component rendered with survey:', survey.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('📝 TestimonialFormContainer: Form field changed:', name, value.length);
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof TestimonialFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting || rateLimited) {
      console.log('⚠️ TestimonialFormContainer: Submit blocked - submitting:', submitting, 'rateLimited:', rateLimited);
      return;
    }

    console.log('🚀 TestimonialFormContainer: Starting submission process');
    
    try {
      setSubmitting(true);
      setErrors({});

      console.log('🔍 TestimonialFormContainer: Validating form data:', formData);
      const validation = validateTestimonial(formData);
      
      if (!validation.success) {
        console.log('❌ TestimonialFormContainer: Validation failed:', validation.errors);
        setErrors(validation.errors);
        return;
      }

      console.log('✅ TestimonialFormContainer: Validation passed, submitting to survey:', survey.id);
      
      const startTime = Date.now();
      const { error } = await supabase
        .from('testimonials')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          testimonial: formData.testimonial.trim(),
          survey_id: survey.id
        });

      const queryTime = Date.now() - startTime;
      console.log(`📊 TestimonialFormContainer: Insert query completed in ${queryTime}ms:`, { error });

      if (error) {
        console.error('❌ TestimonialFormContainer: Database error:', error);
        throw error;
      }

      console.log('✅ TestimonialFormContainer: Testimonial submitted successfully');
      onSubmitSuccess();

    } catch (error: any) {
      console.error('❌ TestimonialFormContainer: Submission error:', error);
      setErrors({ testimonial: error.message || "Failed to submit testimonial" });
    } finally {
      console.log('📊 TestimonialFormContainer: Setting submitting to false');
      setSubmitting(false);
    }
  };

  return (
    <TestimonialForm
      formData={formData}
      errors={errors}
      rateLimited={rateLimited}
      cooldownTime={cooldownTime}
      submitting={submitting}
      surveyQuestion={survey.question}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
};
