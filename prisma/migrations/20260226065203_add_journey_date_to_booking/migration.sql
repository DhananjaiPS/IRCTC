-- AlterEnum
ALTER TYPE "PassengerStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "journeyDate" DATE;

-- CreateIndex
CREATE INDEX "Booking_userId_journeyDate_idx" ON "Booking"("userId", "journeyDate");
