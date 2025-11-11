-- CreateTable
CREATE TABLE "MedicineDose" (
    "id" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "onTime" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicineDose_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicineDose" ADD CONSTRAINT "MedicineDose_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
