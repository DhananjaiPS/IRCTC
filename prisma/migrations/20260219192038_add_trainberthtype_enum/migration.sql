/*
  Warnings:

  - Changed the type of `berthType` on the `Seat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TrainBerthType" AS ENUM ('LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER');

-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "adminMessage" TEXT;

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "berthType",
ADD COLUMN     "berthType" "TrainBerthType" NOT NULL;
