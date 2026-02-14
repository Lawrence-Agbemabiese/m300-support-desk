-- Ensure tradeoffsResult column exists for policy trade-off explorer output
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "tradeoffsResult" TEXT;
