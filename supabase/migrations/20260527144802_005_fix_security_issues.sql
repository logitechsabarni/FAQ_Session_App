/*
  # Fix Security Issues in Database Functions

  Issues to fix:
  1. Functions have mutable search_path (security risk)
  2. SECURITY DEFINER functions can be executed by anon/authenticated roles (should be restricted)
  
  Solutions:
  1. Set explicit search_path for all functions
  2. Revoke EXECUTE permissions from anon/authenticated for trigger functions
  3. Keep increment_view_count accessible but with proper search_path
*/

-- Fix update_updated_at_column function with explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY INVOKER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix handle_new_user function
-- This is a trigger function, should NOT be directly executable via API
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Could not create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Revoke execute permissions from handle_new_user (it's only for triggers)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM public;

-- Fix increment_view_count function with explicit search_path
-- This one needs to be callable via API, so we keep permissions but fix search_path
CREATE OR REPLACE FUNCTION public.increment_view_count(faq_id uuid)
RETURNS void
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.faqs
  SET view_count = view_count + 1
  WHERE id = faq_id;
END;
$$;

-- Keep increment_view_count accessible to all (needed for view tracking)
-- But ensure only anon and authenticated can call it (not public)
GRANT EXECUTE ON FUNCTION public.increment_view_count(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_view_count(uuid) TO authenticated;
