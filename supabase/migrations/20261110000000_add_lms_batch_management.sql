-- Migration: Add Batch Management to LMS
-- Enables Admin to manage recordings and students batch-wise while keeping student LMS view unified

-- 1. Add batch_name to Enrollment
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'Batch 1';

-- 2. Add batch_name to LearningMaterial (ALL = available to all batches, or specific batch like 'Batch 1', 'Batch 2')
ALTER TABLE "LearningMaterial" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'ALL';

-- 3. Update get_lms_student_details RPC function to include batch_name
CREATE OR REPLACE FUNCTION public.get_lms_student_details()
RETURNS TABLE (
  enrollment_id uuid,
  student_email text,
  course_title text,
  batch_name text,
  status text,
  enrolled_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  caller_role text;
BEGIN
  caller_role := (auth.jwt() -> 'app_metadata' ->> 'role');
  IF caller_role NOT IN ('SUPER_ADMIN', 'ADMIN') THEN
    RAISE EXCEPTION 'Access Denied: Only administrators can view student details.';
  END IF;

  RETURN QUERY
  SELECT 
    e.id AS enrollment_id,
    u.email::text AS student_email,
    COALESCE(w.title, 'General Course')::text AS course_title,
    COALESCE(e.batch_name, 'Batch 1')::text AS batch_name,
    e.status::text,
    e.created_at AS enrolled_at
  FROM "Enrollment" e
  JOIN auth.users u ON e.user_id = u.id
  LEFT JOIN "Workshop" w ON e.course_id = w.id
  ORDER BY e.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_lms_student_details() TO authenticated;
