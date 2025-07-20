
-- Add is_public column to surveys table to allow public sharing
ALTER TABLE public.surveys ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own surveys" ON public.surveys;

-- Create new policy that allows both survey owners and public access
CREATE POLICY "Users can view their own surveys or public surveys" 
  ON public.surveys 
  FOR SELECT 
  USING (
    ((select auth.uid()) = user_id) OR (is_public = true)
  );
