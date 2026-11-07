# breathEN website

Marketing site and checkout for **breathEN** (breathen99.com). Next.js 16 (App Router) + React 19, MongoDB, Razorpay, deployed on Vercel.

## Quick start

```bash
nvm use                 # Node 22
npm ci
cp .env.example .env.local   # then fill in the values
npm run dev             # http://localhost:3000
```

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | Canonical site URL (metadata, OG images) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | public | Razorpay key id (safe to expose) |
| `MONGODB_URI` | server only | MongoDB Atlas connection string |
| `MONGODB_DB` | server only | Database name (default `breathen99`) |
| `RAZORPAY_KEY_SECRET` | server only | Verifies payment signatures, creates orders |
| `RAZORPAY_WEBHOOK_SECRET` | server only | Verifies Razorpay webhooks |

Never commit real values. `.env.local` is gitignored; set production values in Vercel.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Run, build, serve |
| `npm run lint` / `format` / `format:check` | ESLint, Prettier |
| `npm run typecheck` | TypeScript |
| `npm test` | Vitest |
| `npm run coupon:create -- CODE PCT [limit] [expiryISO]` | Create or update a coupon in MongoDB |

CI (`.github/workflows/ci.yml`) runs lint, format check, typecheck, tests, audit and build on every push and PR.

## Project structure

```
src/
  app/            Routes: landing, /checkout, /thankyou, legal pages, /api/*
  components/     home/ (landing sections), layout/, sections/, checkout/, ui/
  config/         site.ts, pricing.ts, legal.ts, states.ts
  content/        Landing-page copy (edit text here)
  lib/            env, db/mongo, pricing, validation, http, signatures
  server/         models/ (collections) and services/ (orders, coupons, razorpay, rate-limit)
scripts/          CLI helpers
```

## How payments work

1. Browser sends only the customer details, quantity and coupon code to `POST /api/orders`.
2. The server recalculates the price from `src/config/pricing.ts` + the coupon in MongoDB, creates the Razorpay order, and stores the order as `created`.
3. After payment, `POST /api/orders/verify` checks the Razorpay signature and marks the order `paid`.
4. `POST /api/webhooks/razorpay` independently confirms payment (and rejects amount mismatches). It is the source of truth if the browser closes early.

## Going live checklist

- [ ] Env vars set in Vercel
- [ ] Razorpay webhook -> `https://<domain>/api/webhooks/razorpay` (`payment.captured`, `order.paid`, `payment.failed`)
- [ ] Coupons created
- [ ] One test-mode payment on a preview deploy
- [ ] `CONFIRM` values in `src/config/legal.ts` reviewed; policy pages checked by legal
