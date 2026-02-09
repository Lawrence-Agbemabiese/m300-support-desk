# M300 Support Desk

Debt-Sensitive Grant Matching for African Energy Projects

## Overview

M300 Support Desk helps energy project developers in Africa identify appropriate grant funding opportunities while avoiding unsuitable debt instruments. The platform uses AI-powered analysis to match projects with funders based on the M300 Framework principles.

## Features

- **Project Analysis**: Submit project details and receive M300 policy alignment scoring
- **Grant Matching**: AI-powered matching against 38+ African energy funders
- **Proposal Coaching**: Generate grant proposal outlines with readiness checklists
- **Grant Discovery**: AI-powered search for new grant opportunities
- **Advisor Accounts**: Invite-only registration for authorized advisors
- **Project Tracking**: Track project status and add advisor notes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT-based with invite codes
- **AI**: Anthropic Claude API
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use SQLite for local dev)
- Anthropic API key

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/m300-support-desk.git
cd m300-support-desk/web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. For local development with SQLite, update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

And use this DATABASE_URL in .env.local:
```
DATABASE_URL="file:./dev.db"
```

5. Set up the database:
```bash
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

### Creating the First Admin

After setting up, create the first admin user:

```bash
# Register via the UI with any invite code, then run:
sqlite3 dev.db "UPDATE Advisor SET role = 'admin' WHERE email = 'your@email.com';"
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DIRECT_URL` | Yes | Direct PostgreSQL connection (for migrations) |
| `ANTHROPIC_API_KEY` | Yes | For AI features |
| `JWT_SECRET` | Yes | Secret for auth tokens |
| `CRON_SECRET` | Yes | Secret for scheduled searches |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL |

## License

Proprietary - All rights reserved
