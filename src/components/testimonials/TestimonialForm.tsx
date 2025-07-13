
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { TestimonialFormData } from "@/lib/validation";

interface TestimonialFormProps {
  formData: TestimonialFormData;
  errors: Partial<TestimonialFormData>;
  rateLimited: boolean;
  cooldownTime: number;
  submitting: boolean;
  surveyQuestion?: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const TestimonialForm = ({
  formData,
  errors,
  rateLimited,
  cooldownTime,
  submitting,
  surveyQuestion,
  onSubmit,
  onChange
}: TestimonialFormProps) => {
  return (
    <div className="space-y-6">
      {surveyQuestion && (
        <div className="text-lg font-medium text-gray-700 mb-6">
          {surveyQuestion}
        </div>
      )}

      {rateLimited && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Too many submissions. Please wait {cooldownTime} seconds before trying again.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={onChange}
            required
            disabled={submitting || rateLimited}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            disabled={submitting || rateLimited}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="testimonial">Testimonial *</Label>
          <Textarea
            id="testimonial"
            name="testimonial"
            value={formData.testimonial}
            onChange={onChange}
            required
            disabled={submitting || rateLimited}
            rows={4}
            placeholder="Share your experience..."
            className={errors.testimonial ? "border-red-500" : ""}
          />
          {errors.testimonial && (
            <p className="text-sm text-red-600">{errors.testimonial}</p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={submitting || rateLimited} 
          className="w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : rateLimited ? (
            `Wait ${cooldownTime}s`
          ) : (
            'Submit Testimonial'
          )}
        </Button>
      </form>
    </div>
  );
};
