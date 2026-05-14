# Strategic Sync — Site Rebuild Design Spec

**Date:** 2026-05-14
**Repo:** `~/strategic-sync` (Next 14 Pages Router)
**Production:** strategicsync.com (Vercel)
**Branch:** `rebuild-2026`

---

## 1. Goal

Rebuild strategicsync.com with a distinctive Industrial Precision aesthetic, sharper positioning as the AI automation/integration arm of Chad McCluskey's businesses, expanded SEO surface area, and corrected phone number. Ship as a single PR swap after Vercel preview validation.

## 2. Positioning

**Strategic Sync = AI automation + integration arm.** Distinct from sibling brand Stack Consulting AI (broader SMB consulting + managed IT). Strategic Sync embeds AI into existing systems — phones (FreeSWITCH + OpenAI Realtime), CRMs, billing, workflows — without rip-and-replace.

**Positioning line:** "We wire AI into the systems you already run. Quietly. Reliably. Then we hand you the keys."

**Buyer:** SMB-to-mid-market ops/exec who already has phone, CRM, billing in place and wants to add AI without a 12-month enterprise contract.

**Differentiation vs Stack Consulting AI:**
- Stack = warmer, local-SMB, broader services (consulting, web, IT)
- Sync = colder, technical, single mission (AI integration into existing stack)

## 3. Visual Direction — Industrial Precision

Refined Swiss-style. Anti-AI-slop. Engineering-rigor signal.

| Element | Choice |
|---|---|
| Background | Paper `#F5F1E8` (warm bone), Paper-2 `#EBE6D8` |
| Foreground | Ink `#15140F` (bone black), Ink-2 `#3A3530`, Mute `#7A7066` |
| Accent | Orange `#F04E23`, Accent-2 `#C43D18` (hover) |
| Display font | Fraunces (variable, opsz 9-144), weights 300/400/500, italic for emphasis |
| Body font | IBM Plex Sans (300/400/500/600) |
| Meta font | IBM Plex Mono (400/500), uppercase, 0.24em tracking |
| Layout | Asymmetric grids, hairline rules (`1px solid var(--rule)`), generous whitespace, numbered sections (§ 01) |
| Decorative | Crosshair marks, live status pulses, kicker labels, field-note asides |

Rejected: Terminal/Operator (too niche), Editorial/Magazine (boutique consultancy vibe undercuts technical credibility), Neon/Cyber (current — generic AI-slop).

## 4. Information Architecture

8 public pages + 2 untouched internal tools.

| § | Page | Path | Job-to-be-done | Primary keywords |
|---|---|---|---|---|
| 01 | Home | `/` | Convert visitors to qualified calls | ai automation consulting, ai integration services, ai voice agents |
| 02 | Services | `/services` + `/services/[slug]` | Explain 3 service lines deeply | ai receptionist services, business workflow automation, custom ai development |
| 03 | Work | `/work` + `/work/[slug]` | Prove it ships (4-6 case studies) | ai consulting case studies, [industry] ai automation |
| 04 | Approach | `/approach` | Show 4-phase methodology | ai implementation process, how to deploy ai agents |
| 05 | Integrations | `/integrations` + `/integrations/[slug]` | SEO landing-pad gold | [tool] ai integration, [tool] automation services |
| 06 | Journal | `/journal` + `/journal/[slug]` | Long-tail SEO + thought leadership | content-driven, long-tail topical authority |
| 07 | Pricing | `/pricing` | Pre-qualify and close | ai consulting pricing, ai receptionist cost |
| 08 | Contact + Book | `/contact` (Cal.com embed + form merged) | Convert | ai consultant san clemente, orange county ai consulting |
| 09 | Client Login | `/client-login` | (unchanged, noindex) | — |
| 10 | SEO Dashboard | `/seo-dashboard` | (unchanged, noindex) | — |

**Service lines (anchored on `/services` + own subpages):**
1. AI Voice Agents (FreeSWITCH + OpenAI Realtime + Twilio)
2. Workflow Integration (n8n + Anthropic + webhooks across CRM/billing/calendar)
3. Custom Systems (Next.js + Supabase + RAG, bespoke builds)

## 5. Component Architecture

All under `components/`, TypeScript, framer-motion 11 (already installed).

| Component | Responsibility |
|---|---|
| `<Navbar/>` | Brand mark, primary nav, mono "Book a call" CTA, sticky on scroll (replaces existing `Navbar.tsx`) |
| `<Hero/>` | Asymmetric 1fr/380px grid with field-note aside; per-page variant via props |
| `<StatusStrip/>` | 4-cell live-metric bar (calls, workflows, deploy days, uptime); reads from static JSON `content/stats.json` updated manually monthly. No live data source for v1 — `/api/stats` deferred to post-launch when telemetry pipeline exists. |
| `<ServiceCard/>` | Numbered card (`01/03`), shape icon, title, copy, mono tag list |
| `<CaseStudyCard/>` | Editorial feature card: kicker, client, problem→outcome, metric pull-quote |
| `<IntegrationTile/>` | Tool logo + name + 1-line use case; links to `/integrations/[slug]` |
| `<Article/>` | Journal article template: drop cap, pull quotes, footnotes, MDX-rendered |
| `<PricingTier/>` | 3-column tier card; "what's in" / "what's not"; mono price; anchored CTA |
| `<ContactBlock/>` | Cal.com embed + form fallback + phone/email/address |
| `<FAQ/>` | Accordion; auto-emits `FAQPage` JSON-LD from items prop |
| `<FieldNote/>` | Aside callout with mono label + body |
| `<Footer/>` | 4-col footer with hairline rules |

**Existing components:**
- **Delete:** `StrategicSyncHero.tsx`, `StrategicSyncSEO.tsx`, `SEOAudit.tsx`, `ClientSideMotion.tsx`, `components/index.tsx` (re-export barrel — replace with explicit imports).
- **Delete `ConvAI.tsx`:** ElevenLabs Convai widget removed from rebuild; AI voice presence demonstrated on `/services/ai-voice-agents` via call-the-line CTA to (949) 998-2424 instead of embedded widget. (Embedded widget conflicts with Industrial aesthetic and adds 200KB JS.)
- **Rewrite:** `SEO.tsx` → thin `next-seo` wrapper accepting per-page props; `Navbar.tsx` → matches new design system.

## 6. Design Tokens

CSS variables in `styles/globals.css`. Tailwind v3 config extends from these.

```css
:root {
  --paper: #f5f1e8;
  --paper-2: #ebe6d8;
  --ink: #15140f;
  --ink-2: #3a3530;
  --mute: #7a7066;
  --accent: #f04e23;
  --accent-2: #c43d18;
  --rule: #1a1812;
}
```

**Type scale (clamp, fluid):**
- Display XL: `clamp(54px, 7vw, 108px)` Fraunces 300, line 0.96, tracking -0.025em
- Display L: 56px Fraunces 300, line 1.02, tracking -0.02em
- Heading M: 24px Fraunces 500, tracking -0.015em
- Body: 15px Plex Sans 400, line 1.6
- Body S: 13px Plex Sans 400, line 1.55
- Mono Meta: 11px Plex Mono 400, tracking 0.24em, uppercase
- Mono Tag: 10px Plex Mono 400, tracking 0.08em

**Spacing:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px. Fluid via `clamp()` for sections.

**Motion:**
- Page load: staggered reveal nav→kicker→headline→aside→CTA, 60ms steps, ease-out-quart
- Scroll: useInView, threshold -100px, opacity + translateY(40→0), once
- Hover: 400ms ease, transform/opacity only
- `@media (prefers-reduced-motion)`: all transitions 0ms

## 7. SEO Implementation

**Library:** `next-seo` (already installed; v6.4.0).

**Per-page meta:**
- Title ≤60 char, description ≤155 char
- Canonical URL
- OG image auto-generated via new `/api/og?title=...&kicker=...` route (Vercel `@vercel/og`)
- Twitter card: `summary_large_image`

**JSON-LD (per page type):**
| Page | Schema |
|---|---|
| All pages | `Organization` (global, `_document.tsx`) |
| `/` | `ProfessionalService` + `BreadcrumbList` |
| `/services/[slug]` | `Service` + `BreadcrumbList` |
| `/work` | `ItemList` of case studies |
| `/work/[slug]` | `Article` + `BreadcrumbList` |
| `/integrations` | `ItemList` of integrations |
| `/integrations/[slug]` | `Service` + `BreadcrumbList` |
| `/journal/[slug]` | `Article` + `BreadcrumbList` |
| `/contact` | `LocalBusiness` + geo |
| Pages with FAQ | `FAQPage` (auto from `<FAQ/>`) |

**Local SEO:** ProfessionalService schema, San Clemente geo tags (33.4269, -117.6120), "Orange County AI consulting" landing copy on `/`.

**Technical:**
- `pages/sitemap.xml.tsx` — dynamic, builds from MDX manifest (cases + journal) + integration JSON manifest at request time
- `pages/robots.txt.tsx` — explicit allow + sitemap pointer; disallow `/client-login`, `/seo-dashboard`, `/api/`
- `next/font` local Fraunces + Plex (no Google Font CSS request)
- `next/image` everywhere; `priority` on hero image
- Preconnect: Cal.com (`cal.com`), Vercel Analytics (`va.vercel-scripts.com`)
- 301 redirects in `next.config.cjs`: `/blog` → `/journal`, `/blog/:slug*` → `/journal/:slug*`, `/booking` → `/contact#book`

**Internal linking:** every `/services/[slug]` → related case studies + integrations; `/integrations/[slug]` → services that use them; `/work/[slug]` → service line + integration tiles.

**Performance targets (Lighthouse CI, blocks PR merge):**
- Performance ≥95
- Accessibility ≥95
- Best Practices ≥95
- SEO 100

## 8. Phone Number Update

`949-529-2424` → `949-998-2424`. Touchpoints (verified via grep):
- `seo.config.ts:23`
- `components/Navbar.tsx:198,201`
- `components/SEO.tsx:78`
- `pages/_document.tsx:13,66`
- `pages/index.tsx:477,483,659`
- `pages/contact.tsx:199,200`

Ships as separate PR ahead of rebuild — low-risk hotfix on `main`. Will be re-applied to `rebuild-2026` branch on merge.

PBX caller-ID note: FusionPBX outbound caller ID already configured to new number (`19499982424` per project memory). No PBX-side change needed.

## 9. Content (initial)

**Case studies (4 minimum to launch):** Anonymized if needed. Each MDX file in `content/cases/`:
- Industry, problem, system shipped, measurable outcome, stack used, timeline
- Suggested seeds: Stack Consulting AI's own AI receptionist, Strategic Sync IVR (ext 5000), Dr. Robert Woods MD (psychiatry), Tito's Automotive — verify with Chad which can be public.

**Integrations (10 minimum to launch):** JSON manifest in `content/integrations/`. Each entry: slug, name, logo SVG, category, 1-line use case, 3-bullet detail. Seeds: FreeSWITCH, OpenAI Realtime, Anthropic, Twilio, Stripe, HubSpot, Calendly/Cal.com, Slack, n8n, Supabase.

**Journal:** migrate existing `/blog` MDX content (if any) to `/journal`. New article template (Fraunces drop cap, Plex body, pull quotes, footnotes).

**Pricing tiers (initial):**
1. **Voice Agent** — productized AI receptionist on existing number. From $X/mo. (Chad to set price.)
2. **Integration Sprint** — 2-week build wiring CRM/calendar/billing into AI agent. From $Y one-time.
3. **Custom Build** — bespoke project. From $Z, project-based.

Pricing copy explicit: "What's included" + "What's not" per tier.

## 10. Tech Stack

**No changes:**
- Next 14 Pages Router (no migration to App Router — out of scope, high risk)
- React 18.2
- Tailwind v3
- framer-motion 11
- `next-seo` 6.4
- TypeScript

**Additions:**
- `@vercel/og` for OG image generation
- `@next/mdx` + `next-mdx-remote` for journal/cases content
- (Optional) `gray-matter` for MDX frontmatter parsing

**Removals after rebuild:** unused `react-scroll`, `critters` (Next 14 has built-in critical CSS), `react-icons` (replace with inline SVG components for consistency with Industrial aesthetic).

## 11. Rollout

1. **PR-1 (this week):** Phone number swap on `main`. Hotfix. Auto-deploy.
2. **PR-2 (rebuild):** Branch `rebuild-2026` from `main`. Implement per implementation plan. Vercel preview deploy on every commit. Lighthouse CI on PR.
3. **Final swap:** PR-2 merge → Vercel production. 301 redirects active immediately. Resubmit sitemap to Google Search Console + Bing Webmaster.
4. **Post-launch:** monitor Search Console for 404s on legacy URLs (catch any redirects missed), monitor Vercel Analytics + Speed Insights for regressions.

## 12. Out of Scope

- Migration to Next 15 / App Router
- Authentication overhaul (`client-login` untouched)
- SEO dashboard rewrite
- Continuous content calendar / link building (post-launch ongoing work)
- New blog/journal article writing (migration only; new content is post-launch)
- Brand identity overhaul (logo, wordmark — uses existing brand mark)
- Stack Consulting AI changes
- Internal MCP server changes (`mcp-server.ts`, systemd unit) — separate concern

## 13. Success Criteria

- All 8 public pages live, no broken links, no console errors
- Lighthouse ≥95 across the board, SEO = 100
- Phone `949-998-2424` everywhere; zero remaining occurrences of old number
- 301 redirects working: `/blog/*` → `/journal/*`, `/booking` → `/contact#book`
- Sitemap.xml validates and lists all canonical URLs
- JSON-LD validates in Google Rich Results Test for: Organization, Service, Article, FAQPage, ProfessionalService
- Preview deploy reviewed by Chad before merge
