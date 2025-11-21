-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'My Personal Website',
    "cvUrl" TEXT,
    "cvTextData" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "htmlContent" TEXT,
    "cssContent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "vercelUrl" TEXT,
    "revisionCount" INTEGER NOT NULL DEFAULT 0,
    "maxRevisions" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Site_userId_idx" ON "Site"("userId");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
