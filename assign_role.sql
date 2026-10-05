CREATE OR REPLACE FUNCTION public.assign_user_role(target_email text, target_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role text;
BEGIN
  -- Get the role of the caller
  caller_role := (auth.jwt() -> 'app_metadata' ->> 'role');
  
  -- Only SUPER_ADMIN can assign roles
  IF caller_role != 'SUPER_ADMIN' THEN
    RAISE EXCEPTION 'Forbidden: Only SUPER_ADMIN can assign roles.';
  END IF;

  -- Ensure the role is valid
  IF target_role NOT IN ('TEACHER', 'ADMIN', 'CONTENT_MANAGER', 'USER') THEN
    RAISE EXCEPTION 'Invalid role specified.';
  END IF;

  -- Update the target user's app_metadata
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', target_role)
  WHERE email = target_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found.', target_email;
  END IF;

  RETURN true;
END;
$$;
