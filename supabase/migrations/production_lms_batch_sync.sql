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
ALTER TABLE IF EXISTS "LearningMaterial" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'Batch 1';

-- 4. Set all existing students and modules to 'Batch 1'
UPDATE "Enrollment" 
SET "batch_name" = 'Batch 1' 
WHERE "batch_name" IS NULL OR "batch_name" = '' OR "batch_name" = 'ALL';

UPDATE "Module" 
SET "batch_name" = 'Batch 1' 
WHERE "batch_name" IS NULL OR "batch_name" = '' OR "batch_name" = 'ALL';

UPDATE "LearningMaterial" 
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
  JOIN auth.users u ON e.user_id = u.id
  LEFT JOIN "Workshop" w ON e.course_id = w.id
  WHERE u.email IS NOT NULL AND trim(u.email) != ''
  ORDER BY COALESCE(e.created_at, u.created_at, now()) DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_lms_student_details() TO authenticated, anon, service_role;

-- 7. Create/Replace View for direct queries
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
JOIN auth.users u ON e.user_id = u.id
LEFT JOIN "Workshop" w ON e.course_id = w.id
WHERE u.email IS NOT NULL AND trim(u.email) != '';

ALTER VIEW public.lms_student_details OWNER TO postgres;
GRANT SELECT ON public.lms_student_details TO authenticated, anon, service_role;

-- 7b. Create RPC delete_lms_student to delete student from database and LMS
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
  caller_role := COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '');
  IF caller_role NOT IN ('SUPER_ADMIN', 'ADMIN') AND current_user != 'postgres' AND current_user != 'service_role' THEN
    RAISE EXCEPTION 'Forbidden: Only administrators can delete student accounts.';
  END IF;

  IF target_user_id IS NOT NULL THEN
    resolved_user_id := target_user_id;
  ELSIF target_enrollment_id IS NOT NULL THEN
    SELECT user_id INTO resolved_user_id FROM "Enrollment" WHERE id = target_enrollment_id;
  ELSIF target_email IS NOT NULL THEN
    SELECT id INTO resolved_user_id FROM auth.users WHERE lower(email) = lower(trim(target_email));
  END IF;

  IF target_enrollment_id IS NOT NULL THEN
    DELETE FROM "Enrollment" WHERE id = target_enrollment_id;
  END IF;

  IF resolved_user_id IS NOT NULL THEN
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


-- 8. Create DeviceSession table for student multi-device limits
CREATE TABLE IF NOT EXISTS "DeviceSession" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "device_identifier" TEXT NOT NULL,
    "user_agent" TEXT,
    "is_revoked" BOOLEAN DEFAULT false,
    "last_active_at" TIMESTAMPTZ DEFAULT now(),
    "created_at" TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT "DeviceSession_user_device_unique" UNIQUE ("user_id", "device_identifier")
);

ALTER TABLE "DeviceSession" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "device_session_user_all" ON "DeviceSession";
CREATE POLICY "device_session_user_all" ON "DeviceSession" 
FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);


-- 9. Add applyUrl to Workshop and seed ros2_apply_url in WorkshopMedia
ALTER TABLE IF EXISTS "Workshop" ADD COLUMN IF NOT EXISTS "applyUrl" TEXT;

CREATE TABLE IF NOT EXISTS "WorkshopMedia" (
    "sectionKey" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "posterUrl" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'video',
    "altText" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS "WorkshopMedia" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "workshopmedia_public_select" ON "WorkshopMedia";
CREATE POLICY "workshopmedia_public_select" ON "WorkshopMedia"
FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "workshopmedia_admin_all" ON "WorkshopMedia";
CREATE POLICY "workshopmedia_admin_all" ON "WorkshopMedia"
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

INSERT INTO "WorkshopMedia" ("sectionKey", "title", "mediaUrl", "mediaType", "isActive", "updatedAt")
VALUES ('ros2_apply_url', 'ROS 2 Application Form Link', 'https://docs.google.com/forms/d/e/1FAIpQLSfOHo7D9BNF0ZeL7CAQTIMxhq_XQyWgo6oczNFk3QNXi5ifxQ/viewform?usp=header', 'link', true, now())
ON CONFLICT ("sectionKey") DO NOTHING;
