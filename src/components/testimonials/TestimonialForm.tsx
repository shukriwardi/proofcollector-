
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Star } from "lucide-react";
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
    <div className="space-y-8">
      {surveyQuestion && (
        <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Your feedback matters</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {surveyQuestion}
          </p>
        </div>
      )}

      {rateLimited && (
        <Alert variant="destructive" className="border-red-800 bg-red-900/20">
          <AlertDescription className="text-red-300">
            Too many submissions. Please wait {cooldownTime} seconds before trying again.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-300">
              Your name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={onChange}
              required
              disabled={submitting || rateLimited}
              className={`h-12 rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 ${
                errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              disabled={submitting || rateLimited}
              className={`h-12 rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="your@email.com (optional)"
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="testimonial" className="text-sm font-medium text-gray-300">
            Your testimonial *
          </Label>
          <Textarea
            id="testimonial"
            name="testimonial"
            value={formData.testimonial}
            onChange={onChange}
            required
            disabled={submitting || rateLimited}
            rows={5}
            placeholder="Share your experience in detail. What did you like most? How did it help you?"
            className={`rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 resize-none ${
              errors.testimonial ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.testimonial && (
            <p className="text-sm text-red-400">{errors.testimonial}</p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={submitting || rateLimited} 
          className="w-full h-12 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting your testimonial...
            </>
          ) : rateLimited ? (
            `Please wait ${cooldownTime}s`
          ) : (
            'Submit your testimonial'
          )}
        </Button>
        
        <p className="text-sm text-gray-400 text-center">
          Your testimonial will be reviewed and published shortly
        </p>
      </form>
    </div>
  );
};
