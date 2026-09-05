# Production Deployment Guide (Railway + PostgreSQL)

Railway is the canonical production host for both the M300 web application and
its PostgreSQL database. Database migrations are run by the Railway web service
before a new release receives traffic. Do not configure a second migration
runner against this database.

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

Do **not** commit `.env.local` or copy production values into GitHub. Keep
production secrets in Railway.

## Railway deployment settings
- Railway config file: `railway.json`
- Build command: `npm run build`
- Pre-deploy command: `npm run prisma:migrate:deploy`
- Start command: `npm run start`
- Healthcheck path: `/login`

Important:
- The app is configured for Next.js standalone output.
- Railway runs migrations as a pre-deploy command before traffic shifts to the new release.
- A non-zero migration exit code stops the deployment.
- Set a pre-deploy timeout with enough headroom for migrations; 300 seconds is
  the initial recommendation for this application.

## Database setup on Railway
- Add a PostgreSQL service to the Railway project.
- In the app service, add reference variable `DATABASE_URL` from the PostgreSQL service.
- Also set `DIRECT_URL=${{DATABASE_URL}}` for Prisma migrations if no separate migration URL is provided.

## Durable production flow
1. Commit Prisma schema and migration files to a reviewed release branch.
2. Run CI and confirm the pull request is mergeable.
3. Create and verify a named Railway volume backup.
4. Confirm PITR is enabled and its recovery-time selector is available.
5. Merge the release branch into the Railway-connected production branch.
6. Railway builds the app with `npm run build`.
7. Railway runs `npm run prisma:migrate:deploy` before starting the release.
8. Railway starts the app with `npm run start` and checks `/login`.
9. Run the production smoke tests below.

This keeps application deployment and database migration on one platform and
avoids duplicate or out-of-order migration runners.

## Pre-deploy checklist
- `npm ci`
- `npm audit --omit=dev --audit-level=high`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- Confirm `prisma/migrations` is present and `migration_lock.toml` uses
  `provider = "postgresql"`.
- Confirm the Railway web service references the project PostgreSQL service for
  both `DATABASE_URL` and `DIRECT_URL`.
- Confirm a recent named volume backup is visible under Postgres > Backups.
- Confirm PITR is enabled and has a current recovery window.

## Backup and recovery policy

- Create a named on-demand volume backup immediately before any schema release.
- Keep PITR enabled for continuous WAL archiving and point-in-time recovery.
- Keep volume backups as independent recovery points; PITR does not replace
  them.
- Do not test restoration against the live Postgres service. Railway PITR
  creates a sibling Postgres service for recovery validation and later cutover.
- Record the backup timestamp and the release commit in the pull request.

## Post-deploy smoke tests
- Confirm `/login` loads over HTTPS.
- Sign in with a non-developer advisor account and open an existing project.
- Confirm legacy projects show revision 1 and retain their saved analysis.
- Create a sample project on `/analyze`; verify policy, trade-offs, grant
  matches, proposal coach output, and PDF generation.
- Edit and re-analyse the sample; confirm revision 2 is created and revision 1
  remains available.
- Search for the sample from `/projects` and confirm the vertical project list
  works on desktop and mobile widths.
- As an admin, confirm newly discovered grants are marked unverified until an
  official source is reviewed.
- In Railway Postgres, confirm the `ProjectRevision` table exists and the
  latest project has matching revision rows. Do not edit production rows.

## Rollback decision

If the pre-deploy migration fails, Railway does not release the new web image;
inspect the pre-deploy logs and leave production on the prior deployment. If a
successful migration causes a data problem, stop writes, note the target time,
and use Railway PITR to create a sibling recovery service. Validate the restored
data before changing any application connection string.
