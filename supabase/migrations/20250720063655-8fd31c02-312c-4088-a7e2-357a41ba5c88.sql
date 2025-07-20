
-- Fix RLS policy performance for public.profiles
-- Replace auth.uid() with (select auth.uid()) to prevent re-evaluation for each row

-- Drop existing profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create optimized profiles policies with subquery
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Fix RLS policy performance for public.subscribers
-- Replace auth.uid() and auth.email() with subqueries

-- Drop existing subscribers policies
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create optimized subscribers policies with subqueries
CREATE POLICY "select_own_subscription" 
  ON public.subscribers 
  FOR SELECT 
  USING ((user_id = (select auth.uid())) OR (email = (select auth.email())));

CREATE POLICY "update_own_subscription" 
  ON public.subscribers 
  FOR UPDATE 
  USING (true);

CREATE POLICY "insert_subscription" 
  ON public.subscribers 
  FOR INSERT 
  WITH CHECK (true);
