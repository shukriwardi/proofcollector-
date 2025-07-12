
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { testimonialSchema, type TestimonialFormData } from "@/lib/validation";
import { sanitizeText } from "@/lib/security";

interface TestimonialFormProps {
  formData: TestimonialFormData;
  errors: Partial<TestimonialFormData>;
  rateLimited: boolean;
  cooldownTime: number;
  submitting: boolean;
  surveyQuestion?: string;
  onSubmit: (e: React.FormEvent) => void;
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
    <form onSubmit={onSubmit} className="space-y-6">
      {rateLimited && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-medium">Rate limit reached</p>
            <p className="text-yellow-700 text-sm">
              Please wait {Math.floor(cooldownTime / 60)}m {cooldownTime % 60}s before submitting again.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="text-black font-medium">Your Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={onChange}
            className={`mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter your full name"
            maxLength={100}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-black font-medium">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            className={`mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter your email (optional)"
            maxLength={254}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          <p className="text-xs text-gray-500 mt-1">Optional - only used for follow-up if needed</p>
        </div>
      </div>

      <div>
        <Label htmlFor="testimonial" className="text-black font-medium">
          {surveyQuestion || "Your Testimonial"} *
        </Label>
        <Textarea
          id="testimonial"
          name="testimonial"
          value={formData.testimonial}
          onChange={onChange}
          rows={6}
          className={`mt-2 rounded-lg border-gray-200 focus:border-black focus:ring-black resize-none ${errors.testimonial ? 'border-red-500' : ''}`}
          placeholder="Tell us about your experience... What did you like? How did we help you? What would you tell others?"
          maxLength={1000}
          required
        />
        {errors.testimonial && <p className="text-red-500 text-sm mt-1">{errors.testimonial}</p>}
        <p className="text-xs text-gray-500 mt-1">
          {formData.testimonial.length}/1000 characters
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Tips for a great testimonial:</strong>
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Be specific about what you liked or found helpful</li>
          <li>• Mention the results or benefits you experienced</li>
          <li>• Share what you'd tell others considering our services</li>
          <li>• Be authentic and honest about your experience</li>
        </ul>
      </div>

      <Button 
        type="submit" 
        disabled={submitting || rateLimited}
        className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3 text-lg disabled:opacity-50"
      >
        {submitting ? "Submitting..." : rateLimited ? `Wait ${Math.floor(cooldownTime / 60)}m ${cooldownTime % 60}s` : "Submit Testimonial"}
      </Button>

      <p className="text-center text-xs text-gray-500">
        By submitting this testimonial, you give us permission to use it for marketing purposes. 
        We respect your privacy and will only use the information you provide here.
      </p>
    </form>
  );
};
