/*
  Warnings:

  - Added the required column `gender` to the `Cheater` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cheater" ADD COLUMN     "characterDescription" TEXT,
ADD COLUMN     "gender" TEXT NOT NULL;
