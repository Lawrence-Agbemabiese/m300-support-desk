# Deployment Guide (Vercel + Supabase)

## Environment variables (set in Vercel)
Required:
- `DATABASE_URL` – Supabase pooled URL (pgbouncer)
- `DIRECT_URL` – Supabase direct URL (5432)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only; do **not** expose to client)
- `JWT_SECRET`
- `CRON_SECRET`
- `ANTHROPIC_API_KEY` (only if using enhance mode)

Optional / as used in code:
- Any other `SUPABASE_*` keys referenced via `process.env`.

Do **not** commit `.env.local`; keep secrets in Vercel and GitHub Actions.

## Build settings (Vercel)
- Framework: Next.js
- Install: `npm install`
- Build: `npm run build`
- Output: `.next`
- Node: 20 (matches Actions workflow)

## Database migrations (Supabase/Postgres)
- GitHub Action: `.github/workflows/prisma-deploy.yml`
  - Secrets required in GitHub repo settings:
    - `SUPABASE_DATABASE_URL` (pooled)
    - `SUPABASE_DIRECT_URL` (direct 5432)
  - Triggers: push to `main` or manual dispatch.
  - Runs `prisma migrate deploy` + `prisma generate` in `web/`.
- First-time prod deploy:
  1) Add GitHub secrets above.
  2) Trigger the workflow manually (“Deploy Prisma Migrations (Supabase)”).
  3) Deploy on Vercel; schema will already be in sync.

## Pre-deploy checklist
- `npm run lint` (only existing warnings: useEffect deps in admin/projects pages)
- `npm run build` (passes)
- Confirm `prisma/migrations` present and `migration_lock.toml` provider is `postgresql`.

## Post-deploy smoke tests
- Submit a sample project on `/analyze`; verify policy, trade-offs, grants, coach, and PDF.
- Check Supabase `Project` table for new rows and `tradeoffsResult` populated.
