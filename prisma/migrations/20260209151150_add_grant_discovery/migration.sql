-- CreateTable
CREATE TABLE "DiscoveredGrant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "funderName" TEXT NOT NULL,
    "instrumentType" TEXT,
    "geographyFocus" TEXT,
    "thematicFocus" TEXT,
    "ticketSizeMin" REAL,
    "ticketSizeMax" REAL,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "sourceUrl" TEXT,
    "discoveredBy" TEXT NOT NULL,
    "searchQuery" TEXT,
    "confidence" REAL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "approvedGrantId" TEXT
);

-- CreateTable
CREATE TABLE "GrantSearch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "query" TEXT NOT NULL,
    "region" TEXT,
    "resultsCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "error" TEXT,
    "triggeredBy" TEXT
);
