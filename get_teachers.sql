CREATE OR REPLACE FUNCTION public.get_teachers()
RETURNS TABLE(id uuid, email character varying, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role text;
BEGIN
  caller_role := (auth.jwt() -> 'app_metadata' ->> 'role');
  
  IF caller_role != 'SUPER_ADMIN' THEN
    RAISE EXCEPTION 'Access Denied: Only SUPER_ADMIN can view teachers.';
  END IF;

  RETURN QUERY
  SELECT u.id, u.email::varchar, u.created_at
  FROM auth.users u
  WHERE u.raw_app_meta_data->>'role' = 'TEACHER'
  ORDER BY u.created_at DESC;
END;
$$;
