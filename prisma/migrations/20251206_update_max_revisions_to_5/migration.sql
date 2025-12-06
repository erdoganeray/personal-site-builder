-- AlterTable
ALTER TABLE "Site" ALTER COLUMN "maxRevisions" SET DEFAULT 5;

-- Update existing sites to have 5 max revisions (optional, for Free plan users)
UPDATE "Site" SET "maxRevisions" = 5 WHERE "maxRevisions" = 1;
