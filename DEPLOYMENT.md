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
- Build: `npm run build:vercel`
- Output: `.next`
- Node: 20 (matches Actions workflow)

Important:
- Vercel should only generate the Prisma client and build the app.
- Do not run `prisma migrate deploy` inside the Vercel build. Production migrations run in GitHub Actions instead.

## Database migrations (Supabase/Postgres)
- GitHub Action: `.github/workflows/prisma-deploy.yml`
  - Secrets required in GitHub repo settings:
    - `SUPABASE_DATABASE_URL` (pooled)
    - `SUPABASE_DIRECT_URL` (direct 5432)
  - Triggers:
    - automatically on pushes to `main` that touch `prisma/**`, `package.json`, `package-lock.json`, or the workflow itself
    - manually via workflow dispatch when you need to re-run production migrations
  - Runs `prisma validate`, `prisma migrate deploy`, and `prisma generate` from the app repo root.
- First-time prod deploy:
  1) Add GitHub secrets above.
  2) Trigger the workflow manually (“Deploy Prisma Migrations (Supabase)”).
  3) Deploy on Vercel; schema will already be in sync.

## Durable production flow
1. Commit Prisma schema and migration files.
2. Push to `main`.
3. Let GitHub Actions apply migrations against Supabase.
4. Let Vercel build with `npm run build:vercel`.

This separation keeps production reliable because Vercel no longer depends on direct database reachability during the build.

## Pre-deploy checklist
- `npm run lint` (only existing warnings: useEffect deps in admin/projects pages)
- `npm run build` (passes)
- Confirm `prisma/migrations` present and `migration_lock.toml` provider is `postgresql`.

## Post-deploy smoke tests
- Submit a sample project on `/analyze`; verify policy, trade-offs, grants, coach, and PDF.
- Check Supabase `Project` table for new rows and `tradeoffsResult` populated.
