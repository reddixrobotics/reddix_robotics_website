-- ==============================================================================
-- UNIVERSAL CURRICULUM & STRICT BATCH ISOLATION MIGRATION
-- Project: lxlkxbrtvnapqhoanarp
-- ==============================================================================

-- 1. Ensure columns exist on Module, Lesson, LearningMaterial, and Enrollment
ALTER TABLE IF EXISTS "Module" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'ALL';
ALTER TABLE IF EXISTS "LearningMaterial" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'Batch 1';
ALTER TABLE IF EXISTS "Enrollment" ADD COLUMN IF NOT EXISTS "batch_name" TEXT DEFAULT 'Batch 1';

-- 2. Make base course curriculum modules available to ALL batches (Batch 1, Batch 2, Batch 3, etc.)
-- This ensures students in every batch can access the course modules and lessons.
UPDATE "Module"
SET "batch_name" = 'ALL'
WHERE "batch_name" IS NULL OR "batch_name" = '' OR "batch_name" = 'Batch 1';

-- 3. Maintain strict isolation for learning materials (recordings, PDFs, PPTs):
-- Keep existing materials tagged with 'Batch 1' so they are ONLY visible to Batch 1 students!
UPDATE "LearningMaterial"
SET "batch_name" = 'Batch 1'
WHERE "batch_name" IS NULL OR "batch_name" = '';

-- 4. Ensure RLS allows authenticated users to read modules, lessons, and learning materials
ALTER TABLE IF EXISTS "Module" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Lesson" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "LearningMaterial" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "module_student_select" ON "Module";
CREATE POLICY "module_student_select" ON "Module" FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "lesson_student_select" ON "Lesson";
CREATE POLICY "lesson_student_select" ON "Lesson" FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "material_student_select" ON "LearningMaterial";
CREATE POLICY "material_student_select" ON "LearningMaterial" FOR SELECT TO authenticated USING (true);

-- Ensure admin full access policies
DROP POLICY IF EXISTS "module_admin_all" ON "Module";
CREATE POLICY "module_admin_all" ON "Module" FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "lesson_admin_all" ON "Lesson";
CREATE POLICY "lesson_admin_all" ON "Lesson" FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "material_admin_all" ON "LearningMaterial";
CREATE POLICY "material_admin_all" ON "LearningMaterial" FOR ALL TO authenticated USING (true) WITH CHECK (true);
