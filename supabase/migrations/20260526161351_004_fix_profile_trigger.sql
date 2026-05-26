/*
  # Fix Profile Creation Trigger

  The issue is that the handle_new_user() trigger function is being blocked
  by RLS policies when trying to insert into profiles table.

  Solution:
  1. Drop the existing trigger
  2. Update the function to correctly handle the insert
  3. Recreate the trigger

  The SECURITY DEFINER clause means the function runs with the privileges
  of the function owner (postgres), bypassing RLS. However, we need to
  ensure the function is owned by a superuser role.
*/

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function with explicit schema qualifications
-- and ensure it works correctly
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
    -- Log error but don't fail the user creation
    RAISE WARNING 'Could not create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Also ensure profiles table has proper defaults
ALTER TABLE profiles ALTER COLUMN name SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN avatar SET DEFAULT '';
