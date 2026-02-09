/*
  Warnings:

  - You are about to drop the column `submittedBy` on the `Project` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Advisor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'advisor'
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "locationDescription" TEXT NOT NULL,
    "technologyType" TEXT NOT NULL,
    "capacityKw" REAL,
    "targetBeneficiaries" TEXT NOT NULL,
    "ownershipModel" TEXT NOT NULL,
    "productiveUses" TEXT NOT NULL,
    "estimatedCostUsd" REAL NOT NULL,
    "existingFunding" TEXT,
    "projectStage" TEXT NOT NULL,
    "communityEngagement" TEXT,
    "additionalContext" TEXT,
    "debtPreference" TEXT NOT NULL,
    "policyResult" TEXT,
    "grantsResult" TEXT,
    "coachResult" TEXT,
    "m300Score" INTEGER,
    "debtTier" TEXT,
    "topFunder" TEXT,
    "topFunderScore" INTEGER,
    "enhanced" BOOLEAN NOT NULL DEFAULT false,
    "processingTimeMs" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "advisorNotes" TEXT,
    "advisorId" TEXT,
    CONSTRAINT "Project_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Advisor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("additionalContext", "advisorNotes", "capacityKw", "coachResult", "communityEngagement", "country", "createdAt", "debtPreference", "debtTier", "enhanced", "estimatedCostUsd", "existingFunding", "grantsResult", "id", "locationDescription", "m300Score", "ownershipModel", "policyResult", "processingTimeMs", "productiveUses", "projectName", "projectStage", "status", "targetBeneficiaries", "technologyType", "topFunder", "topFunderScore", "updatedAt") SELECT "additionalContext", "advisorNotes", "capacityKw", "coachResult", "communityEngagement", "country", "createdAt", "debtPreference", "debtTier", "enhanced", "estimatedCostUsd", "existingFunding", "grantsResult", "id", "locationDescription", "m300Score", "ownershipModel", "policyResult", "processingTimeMs", "productiveUses", "projectName", "projectStage", "status", "targetBeneficiaries", "technologyType", "topFunder", "topFunderScore", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_email_key" ON "Advisor"("email");
