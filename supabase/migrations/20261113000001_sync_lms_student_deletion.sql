-- ==============================================================================
-- Migration: Two-way sync for LMS student deletion
-- 1. When a user/email is deleted in the database (auth.users), it immediately
--    disappears from Admin LMS (INNER JOIN on auth.users and cascade delete).
-- 2. When an admin deletes a student from Admin LMS, the user account is also
--    permanently deleted from the database (auth.users and public."User").
-- ==============================================================================

-- 1. Clean up orphaned enrollments whose auth user was already deleted
DELETE FROM "Enrollment"
WHERE user_id IS NULL
   OR user_id NOT IN (SELECT id FROM auth.users);

-- 2. Add ON DELETE CASCADE foreign key so deleting from auth.users automatically
--    deletes all associated enrollments in PostgreSQL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'Enrollment_user_id_fkey' AND table_name = 'Enrollment'
  ) THEN
    ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_user_id_fkey";
  END IF;

  ALTER TABLE "Enrollment"
    ADD CONSTRAINT "Enrollment_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES auth.users(id)
    ON DELETE CASCADE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Constraint update skipped or already applied: %', SQLERRM;
END $$;

-- 3. Replace RPC get_lms_student_details() with INNER JOIN and user_id return
DROP FUNCTION IF EXISTS public.get_lms_student_details();

CREATE OR REPLACE FUNCTION public.get_lms_student_details()
RETURNS TABLE (
  enrollment_id uuid,
  user_id uuid,
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
BEGIN
  RETURN QUERY
  SELECT 
    e.id AS enrollment_id,
    u.id AS user_id,
    u.email::text AS student_email,
    COALESCE(w.title, 'General Course (Unassigned)')::text AS course_title,
    COALESCE(e.batch_name, 'Batch 1')::text AS batch_name,
    COALESCE(e.status, 'ACTIVE')::text AS status,
    COALESCE(e.created_at, u.created_at, now()) AS enrolled_at
  FROM "Enrollment" e
  JOIN auth.users u ON (e.user_id = u.id)
  LEFT JOIN "Workshop" w ON (e.course_id = w.id)
  WHERE u.email IS NOT NULL AND trim(u.email) != ''
  ORDER BY COALESCE(e.created_at, u.created_at, now()) DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_lms_student_details() TO authenticated, anon, service_role;

-- 4. Replace View lms_student_details with INNER JOIN and user_id return
DROP VIEW IF EXISTS public.lms_student_details CASCADE;

CREATE VIEW public.lms_student_details AS
SELECT 
  e.id AS enrollment_id,
  u.id AS user_id,
  u.email::text AS student_email,
  COALESCE(w.title, 'General Course (Unassigned)')::text AS course_title,
  COALESCE(e.batch_name, 'Batch 1')::text AS batch_name,
  COALESCE(e.status, 'ACTIVE')::text AS status,
  COALESCE(e.created_at, u.created_at, now()) AS enrolled_at
FROM "Enrollment" e
JOIN auth.users u ON (e.user_id = u.id)
LEFT JOIN "Workshop" w ON (e.course_id = w.id)
WHERE u.email IS NOT NULL AND trim(u.email) != '';

ALTER VIEW public.lms_student_details OWNER TO postgres;
GRANT SELECT ON public.lms_student_details TO authenticated, anon, service_role;

-- 5. Create RPC delete_lms_student to delete student from database and LMS
DROP FUNCTION IF EXISTS public.delete_lms_student(uuid, uuid, text);

CREATE OR REPLACE FUNCTION public.delete_lms_student(
  target_enrollment_id uuid DEFAULT NULL,
  target_user_id uuid DEFAULT NULL,
  target_email text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  resolved_user_id uuid;
  caller_role text;
BEGIN
  -- Verify caller is admin or internal
  caller_role := COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '');
  IF caller_role NOT IN ('SUPER_ADMIN', 'ADMIN') AND current_user != 'postgres' AND current_user != 'service_role' THEN
    RAISE EXCEPTION 'Forbidden: Only administrators can delete student accounts.';
  END IF;

  -- Resolve target_user_id
  IF target_user_id IS NOT NULL THEN
    resolved_user_id := target_user_id;
  ELSIF target_enrollment_id IS NOT NULL THEN
    SELECT user_id INTO resolved_user_id FROM "Enrollment" WHERE id = target_enrollment_id;
  ELSIF target_email IS NOT NULL THEN
    SELECT id INTO resolved_user_id FROM auth.users WHERE lower(email) = lower(trim(target_email));
  END IF;

  -- Delete from Enrollment
  IF target_enrollment_id IS NOT NULL THEN
    DELETE FROM "Enrollment" WHERE id = target_enrollment_id;
  END IF;

  IF resolved_user_id IS NOT NULL THEN
    -- Safety check: Never delete a SUPER_ADMIN or ADMIN account
    IF NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = resolved_user_id 
      AND (raw_app_meta_data->>'role' IN ('SUPER_ADMIN', 'ADMIN'))
    ) THEN
      DELETE FROM "Enrollment" WHERE user_id = resolved_user_id;
      DELETE FROM public."User" WHERE id = resolved_user_id::text;
      DELETE FROM auth.users WHERE id = resolved_user_id;
    END IF;
  ELSIF target_email IS NOT NULL THEN
    DELETE FROM auth.users 
    WHERE lower(email) = lower(trim(target_email))
    AND (raw_app_meta_data->>'role' NOT IN ('SUPER_ADMIN', 'ADMIN') OR raw_app_meta_data->>'role' IS NULL);
  END IF;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_lms_student(uuid, uuid, text) TO authenticated, anon, service_role;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
