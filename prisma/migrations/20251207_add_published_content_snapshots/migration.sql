-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "publishedHtmlContent" TEXT,
ADD COLUMN     "publishedCssContent" TEXT,
ADD COLUMN     "publishedJsContent" TEXT,
ADD COLUMN     "publishedCvContent" JSONB;
