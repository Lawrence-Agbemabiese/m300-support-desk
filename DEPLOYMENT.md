# Deploying M300 Support Desk to Vercel

## Prerequisites

1. GitHub account
2. Vercel account (free tier available)
3. PostgreSQL database (Vercel Postgres, Neon, or Supabase)

## Step 1: Set Up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)
1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Create a new Postgres database
3. Copy the `POSTGRES_PRISMA_URL` connection string

### Option B: Neon (Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

## Step 2: Update Prisma Schema for Production

Before deploying, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 3: Push to GitHub

```bash
git init  # if not already a git repo
git add .
git commit -m "Prepare for deployment"
git remote add origin https://github.com/YOUR_USERNAME/m300-support-desk.git
git push -u origin main
```

## Step 4: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `JWT_SECRET` | A secure random string (32+ chars) |
| `CRON_SECRET` | A secure random string for cron jobs |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g., https://m300.vercel.app) |

4. Click "Deploy"

## Step 5: Initialize Database

After first deployment, run migrations:

```bash
npx vercel env pull .env.production.local
npx prisma db push
```

Or use Vercel's build command override:
```
prisma generate && prisma db push && next build
```

## Step 6: Create Admin User

After deployment, you'll need to create the first admin manually:

1. Register normally with an invite code (you'll need to create one directly in DB first)
2. Or run this SQL on your database:

```sql
-- Create first invite
INSERT INTO "Invite" (id, code, "createdBy", "maxUses", "useCount", "createdAt")
VALUES ('initial', 'ADMIN2024', 'system', 1, 0, NOW());

-- After registering, update your account to admin
UPDATE "Advisor" SET role = 'admin' WHERE email = 'your@email.com';
```

## Step 7: Set Up Scheduled Searches (Optional)

To run periodic grant searches, add a Vercel Cron job:

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/grants/scheduled-search",
      "schedule": "0 6 * * *"
    }
  ]
}
```

The cron job is protected by the `CRON_SECRET` header.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Yes | For AI-powered grant discovery |
| `JWT_SECRET` | Yes | Secret for signing auth tokens |
| `CRON_SECRET` | Yes | Secret for scheduled search endpoint |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of your deployment |

## Troubleshooting

### "Cannot find module '@prisma/client'"
Run `npx prisma generate` before building.

### Database connection errors
- Ensure `DATABASE_URL` includes `?sslmode=require` for cloud databases
- Check that your IP is whitelisted (if using Neon)

### Invite system not working
- Ensure the Invite table exists: `npx prisma db push`
- Check that you're logged in as admin to create invites
