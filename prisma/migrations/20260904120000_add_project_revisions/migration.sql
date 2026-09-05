ALTER TABLE "Project" ADD COLUMN "technologyOther" TEXT, ADD COLUMN "ownershipOther" TEXT, ADD COLUMN "contactInfo" TEXT, ADD COLUMN "readinessEvidence" TEXT, ADD COLUMN "currentRevision" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "DiscoveredGrant" ADD COLUMN "verificationStatus" TEXT NOT NULL DEFAULT 'unverified';

CREATE TABLE "ProjectRevision" (
  "id" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revisionNumber" INTEGER NOT NULL, "source" TEXT NOT NULL DEFAULT 'reanalysis',
  "intakeSnapshot" TEXT NOT NULL, "policyResult" TEXT, "grantsResult" TEXT, "coachResult" TEXT, "tradeoffsResult" TEXT,
  "enhanced" BOOLEAN NOT NULL DEFAULT false, "model" TEXT, "processingTimeMs" INTEGER,
  "projectId" TEXT NOT NULL, "createdByAdvisorId" TEXT,
  CONSTRAINT "ProjectRevision_pkey" PRIMARY KEY ("id")
);

INSERT INTO "ProjectRevision" ("id", "createdAt", "revisionNumber", "source", "intakeSnapshot", "policyResult", "grantsResult", "coachResult", "tradeoffsResult", "enhanced", "processingTimeMs", "projectId", "createdByAdvisorId")
SELECT "id" || '_revision_1', "createdAt", 1, 'legacy_backfill',
  jsonb_build_object('project_name', "projectName", 'country', "country", 'location_description', "locationDescription", 'technology_type', "technologyType", 'capacity_kw', "capacityKw", 'target_beneficiaries', "targetBeneficiaries", 'ownership_model', "ownershipModel", 'productive_uses', COALESCE("productiveUses"::jsonb, '[]'::jsonb), 'estimated_cost_usd', "estimatedCostUsd", 'existing_funding', "existingFunding", 'project_stage', "projectStage", 'community_engagement', "communityEngagement", 'additional_context', "additionalContext", 'debt_preference', "debtPreference")::text,
  "policyResult", "grantsResult", "coachResult", "tradeoffsResult", "enhanced", "processingTimeMs", "id", "advisorId" FROM "Project";

CREATE UNIQUE INDEX "ProjectRevision_projectId_revisionNumber_key" ON "ProjectRevision"("projectId", "revisionNumber");
CREATE INDEX "ProjectRevision_projectId_createdAt_idx" ON "ProjectRevision"("projectId", "createdAt");
CREATE INDEX "ProjectRevision_createdByAdvisorId_idx" ON "ProjectRevision"("createdByAdvisorId");
CREATE INDEX "Project_advisorId_createdAt_idx" ON "Project"("advisorId", "createdAt");
CREATE INDEX "Project_status_createdAt_idx" ON "Project"("status", "createdAt");
ALTER TABLE "ProjectRevision" ADD CONSTRAINT "ProjectRevision_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectRevision" ADD CONSTRAINT "ProjectRevision_createdByAdvisorId_fkey" FOREIGN KEY ("createdByAdvisorId") REFERENCES "Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Server-only Prisma access; no public Data API policies.
ALTER TABLE "Invite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DiscoveredGrant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GrantSearch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Advisor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectRevision" ENABLE ROW LEVEL SECURITY;
