-- CreateTable
CREATE TABLE "DeletedAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetKey" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeletedAsset_userId_idx" ON "DeletedAsset"("userId");

-- CreateIndex
CREATE INDEX "DeletedAsset_deletedAt_idx" ON "DeletedAsset"("deletedAt");

-- AddForeignKey
ALTER TABLE "DeletedAsset" ADD CONSTRAINT "DeletedAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
