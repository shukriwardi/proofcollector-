
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Star, MessageCircle } from "lucide-react";
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
        <div className="text-center p-8 bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex justify-center mb-6">
            <MessageCircle className="h-12 w-12 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">We'd love to hear about your experience</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Your testimonial helps others learn about our services.
          </p>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-2">{surveyQuestion}</h3>
          </div>
        </div>
      )}

      {rateLimited && (
        <Alert variant="destructive" className="border-red-800 bg-red-900/20">
          <AlertDescription className="text-red-300">
            Too many submissions. Please wait {cooldownTime} seconds before trying again.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-lg font-medium text-white">
              Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={onChange}
              required
              disabled={submitting || rateLimited}
              className={`h-14 rounded-lg bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 text-lg ${
                errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-sm text-red-400 mt-2">{errors.name}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-lg font-medium text-white">
              Email (optional)
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              disabled={submitting || rateLimited}
              className={`h-14 rounded-lg bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 text-lg ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-400 mt-2">{errors.email}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="testimonial" className="text-lg font-medium text-white">
              Testimonial *
            </Label>
            <Textarea
              id="testimonial"
              name="testimonial"
              value={formData.testimonial}
              onChange={onChange}
              required
              disabled={submitting || rateLimited}
              rows={6}
              placeholder="Share your experience..."
              className={`rounded-lg bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 resize-none text-lg leading-relaxed ${
                errors.testimonial ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
            />
            {errors.testimonial && (
              <p className="text-sm text-red-400 mt-2">{errors.testimonial}</p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={submitting || rateLimited} 
          className="w-full h-14 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Submitting your testimonial...
            </>
          ) : rateLimited ? (
            `Please wait ${cooldownTime}s`
          ) : (
            'Submit your testimonial'
          )}
        </Button>
        
        <p className="text-sm text-gray-400 text-center leading-relaxed">
          Your testimonial will be reviewed and published shortly. Thank you for taking the time to share your experience!
        </p>
      </form>
    </div>
  );
};
