
import { z } from 'zod';

// Validation schemas
export const testimonialSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email must be less than 254 characters')
    .optional()
    .or(z.literal('')),
  testimonial: z.string()
    .min(10, 'Testimonial must be at least 10 characters')
    .max(1000, 'Testimonial must be less than 1000 characters')
});

export const surveySchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  question: z.string()
    .min(1, 'Question is required')
    .max(500, 'Question must be less than 500 characters')
});

export const profileSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
});

// Type exports
export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type SurveyFormData = z.infer<typeof surveySchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
