
-- Improve the RLS policy for surveys to handle anonymous users accessing public surveys
DROP POLICY IF EXISTS "Users can view their own surveys or public surveys" ON public.surveys;

-- Create a new policy that properly handles anonymous users accessing public surveys
CREATE POLICY "Users can view their own surveys or public surveys" 
  ON public.surveys 
  FOR SELECT 
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
    (is_public = true)
  );
