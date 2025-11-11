/*
  Warnings:

  - You are about to drop the `MedicineDose` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MedicineDose" DROP CONSTRAINT "MedicineDose_medicineId_fkey";

-- DropTable
DROP TABLE "public"."MedicineDose";

-- CreateTable
CREATE TABLE "MedicineHistory" (
    "id" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "onTime" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicineHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicineHistory" ADD CONSTRAINT "MedicineHistory_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
