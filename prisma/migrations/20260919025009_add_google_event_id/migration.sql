/*
  Warnings:

  - A unique constraint covering the columns `[googleEventId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "googleEventId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_googleEventId_key" ON "Appointment"("googleEventId");
