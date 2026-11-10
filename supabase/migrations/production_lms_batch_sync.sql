-- ==============================================================================
-- BULLETPROOF PRODUCTION SUPABASE MIGRATION (Project: lxlkxbrtvnapqhoanarp)
-- Compatible with both Prisma camelCase and Supabase snake_case schemas
-- ==============================================================================

-- 1. Ensure columns exist on Enrollment regardless of schema format
ALTER TABLE IF EXISTS "Enrollment" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'Batch 1';
ALTER TABLE IF EXISTS "Enrollment" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'ACTIVE';
ALTER TABLE IF EXISTS "Enrollment" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ DEFAULT now();
ALTER TABLE IF EXISTS "Enrollment" ADD COLUMN IF NOT EXISTS "user_id" UUID;
ALTER TABLE IF EXISTS "Enrollment" ADD COLUMN IF NOT EXISTS "course_id" TEXT;

-- 2. If legacy camelCase columns exist (from Prisma), sync data over to standard columns
DO $$
BEGIN
  -- Sync createdAt -> created_at
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Enrollment' AND column_name = 'createdAt'
  ) THEN
    EXECUTE 'UPDATE "Enrollment" SET created_at = "createdAt" WHERE created_at IS NULL';
  END IF;

  -- Sync userId -> user_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Enrollment' AND column_name = 'userId'
  ) THEN
    EXECUTE 'UPDATE "Enrollment" SET user_id = "userId"::uuid WHERE user_id IS NULL';
  END IF;

  -- Sync courseId -> course_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Enrollment' AND column_name = 'courseId'
  ) THEN
    EXECUTE 'UPDATE "Enrollment" SET course_id = "courseId" WHERE course_id IS NULL';
  END IF;
END $$;

-- 3. Ensure Module and LearningMaterial have batch_name
ALTER TABLE IF EXISTS "Module" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'Batch 1';
ALTER TABLE IF EXISTS "LearningMaterial" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'ALL';

-- 4. Set all existing students and modules to 'Batch 1'
UPDATE "Enrollment" 
SET "batch_name" = 'Batch 1' 
WHERE "batch_name" IS NULL OR "batch_name" = '' OR "batch_name" = 'ALL';

UPDATE "Module" 
SET "batch_name" = 'Batch 1' 
WHERE "batch_name" IS NULL OR "batch_name" = '' OR "batch_name" = 'ALL';

-- 5. Ensure Enrollment RLS allows authenticated admins to read all enrollments
DROP POLICY IF EXISTS "enrollment_admin_all" ON "Enrollment";
CREATE POLICY "enrollment_admin_all" ON "Enrollment" 
FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

-- 6. Create/Replace RPC function to return student details with their email and batch
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
    COALESCE(e.created_at, u.created_at, now()) AS enrolled_at
  FROM "Enrollment" e
  LEFT JOIN auth.users u ON e.user_id = u.id
  LEFT JOIN "Workshop" w ON e.course_id = w.id
  ORDER BY COALESCE(e.created_at, u.created_at, now()) DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_lms_student_details() TO authenticated, anon, service_role;

-- 7. Create/Replace View for direct queries
CREATE OR REPLACE VIEW public.lms_student_details AS
SELECT 
  e.id AS enrollment_id,
  COALESCE(u.email, 'Student')::text AS student_email,
  COALESCE(w.title, 'General Course (Unassigned)')::text AS course_title,
  COALESCE(e.batch_name, 'Batch 1')::text AS batch_name,
  COALESCE(e.status, 'ACTIVE')::text AS status,
  COALESCE(e.created_at, u.created_at, now()) AS enrolled_at
FROM "Enrollment" e
LEFT JOIN auth.users u ON e.user_id = u.id
LEFT JOIN "Workshop" w ON e.course_id = w.id;

ALTER VIEW public.lms_student_details OWNER TO postgres;
GRANT SELECT ON public.lms_student_details TO authenticated, anon, service_role;
