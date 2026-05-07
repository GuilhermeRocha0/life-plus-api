/*
  Warnings:

  - You are about to drop the column `url` on the `ExamPhoto` table. All the data in the column will be lost.
  - Added the required column `data` to the `ExamPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamPhoto" DROP COLUMN "url",
ADD COLUMN     "data" BYTEA NOT NULL;
