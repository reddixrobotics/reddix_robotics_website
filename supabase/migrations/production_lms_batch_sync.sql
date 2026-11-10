-- ==============================================================================
-- PRODUCTION SUPABASE MIGRATION (Project: lxlkxbrtvnapqhoanarp)
-- Sets all existing students to 'Batch 1' and prepares LMS for 'Batch 2'
-- ==============================================================================

-- 1. Ensure batch_name column exists on Enrollment, Module, and LearningMaterial
ALTER TABLE IF EXISTS "Enrollment" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'Batch 1';
ALTER TABLE IF EXISTS "Module" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'Batch 1';
ALTER TABLE IF EXISTS "LearningMaterial" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'ALL';

-- 2. Backfill ALL existing students and modules to 'Batch 1'
UPDATE "Enrollment" 
SET "batch_name" = 'Batch 1' 
WHERE "batch_name" IS NULL OR "batch_name" = '' OR "batch_name" = 'ALL';

UPDATE "Module" 
SET "batch_name" = 'Batch 1' 
WHERE "batch_name" IS NULL OR "batch_name" = '' OR "batch_name" = 'ALL';

-- 3. Ensure Enrollment RLS allows authenticated admins to read all enrollments
DROP POLICY IF EXISTS "enrollment_admin_all" ON "Enrollment";
CREATE POLICY "enrollment_admin_all" ON "Enrollment" 
FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. Create/Replace RPC function to return student details with their email and batch
DROP FUNCTION IF EXISTS public.get_lms_student_details();

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
BEGIN
  RETURN QUERY
  SELECT 
    e.id AS enrollment_id,
    COALESCE(u.email, 'Student')::text AS student_email,
    COALESCE(w.title, 'General Course (Unassigned)')::text AS course_title,
    COALESCE(e.batch_name, 'Batch 1')::text AS batch_name,
    COALESCE(e.status, 'ACTIVE')::text AS status,
    e.created_at AS enrolled_at
  FROM "Enrollment" e
  LEFT JOIN auth.users u ON e.user_id = u.id
  LEFT JOIN "Workshop" w ON e.course_id = w.id
  ORDER BY e.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_lms_student_details() TO authenticated, anon, service_role;

-- 5. Create/Replace View for direct queries
CREATE OR REPLACE VIEW public.lms_student_details AS
SELECT 
  e.id AS enrollment_id,
  COALESCE(u.email, 'Student')::text AS student_email,
  COALESCE(w.title, 'General Course (Unassigned)')::text AS course_title,
  COALESCE(e.batch_name, 'Batch 1')::text AS batch_name,
  COALESCE(e.status, 'ACTIVE')::text AS status,
  e.created_at AS enrolled_at
FROM "Enrollment" e
LEFT JOIN auth.users u ON e.user_id = u.id
LEFT JOIN "Workshop" w ON e.course_id = w.id;

ALTER VIEW public.lms_student_details OWNER TO postgres;
GRANT SELECT ON public.lms_student_details TO authenticated, anon, service_role;
