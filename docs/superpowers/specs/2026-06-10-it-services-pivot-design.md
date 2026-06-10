# Strategic Sync → IT Services Pivot

**Date:** 2026-06-10
**Goal:** Re-position strategicsync.com from "AI automation/integration" to an Orange County IT services company (computer repair, networking/WiFi, IT support, smart home & security cameras) to back a new Thumbtack profile. Keep the Strategic Sync name, domain, phone, and the existing industrial-editorial design system. Keep AI as ONE service offering, not the headline.

## Decisions (locked with Chad)
- **Name:** Keep "Strategic Sync."
- **Scope:** IT-first; AI kept as a single service card.
- **Phone:** 949-998-2424 (unchanged), email contact@strategicsync.com, San Clemente geo retained.
- **Service area:** Orange County, CA.
- **Lead services:** Computer/Mac repair, Networking & WiFi, IT support/Managed IT, Smart home + security cameras.

## Service lines (new slugs)
1. `computer-repair` — Computer & Mac Repair
2. `networking-wifi` — Networking & WiFi
3. `it-support` — IT Support & Managed IT
4. `smart-home-security` — Smart Home & Security Cameras
5. `ai-integration` — AI Integration (kept; preserves the AI arm)

## Files changed
| File | Change |
|---|---|
| `content/services.json` | Replace 3 AI services with the 5 IT services above (Thumbtack-style copy, per-visit/monthly pricing, deliverables, buyerProfile). |
| `content/stats.json` | IT stats (devices serviced, avg response, same-day %, rating). |
| `pages/index.tsx` | Rewrite hero, FAQ (IT), ICONS map keyed to new slugs, replace "currently wired" aside with "brands we service." |
| `seo.config.ts` | Title/description → IT + Orange County; keep San Clemente geo tags. |
| `lib/seo.ts` | `localBusinessSchema` name/description/`@type`; area already OC; phone correct. |
| `pages/pricing.tsx` | Reframe tiers → IT: per-visit/hourly + Managed IT monthly plans. |
| `pages/approach.tsx` | Phases reworded to an IT service visit (Diagnose → Quote → Fix → Follow-up). |
| `pages/contact.tsx` | Copy → "book a service call." |
| `pages/services/index.tsx` | SEO/hero copy → IT. |
| `components/Footer.tsx` | Service links → new slugs/names; tagline → IT. |
| `components/Navbar.tsx` | Nav label `Integrations` → `Brands`. |
| `pages/integrations/index.tsx` + `[slug].tsx` | Re-theme copy from "AI for X / wire AI into" to "We service / support X." |
| `content/integrations/*.json` | Rewrite 10 entries → IT vendors (Microsoft 365, Google Workspace, Ubiquiti/UniFi, Synology, QuickBooks, Apple/macOS, Eero, Ring/Nest cameras, Windows PC, Starlink/ISP). `relatedServices` → new slugs. |
| `content/cases/*.mdx` | Rewrite 4 → representative IT jobs (network install, virus/ransomware recovery, office IT setup, WiFi dead-zone fix). Honest/anonymized framing; Chad to confirm before relying on metrics. |

## Not touching
MCP server, Tailwind/design tokens, build infra, `pages/journal`, the "AI by Strategic Sync" footer credit that lives in *client* repos (unaffected).

## Verification
`npm run build` must pass clean (all new service/integration slugs resolve, no dead `relatedServices`). Then merge to `main`, push → Vercel auto-deploys.

## Open flag
Strategic Sync also functions as Chad's AI-voice brand (demo funnel, client footer credits). IT-first public site softens that. Accepted as deliberate.
