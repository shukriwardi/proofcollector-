
-- Create surveys table to store custom surveys created by users
CREATE TABLE public.surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table to store responses to surveys
CREATE TABLE public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  testimonial TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for surveys
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- Create policies for surveys table
CREATE POLICY "Users can view their own surveys" 
  ON public.surveys 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own surveys" 
  ON public.surveys 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys" 
  ON public.surveys 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own surveys" 
  ON public.surveys 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable Row Level Security for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials table
CREATE POLICY "Survey owners can view testimonials for their surveys" 
  ON public.testimonials 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys 
      WHERE surveys.id = testimonials.survey_id 
      AND surveys.user_id = auth.uid()
    )
  );

-- Allow anyone to submit testimonials (public submission)
CREATE POLICY "Anyone can submit testimonials" 
  ON public.testimonials 
  FOR INSERT 
  WITH CHECK (true);

-- Allow survey owners to delete testimonials for their surveys
CREATE POLICY "Survey owners can delete testimonials for their surveys" 
  ON public.testimonials 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys 
      WHERE surveys.id = testimonials.survey_id 
      AND surveys.user_id = auth.uid()
    )
  );
