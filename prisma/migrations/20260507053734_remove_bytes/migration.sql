/*
  Warnings:

  - You are about to drop the column `data` on the `ExamPhoto` table. All the data in the column will be lost.
  - Added the required column `url` to the `ExamPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamPhoto" DROP COLUMN "data",
ADD COLUMN     "url" TEXT NOT NULL;
