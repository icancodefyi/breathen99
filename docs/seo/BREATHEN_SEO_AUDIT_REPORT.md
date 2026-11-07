# breathEN Website — SEO Audit Report

**Client:** Breathen99 (Portable Oxygen Canister)  
**Repository:** github.com/Trippyshetty/Breathen99.git  
**Audit Date:** 16 June 2026  
**Auditor:** Technical SEO Consultant

---

## Table of Contents

1. [Technical Architecture](#1-technical-architecture)
2. [Technical SEO Audit](#2-technical-seo-audit)
3. [On-Page SEO Audit](#3-on-page-seo-audit)
4. [Content Strategy Analysis](#4-content-strategy-analysis)
5. [Performance Audit](#5-performance-audit)
6. [Conversion Rate Optimisation](#6-conversion-rate-optimisation)
7. [Competitiveness Assessment](#7-competitiveness-assessment)
8. [Executive Summary](#8-executive-summary)

---

## Executive Snapshot

| Area | Score | Summary |
|------|-------|---------|
| Technical Architecture | **2 / 10** | Static brochure; not scalable for SEO growth |
| Technical SEO | **3 / 10** | Missing canonical, sitemap, robots, schema, OG fixes |
| On-Page SEO | **4 / 10** | Single page carries all intent; weak keyword targeting |
| Content Strategy | **2 / 10** | No blog, no landing pages, no content moat |
| Performance | **3 / 10** | Heavy animations, unoptimised images, blocking resources |
| Conversion Rate Optimisation | **5 / 10** | Decent UX, missing trust layers and upsell |
| **Overall SEO Readiness** | **33 / 100** | **Significant SEO Rebuild Recommended** |

---

## 1. Technical Architecture

### Current Structure

The site is a **plain static HTML/CSS/JS brochure** with no framework, build pipeline, templating, or content management system.

**Files audited:**

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| `index.html` | 639 | 39 KB | Single-page homepage (all content in one file) |
| `checkout.html` | 1,058 | 36 KB | Order form with embedded CSS/JS |
| `thankyou.html` | 316 | 8.4 KB | Post-purchase confirmation |
| `css/style.css` | 1,590 | 53 KB | Global stylesheet |
| `js/main.js` | 441 | 21 KB | Animations, UI interactions |
| `code.gs` | 283 | — | Google Apps Script backend |
| `netlify.toml` | 2 | — | Only sets publish directory |

### Key Findings

- **No component reuse.** Navigation, logo bar, footer, floating CTAs, and mobile buy bar are duplicated as raw HTML across pages. Updating a phone number or nav link requires editing every file by hand.
- **No CMS.** Every new page requires hand-coding HTML. No markdown support, no templating, no data layer. Adding a blog is impractical.
- **Deployment is manual drag-and-drop** (`setup_guide.md:152-156`). No CI/CD, no branch previews, no automated testing.
- **No build step.** No CSS/JS minification, bundling, or optimisation. No image pipeline. No linting.
- **Config in public repo.** Live Razorpay Key ID (`checkout.html:492`), Google Apps Script URL (`checkout.html:497`), and Sheet ID (`code.gs:21`) are hardcoded.

### Scalability Assessment

| Scenario | Difficulty | Reason |
|----------|------------|--------|
| Adding 5 landing pages | Medium | Requires copy-pasting index.html, editing sections, fixing internal links |
| Adding 50 landing pages | Very High | No templating, no CMS, no automation |
| Adding a blog | Extremely High | No article template, author schema, RSS, pagination, or categories |
| A/B testing | Impractical | No component-level control, no data layer |
| Localisation / i18n | Impractical | Would need to duplicate every page per language |

### Recommendation

Migrate to a modern framework (Next.js, Astro) with a headless CMS (Sanity, Strapi, Contentful) or WordPress. This is necessary before any aggressive SEO content programme.

### Score: **2 / 10**

---

## 2. Technical SEO Audit

### What is Present

- `index.html:6` — Title tag (well-written, ~70 chars)
- `index.html:7` — Meta description (descriptive, ~190 chars)
- `index.html:9-12` — Basic Open Graph tags
- `index.html:79` — One `<h1>` tag
- `index.html` — Logical heading hierarchy (`h1` → `h2` → `h3`/`h4`)
- Most images have `alt` attributes
- `loading="lazy"` on below-fold images

### What is Missing — Critical Issues

| Element | Status | Evidence | Impact |
|---------|--------|----------|--------|
| **Canonical tag** | ❌ Missing on all pages | No `<link rel="canonical">` anywhere | Duplicate content risk (Netlify serves `/` and `/index.html`) |
| **Sitemap.xml** | ❌ Missing | No sitemap file | Google cannot discover all pages efficiently |
| **Robots.txt** | ❌ Missing | No directives | Crawl budget not managed; `thankyou.html` with params can be indexed |
| **Structured data** | ❌ Missing entirely | No JSON-LD | No rich snippets for Product, FAQ, HowTo, Breadcrumb, Organisation |
| **Twitter Cards** | ❌ Missing | No `twitter:` meta tags | Poor social sharing on X/Twitter |
| **Open Graph image** | ⚠️ Relative URL | `index.html:11` uses `assets/product.png` | Social platforms need absolute URLs (`https://…`) |
| **OG on checkout/thankyou** | ❌ Missing | No OG tags on these pages | Broken social previews |
| **Meta keywords** | ⚠️ Present but harmful | `index.html:8` | Google ignores it; marks site as dated SEO |
| **Robots meta** | ❌ Missing | `thankyou.html` should be `noindex` | PayPal/transactional pages indexed with params |
| **Hreflang** | ❌ Missing | `<html lang="en">` only | India market should signal `en-IN` |
| **Breadcrumbs** | ❌ Missing | No breadcrumb nav or schema | Poor navigation UX and missed SERP feature |
| **Internal linking** | ❌ Very weak | Only anchor links + link to checkout | No topical depth, no content hub |
| **URL structure** | ⚠️ Suboptimal | `.html` extensions (`checkout.html`) | Clean slugs (`/buy/`) preferred |

### Heading Hierarchy Audit

| Page | h1 count | Issues |
|------|----------|--------|
| `index.html` | 1 | "Comfortable Breathing. Anytime. Anywhere." — not keyword-optimised |
| `checkout.html` | **0** | No primary heading at all |
| `thankyou.html` | 1 | "Thank you, friend!" — acceptable for confirmation |

### Score: **3 / 10**

---

## 3. On-Page SEO Audit

### Keyword Targeting Analysis

The homepage tries to rank for **every use case simultaneously**: fitness, travel, altitude, pollution, stress, elderly care, fire safety, office workers. This spreads topical relevance thin.

**What the title targets** (`index.html:6`):
> "breathEN — World's First Nose Breathing Oxygen Canister | 99% Pure Oxygen"

**What the h1 targets** (`index.html:79`):
> "Comfortable Breathing. Anytime. Anywhere."

The h1 is brand/promise focused rather than keyword focused — a missed opportunity.

### Search Intent Alignment

| Use Case | Current Coverage | Gap |
|----------|-----------------|-----|
| High altitude / Kedarnath / Ladakh | Single card in `index.html:202-216` | No dedicated landing page |
| Fitness / gym recovery | Single card in `index.html:270-284` | No comparison vs energy drinks/pre-workout |
| Elderly / breathlessness | Single card in `index.html:219-233` | No medically-disclaimed educational guide |
| Fire safety / first responders | Single card in `index.html:236-250` | No B2B page |
| Pollution relief | Mentioned in hero + about | No city-specific pages |
| Office productivity / indoor air | Single card in `index.html:253-266` | No corporate wellness page |

### Content Depth Assessment

- The homepage has moderate depth (hero, about, benefits, how-to, FAQ, testimonials) but it is **one long scroll** — not an interconnected content ecosystem.
- FAQ section (`index.html:491-545`) is strong; would generate featured snippets if marked up with `FAQPage` schema.
- **No blog, no guides, no comparison pages, no glossary, no case studies.**

### Realistic Ranking Potential

| Can rank for (current structure) | Cannot rank for (need rebuild) |
|----------------------------------|--------------------------------|
| Brand terms: "breathEN" | "oxygen cylinder" / "medical oxygen" |
| "nose breathing oxygen canister" | "best portable oxygen canister in India" |
| "recreational oxygen canister India" | "oxygen canister for asthma" (needs EEAT) |
| "oxygen canister for altitude sickness" | City queries ("oxygen canister Mumbai") |
| Long-tail FAQ queries | "buy oxygen canister online" (high competition) |

### Score: **4 / 10**

---

## 4. Content Strategy Analysis

### Current Content Gaps

| Area | Status | Detail |
|------|--------|--------|
| **Blog / editorial hub** | ❌ Missing | Zero articles |
| **Comparison pages** | ❌ Missing | No breathEN vs Boost Oxygen vs cylinder |
| **Use-case landing pages** | ❌ Missing | No dedicated page for any use case |
| **Location pages** | ❌ Missing | No city, pilgrimage, or trekking pages |
| **Customer case studies** | ⚠️ Weak | 4 short testimonials only |
| **B2B / bulk content** | ❌ Missing | No corporate page |
| **Glossary / educational** | ❌ Missing | No definitions of SpO₂, recreational oxygen etc. |
| **Downloadable assets** | ❌ Missing | No checklists, guides, or PDFs |

### 20 Content Ideas

1. What is recreational oxygen and is it safe?
2. How to use a portable oxygen canister correctly
3. Oxygen canister vs oxygen cylinder: what's the difference?
4. Can oxygen cans help with altitude sickness? (Kedarnath, Ladakh, Sikkim)
5. Best breathing techniques for athletes and gym-goers
6. Why indoor air quality drains productivity (and how oxygen helps)
7. Oxygen support for elderly parents: a family guide
8. Fire safety and emergency oxygen: why first responders use breathEN
9. Pollution relief: using oxygen cans in Delhi/Mumbai/Bangalore smog
10. Trekking checklist: essential gear for high-altitude travel
11. Post-COVID fatigue and oxygen support: what to know
12. Yoga, pranayama and nasal breathing: how breathEN fits
13. Corporate wellness: oxygen stations for offices and gyms
14. How long does a 99% oxygen canister last?
15. Can you travel with an oxygen canister on flights/trains in India?
16. Understanding SpO₂ levels and when supplemental oxygen helps
17. Are oxygen canisters recyclable? Sustainability guide
18. Customer story: SS Patil fire officer case study
19. Customer story: Rabiya Bi senior citizen case study
20. BreathEN FAQ deep-dive: medical disclaimers, safety, dosage

### 20 Landing Page Ideas

1. /buy-oxygen-canister-online-india/
2. /oxygen-canister-for-kedarnath/
3. /oxygen-canister-for-ladakh/
4. /oxygen-canister-for-sikkim/
5. /oxygen-canister-for-delhi-pollution/
6. /oxygen-canister-for-mumbai-pollution/
7. /oxygen-canister-for-gym-recovery/
8. /oxygen-canister-for-athletes/
9. /oxygen-canister-for-senior-citizens/
10. /oxygen-canister-for-asthma-support/
11. /oxygen-canister-for-copd-support/
12. /oxygen-canister-for-fire-safety/
13. /oxygen-canister-for-corporate-wellness/
14. /oxygen-canister-for-office-workers/
15. /oxygen-canister-for-yoga-pranayama/
16. /bulk-order-oxygen-canisters/
17. /oxygen-canister-vs-oxygen-cylinder/
18. /oxygen-canister-vs-boost-oxygen/
19. /first-responder-oxygen-kit/
20. /travel-oxygen-canister-india/

### Keyword Clusters

| Cluster | Core Keywords | Priority |
|---------|---------------|----------|
| **Brand** | breathEN, breathEN oxygen, breathEN canister | High (already ownable) |
| **Product type** | portable oxygen canister, recreational oxygen, 99% oxygen can | High |
| **Use-case** | oxygen canister for gym, trekking, altitude, pollution, elderly | High |
| **Location** | oxygen canister Mumbai, Delhi, Bangalore, Kedarnath, Ladakh | Medium-High |
| **Comparison** | oxygen canister vs cylinder, breathEN vs Boost Oxygen | Medium |
| **Medical-adjacent** | oxygen for shortness of breath, COPD support, asthma support | Medium (requires disclaimers) |
| **B2B** | bulk oxygen canisters, corporate oxygen, fire safety oxygen | Medium |

### Estimated SEO Growth Potential

- **With current structure:** Organic traffic plateaus at brand + a handful of long-tail queries within 3–6 months (~500–2,000 monthly visits).
- **With rebuild + content programme:** Realistic 12-month opportunity of **20,000–60,000 monthly organic visits** in the Indian oxygen/wellness niche, depending on link-building velocity.

### Score: **2 / 10**

---

## 5. Performance Audit

### Asset Sizes

| File | Size | Note |
|------|------|------|
| `css/style.css` | 53 KB | 1,590 lines; blocks render |
| `js/main.js` | 21 KB | Contains continuous animation loops |
| `assets/product.png` | 526 KB | LCP image; PNG not optimised |
| `assets/lifestyle-trek.webp` | 245 KB | Could be compressed further |
| `assets/benefits-1.jpg` | 196 KB | JPEG, no srcset |
| `assets/person-using.jpg` | 188 KB | Used twice on the page |
| **Total first-visit weight** | **~1.2 MB+** | Before GSAP/CDN assets |

### CSS Issues

- `css/style.css:1` loads Google Fonts via `@import` **after** `index.html:15-16` already loads the same fonts via `<link>`. This duplicates a render-blocking request.
- Stylesheet is 53 KB and blocks first paint.
- Many continuous keyframe animations run forever (`marqueeScroll`, `orbitSpin`, `blink`, `scrollPulse`, `ctaPulse`).

### JavaScript Issues

- `index.html:19-21` loads GSAP core, ScrollTrigger, and ScrollToPlugin from CDN in `<head>` **without `defer` or `async`** — blocks HTML parsing.
- `js/main.js:128-214` runs three continuous `requestAnimationFrame` loops (particles, god rays, molecule) that never stop — drains CPU and battery.
- `js/main.js:221-223` adds perpetual GSAP float/rotation animations.
- **No `prefers-reduced-motion` query** — site is inaccessible for users with vestibular disorders.
- Loading curtain (`js/main.js:8-20`) blocks content until `window.load` or 3-second timeout, delaying Largest Contentful Paint.

### Image Issues

- `assets/product.png` (526 KB) is the LCP candidate — should be WebP/AVIF at 80–120 KB.
- No `width`/`height` on the product image (`index.html:118`) — risk of Cumulative Layout Shift.
- Preload hints (`index.html:16-17`) lack `fetchpriority="high"` on the LCP image.
- No `srcset` or responsive images anywhere.
- Multiple images use `object-fit: contain` with grey backgrounds — can cause layout shifts when container dimensions vary.

### Accessibility

- Mobile nav has proper `aria-label`, `aria-expanded`, `aria-controls` — good.
- Focus-visible styles present (`css/style.css:1429-1433`).
- **No "Skip to content" link.**
- **No reduced-motion support.**
- Loading curtain has no accessible loading indicator text.

### Core Web Vitals Risk Summary

| Metric | Risk Level | Cause |
|--------|-----------|-------|
| **LCP** | High | Large hero PNG, loading curtain, render-blocking resources |
| **INP** | High | Continuous canvas/GSAP animations on main thread |
| **CLS** | Medium-High | No width/height on images, layout shifts from reveal animations |
| **TTFB** | Low | Static host; no dynamic backend latency |

### Score: **3 / 10**

---

## 6. Conversion Rate Optimisation

### What's Working

- Sticky mobile buy bar (`index.html:616-622`) keeps CTA always visible.
- Two CRO strips between sections (`index.html:130-133`, `index.html:421-424`).
- Trust items under hero (`index.html:99-104`).
- Testimonials with specific personas (fire officer, senior citizen, evacuee) — `index.html:445-486`.
- FAQ accordion addresses common objections (`index.html:491-545`).
- Checkout has quantity stepper, bulk discount tiers, coupon system, and live price calculation.

### What's Missing — Friction Points

| Issue | Location | Impact |
|-------|----------|--------|
| No money-back guarantee or return policy | Not on any page | Reduces buyer confidence |
| No payment method icons (UPI, cards, netbanking) | `checkout.html` | Users want to see payment options |
| No privacy policy or terms & conditions | Not in footer or checkout | Legal gap for Indian e-commerce |
| No checkout progress indicator | `checkout.html` | Users don't know how close they are to finishing |
| No abandoned-cart recovery | Not implemented | Lost revenue from drop-offs |
| No post-purchase upsell or referral | `thankyou.html` only offers Instagram follow | Missed LTV opportunity |
| No social-proof counters ("X sold today") | None on any page | Missed urgency trigger |
| No product comparison | Not present | Hard to justify purchase without alternatives |
| No email newsletter signup | Not present | Cannot retarget or build relationships |
| Thank-you page not noindexed | `thankyou.html` | Can be indexed with payment query params |

### Score: **5 / 10**

---

## 7. Competitiveness Assessment

### Classification

**Significant SEO Rebuild Recommended**

### Justification

1. **Architecture cannot support SEO growth.** A single static HTML page cannot capture the dozens of keyword clusters required in the portable oxygen niche.
2. **No content moat.** Competitors with blogs, comparison pages, and city landing pages will outrank breathEN for every non-brand query.
3. **Technical SEO basics are missing.** Canonical, sitemap, robots, structured data, and clean URLs are absent.
4. **Performance will fail Core Web Vitals** on budget mobile devices due to continuous animations and unoptimised images.
5. **CRO is acceptable** but not strong enough to compensate for low organic reach.

### What Is Needed

| Priority | Action | Timeline |
|----------|--------|----------|
| 🚨 Critical | Add canonical, sitemap, robots, and structured data | 1 week |
| 🚨 Critical | Fix OG image to absolute URL; add Twitter Cards | 1 day |
| 🚨 Critical | Optimise LCP image (WebP + dimensions + fetchpriority) | 2 days |
| 🚨 Critical | Defer non-critical JS; remove duplicate font @import | 1 day |
| 🚨 Critical | Add `noindex` to thankyou.html | 1 hour |
| 📈 High | Migrate to CMS + framework (Next.js/Astro + Sanity/WordPress) | 4–6 weeks |
| 📈 High | Launch 20 landing pages | 4 weeks |
| 📈 High | Add FAQPage, Product, Organisation, BreadcrumbList schema | 1 week |
| 📈 Medium | Launch blog / content hub | Ongoing |
| 📈 Medium | Implement `prefers-reduced-motion` | 1 day |
| 📈 Medium | Add CRO improvements (guarantee, payment icons, progress bar) | 1 week |
| 📈 Low | Remove .html from URLs via Netlify redirects | 1 hour |
| 📈 Low | Add analytics + conversion tracking | 1 day |

---

## 8. Executive Summary

### Top 10 Critical Issues

| # | Issue | File Reference | Severity |
|---|-------|----------------|----------|
| 1 | No CMS — static architecture cannot scale | All files | 🔴 |
| 2 | No canonical tags | All pages | 🔴 |
| 3 | No sitemap.xml or robots.txt | Missing files | 🔴 |
| 4 | Zero structured data (Product, FAQ, Breadcrumb, Organisation) | `index.html` | 🔴 |
| 5 | Open Graph image uses relative URL | `index.html:11` | 🔴 |
| 6 | LCP image is 526 KB PNG with no width/height | `assets/product.png`, `index.html:118` | 🔴 |
| 7 | GSAP + Google Fonts render-blocking in head | `index.html:15-21` | 🔴 |
| 8 | Continuous canvas/GSAP animations drain main thread | `js/main.js:128-223` | 🔴 |
| 9 | Loading curtain delays LCP by up to 3 seconds | `js/main.js:8-20` | 🔴 |
| 10 | Thank-you page can be indexed with payment params | `thankyou.html` | 🔴 |

### Top 10 Quick Wins

| # | Action | Estimated Time |
|---|--------|----------------|
| 1 | Add `<link rel="canonical" href="https://breathen99.com/">` to all pages | 15 min |
| 2 | Create `robots.txt` with sitemap reference + noindex thankyou | 30 min |
| 3 | Create `sitemap.xml` listing all 3 pages | 20 min |
| 4 | Add `FAQPage` + `Product` + `Organisation` + `BreadcrumbList` JSON-LD | 2 hours |
| 5 | Fix OG image to `https://breathen99.com/assets/product.png` + add Twitter Cards | 30 min |
| 6 | Add `async`/`defer` to all script tags in head; move non-critical to footer | 30 min |
| 7 | Remove `@import` font in `css/style.css:1` (fonts already loaded via `<link>`) | 5 min |
| 8 | Add `width`/`height` to product image + `fetchpriority="high"` | 15 min |
| 9 | Add `prefers-reduced-motion` media query to disable animations | 30 min |
| 10 | Convert `product.png` to WebP/AVIF (526 KB → ~100 KB) | 20 min |

### Estimated Effort

| Workstream | Effort |
|------------|--------|
| **Technical SEO fixes** (canonical, sitemap, robots, schema, OG) | 2–3 days |
| **Performance fixes** (images, defer, animations, fonts) | 3–5 days |
| **CRO improvements** (guarantee, payment icons, progress bar) | 1–2 weeks |
| **CMS + framework rebuild** (Next.js/Astro + headless CMS) | 4–6 weeks |
| **Content programme** (20 landing pages + 20 blog posts) | 3–4 months |
| **Link building / PR / partnerships** | Ongoing (6–12 months) |

### Final Verdict

**breathEN has an attractive, conversion-oriented homepage, but it is not built for SEO growth.** The current codebase is a brochure, not an organic-growth engine. To compete for "oxygen canister" queries in India, the site needs a **framework rebuild, a CMS, structured data, image/animation performance fixes, and a sustained content + link-building programme**.

**SEO Readiness Score: 33 / 100**
**Recommendation: Significant SEO Rebuild Recommended**
