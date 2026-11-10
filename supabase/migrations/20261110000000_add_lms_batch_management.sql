-- Migration: Add Batch Management to LMS
-- Enables Admin to manage recordings and students batch-wise while keeping student LMS view unified

-- 1. Create Module table if not exists
CREATE TABLE IF NOT EXISTS "Module" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "course_id" TEXT REFERENCES "Workshop"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create Lesson table if not exists
CREATE TABLE IF NOT EXISTS "Lesson" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "module_id" UUID REFERENCES "Module"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create LearningMaterial table with batch_name support if not exists
CREATE TABLE IF NOT EXISTS "LearningMaterial" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "lesson_id" UUID REFERENCES "Lesson"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "material_type" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "batch_name" TEXT DEFAULT 'ALL',
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Create Doubt table if not exists
CREATE TABLE IF NOT EXISTS "Doubt" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "lesson_id" UUID REFERENCES "Lesson"("id") ON DELETE CASCADE,
    "user_email" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "reply" TEXT,
    "status" TEXT DEFAULT 'OPEN',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Add batch_name to Enrollment and LearningMaterial
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'Batch 1';
ALTER TABLE "LearningMaterial" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'ALL';

-- 6. Enable RLS
ALTER TABLE "Module" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lesson" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LearningMaterial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Doubt" ENABLE ROW LEVEL SECURITY;

-- Module Policies
DROP POLICY IF EXISTS "module_admin_all" ON "Module";
CREATE POLICY "module_admin_all" ON "Module" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "module_student_select" ON "Module";
CREATE POLICY "module_student_select" ON "Module" FOR SELECT TO authenticated USING (true);

-- Lesson Policies
DROP POLICY IF EXISTS "lesson_admin_all" ON "Lesson";
CREATE POLICY "lesson_admin_all" ON "Lesson" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "lesson_student_select" ON "Lesson";
CREATE POLICY "lesson_student_select" ON "Lesson" FOR SELECT TO authenticated USING (true);

-- LearningMaterial Policies
DROP POLICY IF EXISTS "material_admin_all" ON "LearningMaterial";
CREATE POLICY "material_admin_all" ON "LearningMaterial" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "material_student_select" ON "LearningMaterial";
CREATE POLICY "material_student_select" ON "LearningMaterial" FOR SELECT TO authenticated USING (true);

-- Doubt Policies
DROP POLICY IF EXISTS "doubt_all_authenticated" ON "Doubt";
CREATE POLICY "doubt_all_authenticated" ON "Doubt" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Drop previous function signature and recreate with batch_name
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

-- Make Workshop fields optional/flexible
ALTER TABLE IF EXISTS "Workshop" ALTER COLUMN "date" DROP NOT NULL;
ALTER TABLE IF EXISTS "Workshop" ALTER COLUMN "time" DROP NOT NULL;
ALTER TABLE IF EXISTS "Workshop" ALTER COLUMN "duration" DROP NOT NULL;
ALTER TABLE IF EXISTS "Workshop" ALTER COLUMN "location" DROP NOT NULL;
ALTER TABLE IF EXISTS "Workshop" ALTER COLUMN "capacity" DROP NOT NULL;
ALTER TABLE IF EXISTS "Workshop" ALTER COLUMN "date" SET DEFAULT now();
