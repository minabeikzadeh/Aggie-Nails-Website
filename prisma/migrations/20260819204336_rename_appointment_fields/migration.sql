/*
  Warnings:

  - You are about to drop the column `extensions` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `removal` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,time]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `AppointmentType` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `removalType` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('NEW', 'FILL', 'NATURAL');

-- CreateEnum
CREATE TYPE "RemovalType" AS ENUM ('LOCAL', 'FOREIGN', 'NONE');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "extensions",
DROP COLUMN "removal",
ADD COLUMN     "AppointmentType" "AppointmentType" NOT NULL,
ADD COLUMN     "removalType" "RemovalType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_date_time_key" ON "Appointment"("date", "time");
