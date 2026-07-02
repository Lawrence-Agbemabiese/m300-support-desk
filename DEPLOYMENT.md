# Deployment Guide (Railway + PostgreSQL)

## Environment variables
Required:
- `DATABASE_URL` – PostgreSQL connection string
- `DIRECT_URL` – set equal to `DATABASE_URL` unless you have a separate direct migration URL
- `JWT_SECRET`
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `ANTHROPIC_API_KEY` (only if using enhance mode)

Optional / as used in code:
- `DEVELOPER_NAME`
- `DEVELOPER_EMAIL`
- `CLAUDE_DEFAULT_MODEL`
- `CLAUDE_ENHANCED_MODEL`

Do **not** commit `.env.local`; keep secrets in Railway.

## Railway deployment settings
- Railway config file: `railway.json`
- Build command: `npm run build`
- Pre-deploy command: `npm run prisma:migrate:deploy`
- Start command: `npm run start`
- Healthcheck path: `/login`

Important:
- The app is configured for Next.js standalone output.
- Railway should run migrations as a pre-deploy command before traffic shifts to the new release.

## Database setup on Railway
- Add a PostgreSQL service to the Railway project.
- In the app service, add reference variable `DATABASE_URL` from the PostgreSQL service.
- Also set `DIRECT_URL=${{DATABASE_URL}}` for Prisma migrations if no separate migration URL is provided.

## Durable production flow
1. Commit Prisma schema and migration files.
2. Push to the connected Railway service.
3. Railway builds the app with `npm run build`.
4. Railway runs `npm run prisma:migrate:deploy` before starting the new deployment.
5. Railway starts the app with `npm run start`.

This keeps app deploys and database migrations on the same platform and avoids the Vercel/Supabase connectivity problems that affected the previous setup.

## Pre-deploy checklist
- `npm run lint` (only existing warnings: useEffect deps in admin/projects pages)
- `npm run build` (passes)
- Confirm `prisma/migrations` present and `migration_lock.toml` provider is `postgresql`.

## Post-deploy smoke tests
- Submit a sample project on `/analyze`; verify policy, trade-offs, grants, coach, and PDF.
- Check Supabase `Project` table for new rows and `tradeoffsResult` populated.
