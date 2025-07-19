
-- Fix RLS policy performance for public.surveys
-- Replace auth.uid() with (select auth.uid()) to prevent re-evaluation for each row

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can create their own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can update their own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON public.surveys;

-- Create optimized policies with subquery to prevent re-evaluation
CREATE POLICY "Users can view their own surveys" 
  ON public.surveys 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their own surveys" 
  ON public.surveys 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own surveys" 
  ON public.surveys 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own surveys" 
  ON public.surveys 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);

-- Also fix testimonials table RLS policies for consistency
DROP POLICY IF EXISTS "Survey owners can view testimonials for their surveys" ON public.testimonials;
DROP POLICY IF EXISTS "Survey owners can delete testimonials for their surveys" ON public.testimonials;

CREATE POLICY "Survey owners can view testimonials for their surveys" 
  ON public.testimonials 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys 
      WHERE surveys.id = testimonials.survey_id 
      AND surveys.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Survey owners can delete testimonials for their surveys" 
  ON public.testimonials 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys 
      WHERE surveys.id = testimonials.survey_id 
      AND surveys.user_id = (select auth.uid())
    )
  );
