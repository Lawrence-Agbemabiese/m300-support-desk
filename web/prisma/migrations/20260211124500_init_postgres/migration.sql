-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT NOT NULL,
    "email" TEXT,
    "createdBy" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "usedBy" TEXT,
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "useCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscoveredGrant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "funderName" TEXT NOT NULL,
    "instrumentType" TEXT,
    "geographyFocus" TEXT,
    "thematicFocus" TEXT,
    "ticketSizeMin" DOUBLE PRECISION,
    "ticketSizeMax" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "sourceUrl" TEXT,
    "discoveredBy" TEXT NOT NULL,
    "searchQuery" TEXT,
    "confidence" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "approvedGrantId" TEXT,

    CONSTRAINT "DiscoveredGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantSearch" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "query" TEXT NOT NULL,
    "region" TEXT,
    "resultsCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "error" TEXT,
    "triggeredBy" TEXT,

    CONSTRAINT "GrantSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advisor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'advisor',

    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "locationDescription" TEXT NOT NULL,
    "technologyType" TEXT NOT NULL,
    "capacityKw" DOUBLE PRECISION,
    "targetBeneficiaries" TEXT NOT NULL,
    "ownershipModel" TEXT NOT NULL,
    "productiveUses" TEXT NOT NULL,
    "estimatedCostUsd" DOUBLE PRECISION NOT NULL,
    "existingFunding" TEXT,
    "projectStage" TEXT NOT NULL,
    "communityEngagement" TEXT,
    "additionalContext" TEXT,
    "debtPreference" TEXT NOT NULL,
    "policyResult" TEXT,
    "grantsResult" TEXT,
    "coachResult" TEXT,
    "tradeoffsResult" TEXT,
    "m300Score" INTEGER,
    "debtTier" TEXT,
    "topFunder" TEXT,
    "topFunderScore" INTEGER,
    "enhanced" BOOLEAN NOT NULL DEFAULT false,
    "processingTimeMs" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "advisorNotes" TEXT,
    "advisorId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_code_key" ON "Invite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_email_key" ON "Advisor"("email");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

