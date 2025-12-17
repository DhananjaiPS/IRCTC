/*
  Warnings:

  - You are about to drop the column `runDate` on the `TrainSchedule` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `TrainSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExceptionType" AS ENUM ('CANCEL', 'ADD');

-- AlterTable
ALTER TABLE "TrainSchedule" DROP COLUMN "runDate",
ADD COLUMN     "daysOfWeek" INTEGER[],
ADD COLUMN     "endDate" DATE,
ADD COLUMN     "startDate" DATE NOT NULL;

-- CreateTable
CREATE TABLE "ScheduleException" (
    "id" BIGSERIAL NOT NULL,
    "scheduleId" BIGINT NOT NULL,
    "date" DATE NOT NULL,
    "type" "ExceptionType" NOT NULL,

    CONSTRAINT "ScheduleException_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduleException" ADD CONSTRAINT "ScheduleException_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "TrainSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
