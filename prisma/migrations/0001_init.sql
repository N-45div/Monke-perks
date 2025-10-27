-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FLAT', 'BOGO', 'CASHBACK');

-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('DRAFT', 'UPCOMING', 'ACTIVE', 'SOLD_OUT', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CouponState" AS ENUM ('AVAILABLE', 'RESERVED', 'TRANSFERRED', 'REDEEMED', 'REVOKED');

-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('VIEW', 'FAVORITE', 'SHARE', 'CLAIM', 'TRANSFER', 'REDEEM', 'COMMENT');

-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('POWER_USER', 'SUPER_SHARER', 'TRUSTED_MERCHANT', 'EARLY_ADOPTER', 'COMMUNITY_LEADER');

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "websiteUrl" TEXT,
    "contactEmail" TEXT,
    "description" TEXT,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "heroImageUrl" TEXT,
    "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DECIMAL(10,2),
    "originalPrice" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "location" TEXT,
    "supplyCap" INTEGER,
    "perWalletLimit" INTEGER DEFAULT 1,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "status" "DealStatus" NOT NULL DEFAULT 'DRAFT',
    "redemptionNotes" TEXT,
    "termsUrl" TEXT,
    "externalUrl" TEXT,
    "socialShareText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealCoupon" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "mintAddress" TEXT,
    "tokenId" TEXT,
    "serialNumber" INTEGER,
    "ownerWallet" TEXT,
    "beneficiaryEmail" TEXT,
    "state" "CouponState" NOT NULL DEFAULT 'AVAILABLE',
    "redemptionCode" TEXT,
    "redemptionUrl" TEXT,
    "mintedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponTransfer" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "fromWallet" TEXT,
    "toWallet" TEXT NOT NULL,
    "txSignature" TEXT,
    "marketplace" TEXT,
    "transferredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouponTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeType" "BadgeType" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "metadataUrl" TEXT,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealInteraction" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "userId" TEXT,
    "couponId" TEXT,
    "type" "InteractionType" NOT NULL,
    "context" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealAnalytics" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalFavorites" INTEGER NOT NULL DEFAULT 0,
    "totalClaims" INTEGER NOT NULL DEFAULT 0,
    "totalRedemptions" INTEGER NOT NULL DEFAULT 0,
    "totalTransfers" INTEGER NOT NULL DEFAULT 0,
    "lastInteractionAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_slug_key" ON "Merchant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Deal_slug_key" ON "Deal"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_walletAddress_key" ON "UserProfile"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "DealAnalytics_dealId_key" ON "DealAnalytics"("dealId");

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealCoupon" ADD CONSTRAINT "DealCoupon_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponTransfer" ADD CONSTRAINT "CouponTransfer_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "DealCoupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealInteraction" ADD CONSTRAINT "DealInteraction_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealInteraction" ADD CONSTRAINT "DealInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealInteraction" ADD CONSTRAINT "DealInteraction_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "DealCoupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealAnalytics" ADD CONSTRAINT "DealAnalytics_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

