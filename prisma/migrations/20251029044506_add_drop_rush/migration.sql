/*
  Warnings:

  - A unique constraint covering the columns `[solanaPayReference]` on the table `DealCoupon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DropStatus" AS ENUM ('SCHEDULED', 'LIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DropClaimStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'EXPIRED');

-- AlterTable
ALTER TABLE "DealCoupon" ADD COLUMN     "solanaPayReference" TEXT,
ADD COLUMN     "solanaPayTx" TEXT;

-- CreateTable
CREATE TABLE "DailyDrop" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "supplyAllocation" INTEGER NOT NULL,
    "streakMultiplier" INTEGER NOT NULL DEFAULT 1,
    "status" "DropStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyDrop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DropClaim" (
    "id" TEXT NOT NULL,
    "dropId" TEXT NOT NULL,
    "userId" TEXT,
    "couponId" TEXT,
    "walletAddress" TEXT,
    "streakSnapshot" INTEGER NOT NULL DEFAULT 0,
    "reference" TEXT,
    "transactionSig" TEXT,
    "status" "DropClaimStatus" NOT NULL DEFAULT 'PENDING',
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "DropClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStreak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastClaimAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStreak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyDrop_startAt_idx" ON "DailyDrop"("startAt");

-- CreateIndex
CREATE INDEX "DailyDrop_endAt_idx" ON "DailyDrop"("endAt");

-- CreateIndex
CREATE UNIQUE INDEX "DropClaim_reference_key" ON "DropClaim"("reference");

-- CreateIndex
CREATE INDEX "DropClaim_dropId_status_idx" ON "DropClaim"("dropId", "status");

-- CreateIndex
CREATE INDEX "DropClaim_walletAddress_idx" ON "DropClaim"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "UserStreak_userId_key" ON "UserStreak"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DealCoupon_solanaPayReference_key" ON "DealCoupon"("solanaPayReference");

-- AddForeignKey
ALTER TABLE "DailyDrop" ADD CONSTRAINT "DailyDrop_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropClaim" ADD CONSTRAINT "DropClaim_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "DailyDrop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropClaim" ADD CONSTRAINT "DropClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropClaim" ADD CONSTRAINT "DropClaim_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "DealCoupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStreak" ADD CONSTRAINT "UserStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
