/*
  Warnings:

  - You are about to drop the column `examDate` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Exam` table. All the data in the column will be lost.
  - Added the required column `date` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "examDate",
DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "result" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
