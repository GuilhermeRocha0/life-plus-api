/*
  Warnings:

  - You are about to drop the column `url` on the `ExamPhoto` table. All the data in the column will be lost.
  - Added the required column `data` to the `ExamPhoto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `ExamPhoto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `ExamPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ExamPhoto" DROP CONSTRAINT "ExamPhoto_examId_fkey";

-- AlterTable
ALTER TABLE "ExamPhoto" DROP COLUMN "url",
ADD COLUMN     "data" BYTEA NOT NULL,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamPhoto" ADD CONSTRAINT "ExamPhoto_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
