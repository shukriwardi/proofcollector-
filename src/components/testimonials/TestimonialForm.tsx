import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { testimonialSchema } from "@/lib/validation";
import { useSecurity } from "@/hooks/useSecurity";
import { getSecureErrorMessage } from "@/lib/security";
import { supabase } from "@/integrations/supabase/client";

export const TestimonialForm = ({ surveyId }: { surveyId: string }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    testimonial: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { checkRateLimit, validateInput } = useSecurity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    setIsSubmitting(true);
    setValidationErrors([]);
    setSubmitSuccess(false);

    try {
      // Rate limiting check
      const rateLimitCheck = await checkRateLimit(
        `testimonial_${surveyId}`,
        'testimonial',
        3,
        60000
      );

      if (!rateLimitCheck.allowed) {
        setValidationErrors([getSecureErrorMessage('rate-limit')]);
        setIsSubmitting(false);
        return;
      }

      // Client-side validation with security checks
      console.log('Validating form data:', formData);
      const validation = await validateInput(testimonialSchema, formData);
      if (!validation.success) {
        if ('errors' in validation) {
          setValidationErrors(validation.errors);
        } else {
          setValidationErrors(['Unknown validation error.']);
        }
        setIsSubmitting(false);
        return;
      }

      // Submit to Supabase
      console.log('Submitting to database');
      const { error } = await supabase
        .from('testimonials')
        .insert([{
          name: validation.data.name,
          email: validation.data.email || null,
          testimonial: validation.data.testimonial,
          survey_id: surveyId
        }]);

      if (error) {
        console.error('Database error:', error);
        setValidationErrors([getSecureErrorMessage('database')]);
      } else {
        console.log('Testimonial submitted successfully');
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", testimonial: "" });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setValidationErrors([getSecureErrorMessage('form')]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Share Your Testimonial</CardTitle>
        <CardDescription>
          Your feedback helps us improve and helps others make informed decisions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitSuccess && (
          <Alert className="mb-4">
            <AlertDescription>
              Thank you! Your testimonial has been submitted successfully.
            </AlertDescription>
          </Alert>
        )}

        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial">Testimonial *</Label>
            <Textarea
              id="testimonial"
              value={formData.testimonial}
              onChange={(e) => setFormData(prev => ({ ...prev, testimonial: e.target.value }))}
              required
              disabled={isSubmitting}
              rows={4}
              placeholder="Share your experience..."
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Testimonial'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
