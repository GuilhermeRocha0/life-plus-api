-- CreateEnum
CREATE TYPE "MedicineType" AS ENUM ('PILL', 'LIQUID');

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "MedicineType" NOT NULL,
    "intervalHours" INTEGER NOT NULL,
    "lastTakenAt" TIMESTAMP(3) NOT NULL,
    "continuousUse" BOOLEAN NOT NULL,
    "treatmentFinished" BOOLEAN NOT NULL DEFAULT false,
    "totalPills" INTEGER,
    "pillsPerDose" INTEGER,
    "totalMl" DOUBLE PRECISION,
    "mlPerDose" DOUBLE PRECISION,
    "remainingPills" INTEGER,
    "remainingMl" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
