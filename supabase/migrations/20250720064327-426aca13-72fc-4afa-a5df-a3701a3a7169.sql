
-- Add index for foreign key on subscribers.user_id to improve query performance
-- This will resolve the "Unindexed foreign keys" performance warning
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);

-- Also add an index on email since it's used in RLS policies for lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
