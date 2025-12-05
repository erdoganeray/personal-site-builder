-- Rename cvTextData to cvContent and change type to JSONB
ALTER TABLE "Site" RENAME COLUMN "cvTextData" TO "cvContent";
ALTER TABLE "Site" ALTER COLUMN "cvContent" TYPE JSONB USING "cvContent"::JSONB;

-- Add missing columns
ALTER TABLE "Site" ADD COLUMN IF NOT EXISTS "jsContent" TEXT;
ALTER TABLE "Site" ADD COLUMN IF NOT EXISTS "previewContent" JSONB;
ALTER TABLE "Site" ADD COLUMN IF NOT EXISTS "publishContent" JSONB;
