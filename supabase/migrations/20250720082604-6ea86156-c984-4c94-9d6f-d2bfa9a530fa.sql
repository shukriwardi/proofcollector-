
-- Create a function to get public surveys that can be accessed by anyone
CREATE OR REPLACE FUNCTION public.get_public_survey(link_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  question TEXT,
  is_public BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.question,
    s.is_public
  FROM public.surveys s
  WHERE s.id = link_id 
    AND (s.is_public = true OR s.user_id = auth.uid());
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.get_public_survey(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_survey(UUID) TO authenticated;
