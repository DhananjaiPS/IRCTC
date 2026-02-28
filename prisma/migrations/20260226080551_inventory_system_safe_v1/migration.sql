/*
  Warnings:

  - You are about to drop the column `fromStationId` on the `SeatAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `SeatAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `toStationId` on the `SeatAvailability` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[passengerId]` on the table `SeatAvailability` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SeatAvailability" DROP CONSTRAINT "SeatAvailability_coachId_fkey";

-- DropForeignKey
ALTER TABLE "SeatAvailability" DROP CONSTRAINT "SeatAvailability_fromStationId_fkey";

-- DropForeignKey
ALTER TABLE "SeatAvailability" DROP CONSTRAINT "SeatAvailability_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "SeatAvailability" DROP CONSTRAINT "SeatAvailability_seatId_fkey";

-- DropForeignKey
ALTER TABLE "SeatAvailability" DROP CONSTRAINT "SeatAvailability_toStationId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "totalFare" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "trainInstanceId" BIGINT;

-- AlterTable
ALTER TABLE "SeatAvailability" DROP COLUMN "fromStationId",
DROP COLUMN "scheduleId",
DROP COLUMN "toStationId",
ADD COLUMN     "passengerId" BIGINT,
ADD COLUMN     "trainInstanceId" BIGINT,
ALTER COLUMN "coachId" DROP NOT NULL,
ALTER COLUMN "seatId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'BOOKED';

-- CreateTable
CREATE TABLE "TrainInstance" (
    "id" BIGSERIAL NOT NULL,
    "scheduleId" BIGINT,
    "journeyDate" DATE NOT NULL,
    "coachType" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL DEFAULT 72,
    "bookedSeats" INTEGER NOT NULL DEFAULT 0,
    "racSeats" INTEGER NOT NULL DEFAULT 5,
    "wlSeats" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "TrainInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainInstance_journeyDate_coachType_idx" ON "TrainInstance"("journeyDate", "coachType");

-- CreateIndex
CREATE UNIQUE INDEX "TrainInstance_scheduleId_journeyDate_coachType_key" ON "TrainInstance"("scheduleId", "journeyDate", "coachType");

-- CreateIndex
CREATE INDEX "Booking_pnr_idx" ON "Booking"("pnr");

-- CreateIndex
CREATE UNIQUE INDEX "SeatAvailability_passengerId_key" ON "SeatAvailability"("passengerId");

-- AddForeignKey
ALTER TABLE "TrainInstance" ADD CONSTRAINT "TrainInstance_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "TrainSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatAvailability" ADD CONSTRAINT "SeatAvailability_trainInstanceId_fkey" FOREIGN KEY ("trainInstanceId") REFERENCES "TrainInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatAvailability" ADD CONSTRAINT "SeatAvailability_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatAvailability" ADD CONSTRAINT "SeatAvailability_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_trainInstanceId_fkey" FOREIGN KEY ("trainInstanceId") REFERENCES "TrainInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
