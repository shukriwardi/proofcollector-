
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

export const TestimonialFormContainer = ({
  survey,
  onSubmitSuccess,
}: TestimonialFormContainerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    email: "",
    testimonial: "",
  });
  const [errors, setErrors] = useState<Partial<TestimonialFormData>>({});
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof TestimonialFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateTestimonial(formData);

    if (!validation.success) {
      // TS2339 FIX: Check type guard before accessing `.errors`
      const errorFields =
        "errors" in validation ? validation.errors : undefined;

      setErrors(errorFields || {});
      toast.error("Please fix the form errors");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("testimonials")
        .insert({
          survey_id: survey.id,
          name: validation.data.name,
          email: validation.data.email || null,
          testimonial: validation.data.testimonial,
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      toast.success("Thank you for your testimonial!");
      setFormData({ name: "", email: "", testimonial: "" });
      onSubmitSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
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
