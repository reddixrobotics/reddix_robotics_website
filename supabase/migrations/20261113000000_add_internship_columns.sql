-- ==============================================================================
-- Migration: Add missing columns to Internship table
-- ==============================================================================

ALTER TABLE IF EXISTS "Internship" ADD COLUMN IF NOT EXISTS "company" TEXT;
ALTER TABLE IF EXISTS "Internship" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE IF EXISTS "Internship" ADD COLUMN IF NOT EXISTS "type" TEXT;
ALTER TABLE IF EXISTS "Internship" ADD COLUMN IF NOT EXISTS "skills" TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS "Internship" ADD COLUMN IF NOT EXISTS "applicationLink" TEXT;
ALTER TABLE IF EXISTS "Internship" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE IF EXISTS "Internship" ADD COLUMN IF NOT EXISTS "deadline" TIMESTAMPTZ;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
