/*
  Warnings:

  - You are about to drop the column `recreatesResetDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `recreatesThisMonth` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "recreatesResetDate",
DROP COLUMN "recreatesThisMonth";
