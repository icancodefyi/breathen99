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
| `GMAIL_USER` | server only | Gmail / Google Workspace address that sends order emails (optional; emails skipped if unset) |
| `GMAIL_APP_PASSWORD` | server only | Google app password for that account (needs 2-Step Verification on) |
| `EMAIL_FROM` | server only | Optional sender, e.g. `breathEN <orders@breathen99.com>`; must be the Gmail address or a verified "Send mail as" alias |
| `ORDER_ALERT_EMAILS` | server only | Comma-separated founder emails that get a new-order alert |
| `ADMIN_PASSWORD` | server only | Admin login password, 12+ characters (admin disabled if unset) |
| `ADMIN_SESSION_SECRET` | server only | Signs admin session cookies, 32+ characters (`openssl rand -base64 48`) |

Never commit real values. `.env.local` is gitignored; set production values in Vercel.

**Blank values are safe.** Every secret is optional at build time and the app degrades gracefully:
no Razorpay keys means checkout shows "payments temporarily unavailable"; no Gmail means order emails are skipped with a
log warning; no admin password means `/admin` is disabled; no `NEXT_PUBLIC_SITE_URL` falls back to the Vercel URL. Once you
sign in at `/admin`, a **Setup needed** panel lists whatever is still blank.

> `NEXT_PUBLIC_*` values (the Razorpay key ID and site URL) are baked in at **build** time. If you add or change one in
> Vercel, trigger a redeploy.

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
docs/seo/         SEO audit, proposal and keyword plan (for the later SEO phase)
```

## How payments work

1. Browser sends only the customer details, quantity and coupon code to `POST /api/orders`.
2. The server recalculates the price from `src/config/pricing.ts` + the coupon in MongoDB, creates the Razorpay order, and stores the order as `created`.
3. After payment, `POST /api/orders/verify` checks the Razorpay signature and marks the order `paid`.
4. `POST /api/webhooks/razorpay` independently confirms payment (and rejects amount mismatches). It is the source of truth if the browser closes early.

## Emails

When a payment is confirmed (by the browser verify call or the webhook, whichever arrives first), the customer gets an order
confirmation and `ORDER_ALERT_EMAILS` get a new-order alert. Each email is claimed atomically in MongoDB, so it is sent at most
once even if both paths race; a failed send releases the claim so a later attempt can retry. Sending happens after the HTTP
response, and never blocks or fails a payment.

## Admin (`/admin`)

Password-protected orders dashboard: totals, search and filters, order detail, fulfilment status and notes, and CSV export
(replaces the old Google Sheet). Sessions are signed, `HttpOnly`, `SameSite=Strict` cookies that last 8 hours; login is rate
limited; state-changing requests must come from the site's own origin. Pages are `noindex` and `no-store`.

## Going live checklist

- [ ] Env vars set in Vercel
- [ ] Gmail app password created; `GMAIL_USER`, `GMAIL_APP_PASSWORD` and `ORDER_ALERT_EMAILS` set; one test order emailed
- [ ] `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` set (strong, unique)
- [ ] MongoDB user limited to the `breathen99` database only (do not reuse a shared-cluster admin login)
- [ ] Razorpay webhook -> `https://<domain>/api/webhooks/razorpay` (`payment.captured`, `order.paid`, `payment.failed`)
- [ ] Coupons created
- [ ] One test-mode payment on a preview deploy
- [ ] `CONFIRM` values in `src/config/legal.ts` reviewed; policy pages checked by legal
