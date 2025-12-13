-- AlterTable
ALTER TABLE "User" ADD COLUMN "pendingEmail" TEXT,
ADD COLUMN "emailVerificationToken" TEXT,
ADD COLUMN "emailTokenExpiresAt" TIMESTAMP(3);
