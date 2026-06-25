# Deploying Magic Dojo to the internet (Vercel)

The app currently runs on SQLite for local dev. To put it online you need a hosted
Postgres database (SQLite doesn't work on Vercel's serverless filesystem). Recommended
host: **Vercel** + **Vercel Postgres** (or Neon / Supabase — any Postgres works).

## What you need to provide
1. A **Vercel account** (free tier is fine) — https://vercel.com
2. A **Postgres database** — easiest is Vercel Postgres (created from the Vercel dashboard),
   which gives you a `DATABASE_URL` connection string.
3. (Optional) a **custom domain** you own.
4. (Optional, later) **Stripe API keys** if you want online card payments
   (PromptPay QR + bank transfer already work without any gateway).

## Steps
1. **Switch Prisma to Postgres** — in `web/prisma/schema.prisma` change:
   ```
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. **Push code to GitHub** (Vercel deploys from a Git repo).
3. In Vercel: **New Project → import the repo**. Set the project root/Root Directory to `web`.
4. Add **Environment Variables** in Vercel (Project → Settings → Environment Variables):
   - `DATABASE_URL` = your Postgres connection string
   - `AUTH_SECRET` = a long random string (`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)
5. **Create the tables + seed** against the production DB (run locally with the prod URL):
   ```
   cd web
   DATABASE_URL="<prod-postgres-url>" npx prisma db push
   DATABASE_URL="<prod-postgres-url>" npm run seed
   ```
   (On Windows PowerShell: `$env:DATABASE_URL="..."; npx prisma db push`)
6. **Deploy** (Vercel builds automatically on push). Visit the generated URL.
7. **Change the admin password** — log in as `admin@magicdojo.local` / `admin1234` and
   update it (or reseed with your own). Set your real **PromptPay number** and **bank details**
   in the `/admin` shop-settings panel.
8. (Optional) **Add your domain** in Vercel → Settings → Domains.

## Notes
- `postinstall` runs `prisma generate` automatically on Vercel.
- Card images come from Scryfall's CDN (`cards.scryfall.io`) — they load directly in the browser,
  no extra config needed.
- The seed pulls live prices from Scryfall; rerun `npm run seed` (or use the `/admin` fx panel's
  "fetch latest") to refresh pricing.
