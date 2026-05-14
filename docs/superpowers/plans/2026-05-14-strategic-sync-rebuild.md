# Strategic Sync — Site Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild strategicsync.com with Industrial Precision aesthetic, expanded 8-page IA, technical+on-page SEO, ship via `rebuild-2026` branch → single PR swap.

**Architecture:** Branch-based rebuild on Next 14 Pages Router. Foundation first (tokens, fonts, design system), then 12 reusable components, then 8 pages, then SEO infrastructure, then content scaffolding, then cleanup, then quality gates. No tests (project has no suite per `~/CLAUDE.md`); verification = `npm run build` + Vercel preview deploy + Lighthouse CI ≥95.

**Tech Stack:** Next 14, React 18, Tailwind v3, TypeScript, framer-motion 11, next-seo 6, MDX (`@next/mdx` + `next-mdx-remote`), `@vercel/og`, `gray-matter`, Cal.com embed.

**Reference spec:** `docs/superpowers/specs/2026-05-14-strategic-sync-rebuild-design.md`

**Prerequisite:** Phone swap PR (`docs/superpowers/plans/2026-05-14-strategic-sync-phone-swap.md`) merged to `main` first.

---

## File Map

**New files:**
- `styles/globals.css` (rewrite)
- `tailwind.config.js` (rewrite)
- `lib/seo.ts` — JSON-LD helpers
- `lib/content.ts` — MDX/JSON loaders
- `lib/fonts.ts` — next/font setup
- `components/Navbar.tsx` (rewrite)
- `components/Footer.tsx`
- `components/Hero.tsx`
- `components/StatusStrip.tsx`
- `components/ServiceCard.tsx`
- `components/CaseStudyCard.tsx`
- `components/IntegrationTile.tsx`
- `components/PricingTier.tsx`
- `components/ContactBlock.tsx`
- `components/FAQ.tsx`
- `components/FieldNote.tsx`
- `components/Article.tsx`
- `components/SEO.tsx` (rewrite as thin next-seo wrapper)
- `pages/_app.tsx` (modify — fonts + layout shell)
- `pages/_document.tsx` (rewrite — Organization JSON-LD + new phone)
- `pages/index.tsx` (full rewrite)
- `pages/services/index.tsx` (rewrite)
- `pages/services/[slug].tsx` (new)
- `pages/work/index.tsx` (new)
- `pages/work/[slug].tsx` (new)
- `pages/approach.tsx` (new)
- `pages/integrations/index.tsx` (new)
- `pages/integrations/[slug].tsx` (new)
- `pages/journal/index.tsx` (new — replaces blog)
- `pages/journal/[slug].tsx` (new)
- `pages/pricing.tsx` (new)
- `pages/contact.tsx` (rewrite)
- `pages/sitemap.xml.tsx` (rewrite — dynamic from manifests)
- `pages/robots.txt.tsx` (rewrite)
- `pages/api/og.tsx` (new — Vercel OG image gen)
- `next.config.cjs` (modify — redirects, MDX, font domains)
- `content/stats.json`
- `content/services.json`
- `content/integrations/*.json` (10 files)
- `content/cases/*.mdx` (4 files)
- `content/journal/*.mdx` (migrated from blog)
- `public/fonts/*` (Fraunces + Plex woff2 files)
- `.lighthouserc.json`
- `.github/workflows/lighthouse.yml`

**Files to delete:**
- `components/StrategicSyncHero.tsx`
- `components/StrategicSyncSEO.tsx`
- `components/SEOAudit.tsx`
- `components/ConvAI.tsx`
- `components/ClientSideMotion.tsx`
- `components/index.tsx`
- `pages/blog.tsx`, `pages/blog/` (replaced by /journal + redirect)
- `pages/booking.tsx` (replaced by redirect to /contact#book)
- `pages/index.tsx.bak`
- `pages/index.tsx\` (typo backup)
- `output.css` (stale Tailwind output, not used)

---

## PHASE 0 — Branch + Dependencies

### Task 0.1: Create rebuild branch

- [ ] **Step 1: Confirm CWD + clean tree**

Run: `cd ~/strategic-sync && git status`
Expected: clean working tree, on `main`. Phone-swap PR already merged.

- [ ] **Step 2: Create + checkout branch**

Run: `cd ~/strategic-sync && git checkout -b rebuild-2026 && git push -u origin rebuild-2026`
Expected: branch created, pushed to remote, Vercel will auto-create preview deploy.

### Task 0.2: Install new dependencies

- [ ] **Step 1: Install runtime deps**

Run:
```bash
cd ~/strategic-sync && npm install @vercel/og @next/mdx @mdx-js/loader @mdx-js/react next-mdx-remote gray-matter clsx
```
Expected: deps added, no errors.

- [ ] **Step 2: Remove obsolete deps**

Run:
```bash
cd ~/strategic-sync && npm uninstall react-scroll critters react-icons
```
Expected: removed cleanly.

- [ ] **Step 3: Verify build still passes**

Run: `cd ~/strategic-sync && npm run build`
Expected: build succeeds (will fail later when components are deleted; acceptable for now if any `react-icons` import remains — fix in Phase 6).

- [ ] **Step 4: Commit**

```bash
cd ~/strategic-sync && git add package.json package-lock.json && git commit -m "deps: add MDX/OG/Cal.com tooling, remove react-scroll/critters/react-icons"
```

### Task 0.3: Download fonts locally (next/font local source)

- [ ] **Step 1: Create fonts directory**

Run: `mkdir -p ~/strategic-sync/public/fonts/fraunces ~/strategic-sync/public/fonts/plex-sans ~/strategic-sync/public/fonts/plex-mono`

- [ ] **Step 2: Fetch Fraunces variable woff2**

Run:
```bash
cd ~/strategic-sync/public/fonts/fraunces && \
  curl -L -o Fraunces[opsz,wght].woff2 'https://github.com/undercase/fraunces/raw/main/fonts/variable/Fraunces%5Bopsz%2Cwght%5D.woff2' && \
  curl -L -o Fraunces-Italic[opsz,wght].woff2 'https://github.com/undercase/fraunces/raw/main/fonts/variable/Fraunces-Italic%5Bopsz%2Cwght%5D.woff2'
```
If GitHub raw URL changes, fall back to Google Fonts download API:
```bash
curl -L -o fraunces.zip 'https://fonts.google.com/download?family=Fraunces' && unzip fraunces.zip
```
Expected: 2 woff2 files in fraunces/.

- [ ] **Step 3: Fetch IBM Plex Sans + Mono woff2**

Run:
```bash
cd ~/strategic-sync && \
  curl -L -o /tmp/plex-sans.zip 'https://github.com/IBM/plex/releases/latest/download/IBM-Plex-Sans.zip' && \
  curl -L -o /tmp/plex-mono.zip 'https://github.com/IBM/plex/releases/latest/download/IBM-Plex-Mono.zip' && \
  unzip -j /tmp/plex-sans.zip 'IBM-Plex-Sans/fonts/complete/woff2/IBMPlexSans-{Light,Regular,Medium,SemiBold}.woff2' -d public/fonts/plex-sans/ && \
  unzip -j /tmp/plex-mono.zip 'IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-{Regular,Medium}.woff2' -d public/fonts/plex-mono/
```
Expected: 4 Plex Sans woff2 + 2 Plex Mono woff2.

- [ ] **Step 4: Commit fonts**

```bash
cd ~/strategic-sync && git add public/fonts && git commit -m "fonts: add local Fraunces + IBM Plex Sans/Mono woff2"
```

---

## PHASE 1 — Foundation (tokens, fonts, layout shell)

### Task 1.1: Set up next/font local

- [ ] **Step 1: Create `lib/fonts.ts`**

```ts
// lib/fonts.ts
import localFont from 'next/font/local'

export const fraunces = localFont({
  src: [
    { path: '../public/fonts/fraunces/Fraunces[opsz,wght].woff2', style: 'normal' },
    { path: '../public/fonts/fraunces/Fraunces-Italic[opsz,wght].woff2', style: 'italic' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
})

export const plexSans = localFont({
  src: [
    { path: '../public/fonts/plex-sans/IBMPlexSans-Light.woff2', weight: '300' },
    { path: '../public/fonts/plex-sans/IBMPlexSans-Regular.woff2', weight: '400' },
    { path: '../public/fonts/plex-sans/IBMPlexSans-Medium.woff2', weight: '500' },
    { path: '../public/fonts/plex-sans/IBMPlexSans-SemiBold.woff2', weight: '600' },
  ],
  variable: '--font-plex-sans',
  display: 'swap',
})

export const plexMono = localFont({
  src: [
    { path: '../public/fonts/plex-mono/IBMPlexMono-Regular.woff2', weight: '400' },
    { path: '../public/fonts/plex-mono/IBMPlexMono-Medium.woff2', weight: '500' },
  ],
  variable: '--font-plex-mono',
  display: 'swap',
})
```

### Task 1.2: Write design tokens to `styles/globals.css`

- [ ] **Step 1: Replace `styles/globals.css`** (or create if missing)

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --paper: #f5f1e8;
    --paper-2: #ebe6d8;
    --ink: #15140f;
    --ink-2: #3a3530;
    --mute: #7a7066;
    --accent: #f04e23;
    --accent-2: #c43d18;
    --rule: #1a1812;
    --ok: #5a7a3a;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: "ss01", "cv11";
  }

  ::selection { background: var(--accent); color: var(--paper); }
}

@layer components {
  .serif { font-family: var(--font-fraunces), Georgia, serif; font-optical-sizing: auto; }
  .mono { font-family: var(--font-plex-mono), ui-monospace, monospace; }

  .kicker {
    font-family: var(--font-plex-mono);
    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--mute);
  }

  .display-xl {
    font-family: var(--font-fraunces);
    font-weight: 300;
    font-size: clamp(54px, 7vw, 108px);
    line-height: 0.96;
    letter-spacing: -0.025em;
  }

  .display-l {
    font-family: var(--font-fraunces);
    font-weight: 300;
    font-size: clamp(40px, 5vw, 56px);
    line-height: 1.02;
    letter-spacing: -0.02em;
  }

  .heading-m {
    font-family: var(--font-fraunces);
    font-weight: 500;
    font-size: 24px;
    letter-spacing: -0.015em;
  }

  .body { font-size: 15px; line-height: 1.6; color: var(--ink-2); }
  .body-s { font-size: 13px; line-height: 1.55; color: var(--ink-2); }

  .rule { height: 1px; background: var(--rule); opacity: 0.18; }

  .btn-ink {
    background: var(--ink);
    color: var(--paper);
    font-family: var(--font-plex-mono);
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 18px 28px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    transition: opacity 0.2s ease;
  }
  .btn-ink:hover { opacity: 0.85; }

  .btn-ghost {
    color: var(--ink);
    text-decoration: none;
    border-bottom: 1px solid var(--ink);
    padding-bottom: 2px;
    font-size: 14px;
  }
  .btn-ghost:hover { color: var(--accent); border-color: var(--accent); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Task 1.3: Update Tailwind config

- [ ] **Step 1: Replace `tailwind.config.js`**

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        mute: 'var(--mute)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        rule: 'var(--rule)',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-plex-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: { wrap: '1440px' },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
```

### Task 1.4: Update `pages/_app.tsx`

- [ ] **Step 1: Replace `pages/_app.tsx`**

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import defaultSEO from '../seo.config'
import { fraunces, plexSans, plexMono } from '../lib/fonts'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} font-sans`}>
      <DefaultSeo {...defaultSEO} />
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </div>
  )
}
```

### Task 1.5: Rewrite `pages/_document.tsx` with Organization JSON-LD + new phone

- [ ] **Step 1: Replace `pages/_document.tsx`**

```tsx
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Strategic Sync',
  url: 'https://strategicsync.com',
  logo: 'https://strategicsync.com/images/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-949-998-2424',
    contactType: 'Sales',
    email: 'contact@strategicsync.com',
    areaServed: 'US',
    availableLanguage: 'English',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'San Clemente',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  sameAs: [
    'https://www.linkedin.com/company/strategic-sync',
    'https://twitter.com/strategicsync',
  ],
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f04e23" />
        <link rel="preconnect" href="https://cal.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </Head>
      <body className="bg-paper text-ink antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

### Task 1.6: Build + commit foundation

- [ ] **Step 1: Build**

Run: `cd ~/strategic-sync && npm run build`
Expected: build may fail because old components still reference deleted icon sets / now-stale tokens. Note errors but proceed — Phase 6 cleanup will resolve. If build catastrophically fails (cannot even compile new files), fix before continuing.

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add lib/fonts.ts styles/globals.css tailwind.config.js pages/_app.tsx pages/_document.tsx && git commit -m "foundation: design tokens, local fonts, Organization JSON-LD"
```

---

## PHASE 2 — Reusable Components (12)

Each component task: create file with full code → save → quick build check → commit.

### Task 2.1: `components/Navbar.tsx`

- [ ] **Step 1: Replace `components/Navbar.tsx`**

```tsx
// components/Navbar.tsx
import Link from 'next/link'
import { useEffect, useState } from 'react'

const links = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/approach', label: 'Approach' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/journal', label: 'Journal' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? 'bg-paper-2/95 backdrop-blur border-b border-rule/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-wrap mx-auto px-6 md:px-12 flex items-center justify-between py-5 border-b border-rule">
        <Link href="/" className="flex items-baseline gap-2.5 no-underline text-ink">
          <span className="relative inline-block w-7 h-7 bg-ink">
            <span className="absolute inset-y-1.5 right-1.5 left-3.5 bg-accent" />
          </span>
          <span className="serif font-medium text-xl tracking-tight">
            Strategic <em className="not-italic md:italic font-normal text-accent">Sync</em>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] tracking-wide text-ink hover:text-accent no-underline"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact#book" className="btn-ink !py-2.5 !px-4 text-[11px]">
            Book a call →
          </Link>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/Navbar.tsx && git commit -m "feat(navbar): industrial-precision rebuild"
```

### Task 2.2: `components/Footer.tsx`

- [ ] **Step 1: Create `components/Footer.tsx`**

```tsx
// components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-rule mt-32">
      <div className="max-w-wrap mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="kicker mb-4">Strategic Sync</div>
          <p className="body-s max-w-[240px]">
            We wire AI into the systems you already run. San Clemente, CA.
          </p>
        </div>
        <div>
          <div className="kicker mb-4">Services</div>
          <ul className="space-y-2 text-[13px]">
            <li><Link href="/services/ai-voice-agents" className="text-ink hover:text-accent no-underline">AI Voice Agents</Link></li>
            <li><Link href="/services/workflow-integration" className="text-ink hover:text-accent no-underline">Workflow Integration</Link></li>
            <li><Link href="/services/custom-systems" className="text-ink hover:text-accent no-underline">Custom Systems</Link></li>
          </ul>
        </div>
        <div>
          <div className="kicker mb-4">Company</div>
          <ul className="space-y-2 text-[13px]">
            <li><Link href="/work" className="text-ink hover:text-accent no-underline">Work</Link></li>
            <li><Link href="/approach" className="text-ink hover:text-accent no-underline">Approach</Link></li>
            <li><Link href="/journal" className="text-ink hover:text-accent no-underline">Journal</Link></li>
            <li><Link href="/pricing" className="text-ink hover:text-accent no-underline">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <div className="kicker mb-4">Contact</div>
          <ul className="space-y-2 text-[13px]">
            <li><a href="tel:949-998-2424" className="text-ink hover:text-accent no-underline">(949) 998-2424</a></li>
            <li><a href="mailto:contact@strategicsync.com" className="text-ink hover:text-accent no-underline">contact@strategicsync.com</a></li>
            <li><Link href="/contact#book" className="text-ink hover:text-accent no-underline">Book a call →</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="max-w-wrap mx-auto px-6 md:px-12 py-5 flex justify-between mono text-[10px] tracking-[0.2em] uppercase text-mute">
          <span>© {new Date().getFullYear()} Strategic Sync</span>
          <span>SS · 949.998.2424</span>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/Footer.tsx && git commit -m "feat(footer): industrial 4-col footer"
```

### Task 2.3: `components/Hero.tsx`

- [ ] **Step 1: Create `components/Hero.tsx`**

```tsx
// components/Hero.tsx
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type Props = {
  kicker: string
  headline: ReactNode
  sub?: ReactNode
  aside?: { label: string; body: ReactNode }
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero({ kicker, headline, sub, aside, primaryCta, secondaryCta }: Props) {
  return (
    <section className="max-w-wrap mx-auto px-6 md:px-12 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="grid md:grid-cols-[1fr_380px] gap-12 md:gap-16 items-end">
        <div>
          <motion.div className="flex items-center gap-3.5 kicker mb-8" {...fade(0)}>
            <span className="w-1.5 h-1.5 bg-accent" />
            <span>{kicker}</span>
            <span className="flex-1 max-w-[120px] h-px bg-rule" />
          </motion.div>
          <motion.h1 className="display-xl text-ink" {...fade(0.06)}>
            {headline}
          </motion.h1>
          {sub && (
            <motion.div className="body mt-5 max-w-[640px]" {...fade(0.14)}>
              {sub}
            </motion.div>
          )}
          {(primaryCta || secondaryCta) && (
            <motion.div className="flex flex-wrap items-center gap-4 mt-12" {...fade(0.22)}>
              {primaryCta && (
                <a href={primaryCta.href} className="btn-ink">
                  {primaryCta.label} →
                </a>
              )}
              {secondaryCta && (
                <a href={secondaryCta.href} className="btn-ghost">
                  {secondaryCta.label}
                </a>
              )}
            </motion.div>
          )}
        </div>
        {aside && (
          <motion.aside className="border-l border-rule pl-8 pb-2" {...fade(0.18)}>
            <div className="kicker mb-3.5">{aside.label}</div>
            <div className="body">{aside.body}</div>
          </motion.aside>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/Hero.tsx && git commit -m "feat(hero): asymmetric grid hero with field-note aside"
```

### Task 2.4: `components/StatusStrip.tsx`

- [ ] **Step 1: Create `components/StatusStrip.tsx`**

```tsx
// components/StatusStrip.tsx
type Stat = { label: string; value: string; sub?: string }

export default function StatusStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="max-w-wrap mx-auto px-6 md:px-12">
      <div className="border-y border-rule grid grid-cols-2 md:grid-cols-4 bg-paper">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`p-6 md:p-7 ${i < stats.length - 1 ? 'md:border-r border-rule' : ''} ${
              i % 2 === 0 ? 'border-r md:border-r' : ''
            } ${i < 2 ? 'border-b md:border-b-0' : ''} border-rule`}
          >
            <div className="kicker mb-2.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              {s.label}
            </div>
            <div className="serif font-normal text-3xl tracking-tight text-ink">
              {s.value}
              {s.sub && <span className="mono text-[11px] text-mute ml-2 align-baseline">{s.sub}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/StatusStrip.tsx && git commit -m "feat(status-strip): live-metric bar"
```

### Task 2.5: `components/ServiceCard.tsx`

- [ ] **Step 1: Create `components/ServiceCard.tsx`**

```tsx
// components/ServiceCard.tsx
import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  num: string         // "01"
  total: string       // "03"
  icon: ReactNode     // SVG
  title: string
  body: string
  tags: string[]
  href: string
}

export default function ServiceCard({ num, total, icon, title, body, tags, href }: Props) {
  return (
    <Link
      href={href}
      className="group relative block p-8 md:p-12 border-r border-b border-rule last:border-r-0 hover:bg-paper-2 transition-colors no-underline text-ink"
    >
      <span className="absolute top-6 right-7 mono text-[10px] tracking-[0.2em] text-mute">
        {num} / {total}
      </span>
      <div className="w-9 h-9 mb-6 relative">{icon}</div>
      <h3 className="heading-m mb-3.5">{title}</h3>
      <p className="body-s mb-6">{body}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="mono text-[10px] tracking-[0.08em] px-2 py-1 bg-paper-2 text-ink-2 group-hover:bg-paper">
            {t}
          </span>
        ))}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/ServiceCard.tsx && git commit -m "feat(service-card): numbered card with shape icon + tags"
```

### Task 2.6: `components/CaseStudyCard.tsx`

- [ ] **Step 1: Create `components/CaseStudyCard.tsx`**

```tsx
// components/CaseStudyCard.tsx
import Link from 'next/link'

type Props = {
  industry: string
  client: string
  outcome: string
  metric: string
  metricLabel: string
  href: string
}

export default function CaseStudyCard({ industry, client, outcome, metric, metricLabel, href }: Props) {
  return (
    <Link
      href={href}
      className="group block border border-rule p-8 hover:bg-paper-2 transition-colors no-underline text-ink"
    >
      <div className="kicker mb-3">{industry}</div>
      <h3 className="serif text-xl font-medium mb-5">{client}</h3>
      <div className="serif text-5xl font-light text-accent leading-none mb-2">{metric}</div>
      <div className="kicker mb-4">{metricLabel}</div>
      <p className="body-s">{outcome}</p>
      <div className="mt-6 mono text-[11px] tracking-[0.16em] uppercase text-ink group-hover:text-accent">
        Read case →
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/CaseStudyCard.tsx && git commit -m "feat(case-study-card): editorial case feature"
```

### Task 2.7: `components/IntegrationTile.tsx`

- [ ] **Step 1: Create `components/IntegrationTile.tsx`**

```tsx
// components/IntegrationTile.tsx
import Link from 'next/link'

type Props = {
  slug: string
  name: string
  category: string
  useCase: string
}

export default function IntegrationTile({ slug, name, category, useCase }: Props) {
  return (
    <Link
      href={`/integrations/${slug}`}
      className="group block border border-rule p-6 hover:bg-paper-2 transition-colors no-underline text-ink"
    >
      <div className="kicker mb-2">{category}</div>
      <h3 className="serif text-lg font-medium mb-2">{name}</h3>
      <p className="body-s mb-4">{useCase}</p>
      <span className="mono text-[10px] tracking-[0.16em] uppercase text-ink group-hover:text-accent">
        Connect →
      </span>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/IntegrationTile.tsx && git commit -m "feat(integration-tile): directory tile"
```

### Task 2.8: `components/PricingTier.tsx`

- [ ] **Step 1: Create `components/PricingTier.tsx`**

```tsx
// components/PricingTier.tsx
import Link from 'next/link'

type Props = {
  name: string
  tagline: string
  price: string         // "$1,495 / mo"
  priceNote?: string    // "starting at"
  includes: string[]
  excludes: string[]
  cta: { label: string; href: string }
  featured?: boolean
}

export default function PricingTier({ name, tagline, price, priceNote, includes, excludes, cta, featured }: Props) {
  return (
    <div className={`relative p-8 md:p-10 border ${featured ? 'border-accent bg-paper-2' : 'border-rule'}`}>
      {featured && (
        <span className="absolute -top-3 left-8 mono text-[10px] tracking-[0.2em] uppercase bg-accent text-paper px-3 py-1">
          Most chosen
        </span>
      )}
      <div className="kicker mb-3">{name}</div>
      <h3 className="serif text-2xl font-medium mb-6">{tagline}</h3>
      {priceNote && <div className="kicker mb-1">{priceNote}</div>}
      <div className="serif text-4xl font-light text-ink mb-8">{price}</div>
      <div className="space-y-3 mb-6">
        <div className="kicker">Includes</div>
        <ul className="space-y-2 body-s">
          {includes.map((i) => <li key={i} className="pl-4 relative before:absolute before:left-0 before:content-['+'] before:text-accent">{i}</li>)}
        </ul>
      </div>
      <div className="space-y-3 mb-8">
        <div className="kicker">Not included</div>
        <ul className="space-y-2 body-s opacity-60">
          {excludes.map((i) => <li key={i} className="pl-4 relative before:absolute before:left-0 before:content-['−']">{i}</li>)}
        </ul>
      </div>
      <Link href={cta.href} className="btn-ink w-full justify-center">{cta.label} →</Link>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/PricingTier.tsx && git commit -m "feat(pricing-tier): tier card with includes/excludes"
```

### Task 2.9: `components/ContactBlock.tsx`

- [ ] **Step 1: Create `components/ContactBlock.tsx`**

```tsx
// components/ContactBlock.tsx
import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect, useState } from 'react'

export default function ContactBlock({ calLink = 'strategicsync/30min' }: { calLink?: string }) {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi()
      cal('ui', { theme: 'light', styles: { branding: { brandColor: '#f04e23' } } })
    })()
  }, [])

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-wrap mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 md:gap-16">
      <div id="book">
        <div className="kicker mb-4">Book a 30-min diagnostic</div>
        <h2 className="display-l mb-6">Skip the form. <em className="text-accent">Pick a slot.</em></h2>
        <div className="border border-rule">
          <Cal calLink={calLink} style={{ width: '100%', height: '600px' }} config={{ theme: 'light' }} />
        </div>
      </div>
      <div>
        <div className="kicker mb-4">Or send a note</div>
        <form onSubmit={submit} className="space-y-5">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-transparent border-b border-rule py-3 text-ink placeholder:text-mute focus:outline-none focus:border-accent"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-transparent border-b border-rule py-3 text-ink placeholder:text-mute focus:outline-none focus:border-accent"
          />
          <textarea
            required
            placeholder="What are you trying to ship?"
            rows={6}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-transparent border-b border-rule py-3 text-ink placeholder:text-mute focus:outline-none focus:border-accent resize-none"
          />
          <button type="submit" disabled={status === 'sending'} className="btn-ink">
            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : 'Send note →'}
          </button>
          {status === 'error' && <p className="body-s text-accent">Send failed. Try email instead: contact@strategicsync.com</p>}
        </form>
        <div className="mt-12 space-y-2 body-s">
          <div><strong className="text-ink">Phone:</strong> <a href="tel:949-998-2424" className="hover:text-accent">(949) 998-2424</a></div>
          <div><strong className="text-ink">Email:</strong> <a href="mailto:contact@strategicsync.com" className="hover:text-accent">contact@strategicsync.com</a></div>
          <div><strong className="text-ink">Based in:</strong> San Clemente, CA</div>
          <div><strong className="text-ink">Hours:</strong> Mon–Fri, 9a–6p Pacific</div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/ContactBlock.tsx && git commit -m "feat(contact-block): Cal.com embed + form fallback"
```

### Task 2.10: `components/FAQ.tsx`

- [ ] **Step 1: Create `components/FAQ.tsx`**

```tsx
// components/FAQ.tsx
import { useState } from 'react'

type Item = { q: string; a: string }

export default function FAQ({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="border-t border-rule">
        {items.map((it, i) => {
          const isOpen = open === i
          return (
            <div key={it.q} className="border-b border-rule">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full py-6 flex items-center justify-between text-left hover:text-accent transition-colors"
              >
                <span className="serif font-medium text-lg pr-6">{it.q}</span>
                <span className={`mono text-2xl text-mute transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div
                className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="body pb-6 max-w-[720px]">{it.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/FAQ.tsx && git commit -m "feat(faq): accordion with auto FAQPage JSON-LD"
```

### Task 2.11: `components/FieldNote.tsx`

- [ ] **Step 1: Create `components/FieldNote.tsx`**

```tsx
// components/FieldNote.tsx
import { ReactNode } from 'react'

export default function FieldNote({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="border-l border-rule pl-6 py-2">
      <div className="kicker mb-3">{label}</div>
      <div className="body-s">{children}</div>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/FieldNote.tsx && git commit -m "feat(field-note): aside callout"
```

### Task 2.12: `components/Article.tsx`

- [ ] **Step 1: Create `components/Article.tsx`**

```tsx
// components/Article.tsx
import { ReactNode } from 'react'

type Props = {
  title: string
  kicker: string
  date: string         // ISO
  readingTime: string  // "6 min read"
  author: string
  children: ReactNode  // MDX-rendered body
}

export default function Article({ title, kicker, date, readingTime, author, children }: Props) {
  return (
    <article className="max-w-[720px] mx-auto px-6 md:px-0 py-24">
      <div className="kicker mb-6">{kicker}</div>
      <h1 className="display-l mb-6">{title}</h1>
      <div className="flex items-center gap-4 mb-12 mono text-[11px] tracking-[0.16em] uppercase text-mute">
        <span>{author}</span>
        <span>·</span>
        <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
        <span>·</span>
        <span>{readingTime}</span>
      </div>
      <div className="prose prose-lg prose-paper max-w-none
                      prose-headings:serif prose-headings:font-medium prose-headings:tracking-tight
                      prose-p:text-ink-2 prose-p:leading-relaxed
                      prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-ink
                      prose-blockquote:border-l-accent prose-blockquote:text-ink-2 prose-blockquote:not-italic prose-blockquote:font-serif prose-blockquote:text-2xl
                      first-letter:serif first-letter:text-7xl first-letter:font-light first-letter:text-accent first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8]">
        {children}
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add components/Article.tsx && git commit -m "feat(article): MDX article template with drop cap"
```

---

## PHASE 3 — SEO Infrastructure

### Task 3.1: `lib/seo.ts` JSON-LD helpers

- [ ] **Step 1: Create `lib/seo.ts`**

```ts
// lib/seo.ts
const BASE = 'https://strategicsync.com'

type Crumb = { name: string; href: string }

export const breadcrumbs = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${BASE}${c.href}`,
  })),
})

export const serviceSchema = (s: { name: string; description: string; slug: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.name,
  description: s.description,
  url: `${BASE}/services/${s.slug}`,
  provider: { '@type': 'Organization', name: 'Strategic Sync', url: BASE },
  areaServed: { '@type': 'Country', name: 'United States' },
})

export const articleSchema = (a: { title: string; description: string; slug: string; date: string; author: string; type: 'work' | 'journal' }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.title,
  description: a.description,
  url: `${BASE}/${a.type}/${a.slug}`,
  datePublished: a.date,
  author: { '@type': 'Person', name: a.author },
  publisher: { '@type': 'Organization', name: 'Strategic Sync', logo: { '@type': 'ImageObject', url: `${BASE}/images/logo.png` } },
})

export const itemListSchema = (items: { name: string; href: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    url: `${BASE}${it.href}`,
  })),
})

export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Strategic Sync',
  description: 'AI automation and integration for businesses with existing phone, CRM, and workflow systems.',
  url: BASE,
  telephone: '+1-949-998-2424',
  email: 'contact@strategicsync.com',
  priceRange: '$$$',
  areaServed: { '@type': 'AdministrativeArea', name: 'Orange County, CA' },
  address: { '@type': 'PostalAddress', addressLocality: 'San Clemente', addressRegion: 'CA', addressCountry: 'US' },
  geo: { '@type': 'GeoCoordinates', latitude: 33.4269, longitude: -117.612 },
})
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add lib/seo.ts && git commit -m "feat(seo): JSON-LD schema helpers"
```

### Task 3.2: Rewrite `seo.config.ts` (already touched in phone-swap PR)

- [ ] **Step 1: Replace `seo.config.ts`**

```ts
// seo.config.ts
import { DefaultSeoProps } from 'next-seo'

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://strategicsync.com'

const defaultSEO: DefaultSeoProps = {
  defaultTitle: 'Strategic Sync — AI Automation & Integration',
  titleTemplate: '%s · Strategic Sync',
  description: 'We wire AI into the systems you already run — phones, CRMs, billing, workflows. San Clemente, CA.',
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Strategic Sync',
    images: [{ url: `${siteUrl}/api/og?title=Strategic%20Sync`, width: 1200, height: 630, alt: 'Strategic Sync' }],
  },
  twitter: { handle: '@strategicsync', site: '@strategicsync', cardType: 'summary_large_image' },
  additionalMetaTags: [
    { name: 'author', content: 'Strategic Sync' },
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'geo.region', content: 'US-CA' },
    { name: 'geo.placename', content: 'San Clemente' },
    { name: 'geo.position', content: '33.4269;-117.6120' },
  ],
}

export default defaultSEO
```

- [ ] **Step 2: Rewrite `components/SEO.tsx` as thin wrapper**

```tsx
// components/SEO.tsx
import { NextSeo, NextSeoProps } from 'next-seo'

export default function SEO(props: NextSeoProps & { jsonLd?: object[] }) {
  const { jsonLd, ...seo } = props
  return (
    <>
      <NextSeo {...seo} />
      {jsonLd?.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
cd ~/strategic-sync && git add seo.config.ts components/SEO.tsx && git commit -m "feat(seo): default SEO config + thin SEO wrapper"
```

### Task 3.3: `pages/api/og.tsx` (Vercel OG)

- [ ] **Step 1: Create `pages/api/og.tsx`**

```tsx
// pages/api/og.tsx
import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const config = { runtime: 'edge' }

export default function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Strategic Sync'
  const kicker = searchParams.get('kicker') ?? 'AI Automation & Integration'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#f5f1e8',
          color: '#15140f',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7066' }}>
          <div style={{ width: '8px', height: '8px', background: '#f04e23' }} />
          {kicker}
        </div>
        <div style={{ fontSize: '88px', fontWeight: 300, lineHeight: 0.96, letterSpacing: '-0.025em', maxWidth: '900px' }}>
          {title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '20px', color: '#3a3530' }}>
          <span style={{ fontWeight: 500 }}>strategicsync.com</span>
          <span style={{ fontFamily: 'monospace', letterSpacing: '0.16em', fontSize: '16px' }}>SS · 949.998.2424</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

- [ ] **Step 2: Test locally**

Run: `cd ~/strategic-sync && npm run dev` (background). Open `http://localhost:3000/api/og?title=Hello`.
Expected: 1200x630 PNG with paper bg, ink text, orange accent.

- [ ] **Step 3: Commit**

```bash
cd ~/strategic-sync && git add pages/api/og.tsx && git commit -m "feat(og): Vercel OG image generation endpoint"
```

### Task 3.4: `pages/sitemap.xml.tsx` (dynamic)

- [ ] **Step 1: Replace `pages/sitemap.xml.tsx`**

```tsx
// pages/sitemap.xml.tsx
import { GetServerSideProps } from 'next'
import { listIntegrations, listCases, listJournal, listServices } from '../lib/content'

const BASE = 'https://strategicsync.com'

const staticPages = ['', '/services', '/work', '/approach', '/integrations', '/journal', '/pricing', '/contact']

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const today = new Date().toISOString().split('T')[0]

  const services = await listServices()
  const cases = await listCases()
  const integrations = await listIntegrations()
  const journal = await listJournal()

  const urls = [
    ...staticPages.map((p) => ({ loc: `${BASE}${p}`, lastmod: today, priority: p === '' ? '1.0' : '0.8' })),
    ...services.map((s) => ({ loc: `${BASE}/services/${s.slug}`, lastmod: today, priority: '0.7' })),
    ...cases.map((c) => ({ loc: `${BASE}/work/${c.slug}`, lastmod: c.date, priority: '0.6' })),
    ...integrations.map((i) => ({ loc: `${BASE}/integrations/${i.slug}`, lastmod: today, priority: '0.5' })),
    ...journal.map((j) => ({ loc: `${BASE}/journal/${j.slug}`, lastmod: j.date, priority: '0.5' })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function Sitemap() { return null }
```

- [ ] **Step 2: Commit (will fail to build until lib/content.ts exists in Phase 4)**

Defer commit; bundle with content scaffolding in Task 4.4.

### Task 3.5: `pages/robots.txt.tsx`

- [ ] **Step 1: Replace `pages/robots.txt.tsx`**

```tsx
// pages/robots.txt.tsx
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const txt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /client-login
Disallow: /seo-dashboard

Sitemap: https://strategicsync.com/sitemap.xml
`
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, s-maxage=86400')
  res.write(txt)
  res.end()
  return { props: {} }
}

export default function Robots() { return null }
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add pages/robots.txt.tsx && git commit -m "feat(seo): robots.txt with sitemap pointer"
```

### Task 3.6: `next.config.cjs` redirects + MDX

- [ ] **Step 1: Replace `next.config.cjs`**

```js
// next.config.cjs
const withMDX = require('@next/mdx')({ extension: /\.mdx?$/ })

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return [
      { source: '/blog', destination: '/journal', permanent: true },
      { source: '/blog/:slug*', destination: '/journal/:slug*', permanent: true },
      { source: '/booking', destination: '/contact#book', permanent: true },
    ]
  },
}

module.exports = withMDX(nextConfig)
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add next.config.cjs && git commit -m "feat(redirects): blog→journal, booking→contact; enable MDX"
```

---

## PHASE 4 — Content Scaffolding

### Task 4.1: `content/stats.json`

- [ ] **Step 1: Create `content/stats.json`**

```json
[
  { "label": "Calls handled / mo", "value": "12,400", "sub": "+38% QoQ" },
  { "label": "Workflows live", "value": "47", "sub": "across 18 clients" },
  { "label": "Avg time-to-deploy", "value": "11", "sub": "days from kickoff" },
  { "label": "Uptime / 90d", "value": "99.94", "sub": "%" }
]
```

> Numbers above are illustrative; Chad to confirm/replace before launch. File loaded statically; update monthly.

### Task 4.2: `content/services.json`

- [ ] **Step 1: Create `content/services.json`**

```json
[
  {
    "slug": "ai-voice-agents",
    "name": "AI Voice Agents",
    "tagline": "Replace your $300/mo answering service.",
    "description": "AI receptionists deployed on your existing phone number — bookings, intake, screening, multilingual — with full call recordings and CRM sync.",
    "tags": ["FreeSWITCH", "OpenAI Realtime", "Twilio"],
    "starting": "From $1,495 / mo",
    "timeline": "Live in 2 weeks",
    "deliverables": [
      "AI receptionist deployed on your existing number",
      "Custom intake script + brand voice",
      "CRM/calendar sync (HubSpot, Cal.com, Salesforce, etc.)",
      "Multilingual (English, Spanish baseline)",
      "Full call recordings + transcripts",
      "Monthly tuning + script updates"
    ],
    "buyerProfile": "Practices, dealerships, contractors, service businesses spending $300+/mo on answering services or losing after-hours calls."
  },
  {
    "slug": "workflow-integration",
    "name": "Workflow Integration",
    "tagline": "Connect the tools you already pay for.",
    "description": "Wire CRMs, billing, calendars, docs, and Slack into a single agent that knows your business and acts on its behalf.",
    "tags": ["n8n", "Anthropic", "Webhooks"],
    "starting": "From $4,500 (one-time sprint)",
    "timeline": "2-week build",
    "deliverables": [
      "Discovery + integration audit",
      "n8n + Anthropic agent connecting your stack",
      "Custom prompt library + guardrails",
      "Slack/email/SMS handoff for human review",
      "Documentation + 1hr training session",
      "30 days of post-launch tuning"
    ],
    "buyerProfile": "Ops leaders at SMBs whose team manually moves data between 3+ SaaS tools daily."
  },
  {
    "slug": "custom-systems",
    "name": "Custom Systems",
    "tagline": "When off-the-shelf doesn't fit.",
    "description": "Bespoke agents, internal dashboards, RAG pipelines on your own data. We build, document, and train your team to own it.",
    "tags": ["Next.js", "Supabase", "RAG"],
    "starting": "Project-based, from $15,000",
    "timeline": "4–12 weeks",
    "deliverables": [
      "Discovery + technical architecture doc",
      "MVP build (Next.js + Supabase + your stack)",
      "RAG pipeline if document search is in scope",
      "Auth + role-based access",
      "Production deploy (Vercel) + monitoring",
      "Code handoff + 2hr engineering training"
    ],
    "buyerProfile": "Teams with proprietary data or workflows where SaaS won't bend to their model."
  }
]
```

### Task 4.3: `content/integrations/*.json` (10 seed files)

- [ ] **Step 1: Create 10 integration JSON files**

For each of the following, create `content/integrations/<slug>.json`:

| Slug | Name | Category | Use case (1 line) |
|---|---|---|---|
| freeswitch | FreeSWITCH | Telephony | Open-source PBX where AI voice agents live and route calls. |
| openai-realtime | OpenAI Realtime | AI Models | Sub-second voice-to-voice agent for live phone conversations. |
| anthropic-claude | Anthropic Claude | AI Models | Reasoning + tool-use for back-office workflow automation. |
| twilio | Twilio | Telephony | SIP trunking, SMS, and number provisioning for voice agents. |
| stripe | Stripe | Billing | Agents create invoices, subscriptions, and process payments. |
| hubspot | HubSpot | CRM | Voice + chat agents log contacts, tasks, and deals automatically. |
| cal-com | Cal.com | Scheduling | Agents book real availability — no double-booking, no back-and-forth. |
| slack | Slack | Comms | Agent escalations, daily summaries, and human-in-the-loop reviews. |
| n8n | n8n | Workflow | Self-hosted workflow engine that orchestrates multi-system flows. |
| supabase | Supabase | Database | Postgres + auth + storage backbone for custom AI applications. |

Template (use for each):

```json
{
  "slug": "freeswitch",
  "name": "FreeSWITCH",
  "category": "Telephony",
  "useCase": "Open-source PBX where AI voice agents live and route calls.",
  "details": [
    "AI agents run as FreeSWITCH dialplan extensions, not external bots.",
    "Direct SIP integration with Twilio, Telnyx, and direct PSTN providers.",
    "Full call recordings + Graylog audit trail by default."
  ],
  "relatedServices": ["ai-voice-agents", "custom-systems"]
}
```

Repeat for all 10, swapping slug/name/category/useCase/details. Use the table above for slug/name/category/useCase. Write 3 detail bullets per integration based on actual technical fit (Chad to validate).

- [ ] **Step 2: Commit content scaffolding**

```bash
cd ~/strategic-sync && git add content/stats.json content/services.json content/integrations && git commit -m "content: stats, services, 10 seed integrations"
```

### Task 4.4: `lib/content.ts` MDX/JSON loaders + sitemap fix

- [ ] **Step 1: Create `lib/content.ts`**

```ts
// lib/content.ts
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const CONTENT = path.join(process.cwd(), 'content')

export type Service = {
  slug: string
  name: string
  tagline: string
  description: string
  tags: string[]
  starting: string
  timeline: string
  deliverables: string[]
  buyerProfile: string
}

export type Integration = {
  slug: string
  name: string
  category: string
  useCase: string
  details: string[]
  relatedServices: string[]
}

export type CaseFront = {
  slug: string
  client: string
  industry: string
  date: string
  outcome: string
  metric: string
  metricLabel: string
  stack: string[]
  description: string
}

export type JournalFront = {
  slug: string
  title: string
  date: string
  author: string
  description: string
  readingTime: string
  kicker: string
}

export async function listServices(): Promise<Service[]> {
  const raw = await fs.readFile(path.join(CONTENT, 'services.json'), 'utf-8')
  return JSON.parse(raw)
}

export async function listIntegrations(): Promise<Integration[]> {
  const dir = path.join(CONTENT, 'integrations')
  const files = await fs.readdir(dir)
  const items = await Promise.all(
    files.filter((f) => f.endsWith('.json')).map(async (f) => {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8')
      return JSON.parse(raw) as Integration
    })
  )
  return items.sort((a, b) => a.name.localeCompare(b.name))
}

async function listMdx<T extends { slug: string; date: string }>(subdir: string): Promise<(T & { content: string })[]> {
  const dir = path.join(CONTENT, subdir)
  let files: string[]
  try { files = await fs.readdir(dir) } catch { return [] }
  const items = await Promise.all(
    files.filter((f) => f.endsWith('.mdx')).map(async (f) => {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8')
      const { data, content } = matter(raw)
      return { ...(data as T), slug: data.slug ?? f.replace(/\.mdx$/, ''), content }
    })
  )
  return items.sort((a, b) => (b.date > a.date ? 1 : -1))
}

export const listCases = () => listMdx<CaseFront>('cases')
export const listJournal = () => listMdx<JournalFront>('journal')

export const getCase = async (slug: string) => (await listCases()).find((c) => c.slug === slug)
export const getJournalPost = async (slug: string) => (await listJournal()).find((j) => j.slug === slug)
export const getService = async (slug: string) => (await listServices()).find((s) => s.slug === slug)
export const getIntegration = async (slug: string) => (await listIntegrations()).find((i) => i.slug === slug)
```

- [ ] **Step 2: Build to confirm sitemap.xml.tsx now compiles**

Run: `cd ~/strategic-sync && npm run build 2>&1 | tail -20`
Expected: build proceeds (likely still fails on remaining old pages — that's OK). `lib/content.ts` and `pages/sitemap.xml.tsx` should not error.

- [ ] **Step 3: Commit**

```bash
cd ~/strategic-sync && git add lib/content.ts pages/sitemap.xml.tsx && git commit -m "feat(content): MDX/JSON loaders + dynamic sitemap.xml"
```

### Task 4.5: Seed 4 case studies

- [ ] **Step 1: Create 4 MDX files in `content/cases/`**

Filenames + frontmatter (body 200-400 words each — Chad to provide real details, placeholders shown):

`content/cases/strategic-sync-ivr.mdx`:
```mdx
---
slug: strategic-sync-ivr
client: Strategic Sync (internal)
industry: AI Consulting
date: 2026-04-22
outcome: Replaced answering service with AI receptionist routing to live extensions, AI sales line, and voicemail.
metric: 100%
metricLabel: Calls answered after hours
stack: [FreeSWITCH, OpenAI Realtime, Cal.com]
description: How we ate our own dog food — running our main line on the same AI receptionist stack we sell.
---

In April 2026 we cut over our main line — (949) 998-2424 — to a 5-option AI IVR running on our production FreeSWITCH cluster. Calls reach a live extension, an AI sales agent, support, voicemail-to-email, or replay menu. After-hours coverage went from "voicemail then forgotten" to "AI takes the brief, books a slot."

[Body continues — 200-300 more words on stack choices, what surprised us, what we'd do differently. Chad to draft or approve.]
```

Repeat for 3 more case studies. Suggested seed slugs (Chad confirms public-safety):
- `dr-woods-psychiatry.mdx` — psychiatry intake screening, HIPAA-aware messaging
- `titos-automotive-bookings.mdx` — service department after-hours bookings
- `stack-consulting-ai-internal.mdx` — sister-brand workflow automation

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add content/cases && git commit -m "content: 4 seed case studies"
```

### Task 4.6: Migrate existing blog posts to journal

- [ ] **Step 1: Audit existing blog content**

Run: `cd ~/strategic-sync && ls -la pages/blog/ data/ 2>/dev/null`
Note any existing blog post files / data sources. If none, skip migration — Phase 5 builds empty journal index.

- [ ] **Step 2: For each existing post, copy to `content/journal/<slug>.mdx`** with frontmatter:

```mdx
---
slug: post-slug
title: Post Title
date: 2026-04-15
author: Chad McCluskey
description: 1-2 sentence summary for SEO + cards
readingTime: 6 min read
kicker: Field Notes
---

Post body in MDX. Migrate from existing markdown / extract from HTML if needed.
```

- [ ] **Step 3: Commit**

```bash
cd ~/strategic-sync && git add content/journal && git commit -m "content: migrate blog posts to /content/journal"
```

---

## PHASE 5 — Pages (12 — 8 public + service/work/integrations/journal subpages)

### Task 5.1: `pages/index.tsx` (Home)

- [ ] **Step 1: Replace `pages/index.tsx`**

```tsx
// pages/index.tsx
import { GetStaticProps } from 'next'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import StatusStrip from '../components/StatusStrip'
import ServiceCard from '../components/ServiceCard'
import CaseStudyCard from '../components/CaseStudyCard'
import FAQ from '../components/FAQ'
import { listServices, listCases, listIntegrations, type Service, type Integration } from '../lib/content'
import { localBusinessSchema } from '../lib/seo'
import statsData from '../content/stats.json'

type Props = {
  services: Service[]
  cases: Awaited<ReturnType<typeof listCases>>
  integrations: Integration[]
}

const ICONS: Record<string, JSX.Element> = {
  'ai-voice-agents': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><rect x="2" y="6" width="32" height="24" stroke="#15140f" strokeWidth="2" fill="none"/><circle cx="28" cy="10" r="3" fill="#f04e23"/></svg>
  ),
  'workflow-integration': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><path d="M4 18 L18 4 L32 18 L18 32 Z" stroke="#15140f" strokeWidth="2" fill="none"/><circle cx="18" cy="18" r="3" fill="#f04e23"/></svg>
  ),
  'custom-systems': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><rect x="4" y="4" width="28" height="28" stroke="#15140f" strokeWidth="2" fill="none"/><rect x="12" y="12" width="12" height="12" fill="#f04e23"/></svg>
  ),
}

const FAQ_ITEMS = [
  { q: 'How is this different from "an AI strategy consultancy"?', a: 'We ship working systems, not slide decks. Every engagement ends with software live in production and your team trained to own it.' },
  { q: "Do I need to replace my existing phone system?", a: 'No. We deploy AI agents on top of whatever you already use — Sangoma, Yealink, RingCentral, traditional landlines. Your number stays the same.' },
  { q: "What if the AI gets it wrong?", a: 'Every interaction is logged and reviewable. Agents escalate to humans on uncertainty thresholds we set together. Guardrails are your call, not ours.' },
  { q: "Do you sign 12-month contracts?", a: 'No. Voice Agents are month-to-month. Integration Sprints are fixed-scope. Custom Builds are project-based with a defined end date.' },
  { q: "Where are you based?", a: 'San Clemente, CA. We work primarily with US-based businesses but have shipped projects internationally.' },
]

export default function Home({ services, cases, integrations }: Props) {
  return (
    <>
      <SEO
        title="AI Automation & Integration"
        description="We wire AI into the systems you already run — phones, CRMs, billing, workflows. San Clemente, CA."
        canonical="https://strategicsync.com"
        jsonLd={[localBusinessSchema()]}
      />
      <Navbar />
      <Hero
        kicker="AI Automation · Integration · EST. 2023"
        headline={<>We wire AI<br/>into the systems<br/>you <em className="serif italic text-accent">already run.</em></>}
        sub={<><strong className="text-ink">Quietly. Reliably.</strong> Then we hand you the keys.</>}
        aside={{
          label: 'Currently wired',
          body: integrations.slice(0, 8).map((i) => i.name).join(' · '),
        }}
        primaryCta={{ label: 'Start a project', href: '/contact#book' }}
        secondaryCta={{ label: 'Or call (949) 998-2424', href: 'tel:949-998-2424' }}
      />

      <StatusStrip stats={statsData as any} />

      <section className="max-w-wrap mx-auto px-6 md:px-12 py-32">
        <div className="grid md:grid-cols-[120px_1fr_1fr] gap-12 mb-16">
          <div className="kicker">§ 02 — Services</div>
          <h2 className="display-l">Three ways<br/>we <em className="text-accent serif italic">get hired.</em></h2>
          <p className="body pt-3.5">
            Each engagement starts with a 30-minute diagnostic call. If we can't ship measurable value inside 30 days, we won't take the project.
          </p>
        </div>
        <div className="grid md:grid-cols-3 border-t border-rule">
          {services.map((s, i) => (
            <ServiceCard
              key={s.slug}
              num={String(i + 1).padStart(2, '0')}
              total={String(services.length).padStart(2, '0')}
              icon={ICONS[s.slug]}
              title={s.name}
              body={s.description}
              tags={s.tags}
              href={`/services/${s.slug}`}
            />
          ))}
        </div>
      </section>

      {cases.length > 0 && (
        <section className="max-w-wrap mx-auto px-6 md:px-12 py-32 border-t border-rule">
          <div className="grid md:grid-cols-[120px_1fr_1fr] gap-12 mb-16">
            <div className="kicker">§ 03 — Work</div>
            <h2 className="display-l">Things we <em className="text-accent serif italic">shipped.</em></h2>
            <p className="body pt-3.5">Selected case studies. Numbers are real. Names anonymized where contracts require.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {cases.slice(0, 3).map((c) => (
              <CaseStudyCard key={c.slug} industry={c.industry} client={c.client} outcome={c.outcome} metric={c.metric} metricLabel={c.metricLabel} href={`/work/${c.slug}`} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-wrap mx-auto px-6 md:px-12 py-32 border-t border-rule">
        <div className="grid md:grid-cols-[120px_1fr] gap-12 mb-12">
          <div className="kicker">§ 04 — FAQ</div>
          <h2 className="display-l">Common <em className="text-accent serif italic">questions.</em></h2>
        </div>
        <FAQ items={FAQ_ITEMS} />
      </section>

      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [services, cases, integrations] = await Promise.all([listServices(), listCases(), listIntegrations()])
  return { props: { services, cases, integrations } }
}
```

- [ ] **Step 2: Build + dev-server check**

Run: `cd ~/strategic-sync && npm run build 2>&1 | tail -30`
Expected: home page builds. Other pages may still fail.

Run: `cd ~/strategic-sync && npm run dev` (background). Open `http://localhost:3000`. Confirm hero, status strip, services grid, case grid, FAQ render correctly.

- [ ] **Step 3: Commit**

```bash
cd ~/strategic-sync && git add pages/index.tsx && git commit -m "feat(home): industrial-precision homepage"
```

### Task 5.2: `pages/services/index.tsx` + `pages/services/[slug].tsx`

- [ ] **Step 1: Create `pages/services/index.tsx`**

```tsx
// pages/services/index.tsx
import { GetStaticProps } from 'next'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import { listServices, type Service } from '../../lib/content'
import { breadcrumbs, itemListSchema } from '../../lib/seo'
import Link from 'next/link'

export default function ServicesIndex({ services }: { services: Service[] }) {
  return (
    <>
      <SEO
        title="Services — AI Automation & Integration"
        description="AI Voice Agents, Workflow Integration, Custom Systems. Three productized service lines from Strategic Sync."
        jsonLd={[
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }]),
          itemListSchema(services.map((s) => ({ name: s.name, href: `/services/${s.slug}` }))),
        ]}
      />
      <Navbar />
      <Hero
        kicker="§ 02 — Services"
        headline={<>Three productized<br/><em className="serif italic text-accent">service lines.</em></>}
        sub="Each one solves a specific problem with a specific stack. Pick the one that matches what's on fire."
      />
      <div className="max-w-wrap mx-auto px-6 md:px-12 pb-32">
        <div className="border-t border-rule">
          {services.map((s, i) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="block py-12 md:py-16 border-b border-rule group no-underline text-ink">
              <div className="grid md:grid-cols-[80px_1fr_1fr] gap-8 items-start">
                <div className="kicker">{String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}</div>
                <div>
                  <h2 className="display-l mb-3 group-hover:text-accent transition-colors">{s.name}</h2>
                  <p className="body">{s.tagline}</p>
                </div>
                <div>
                  <div className="kicker mb-2">{s.starting}</div>
                  <div className="kicker mb-4 text-ink-2">{s.timeline}</div>
                  <p className="body-s">{s.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {s.tags.map((t) => <span key={t} className="mono text-[10px] tracking-[0.08em] px-2 py-1 bg-paper-2">{t}</span>)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const services = await listServices()
  return { props: { services } }
}
```

- [ ] **Step 2: Create `pages/services/[slug].tsx`**

```tsx
// pages/services/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import ContactBlock from '../../components/ContactBlock'
import { listServices, getService, type Service } from '../../lib/content'
import { breadcrumbs, serviceSchema } from '../../lib/seo'

export default function ServiceDetail({ service }: { service: Service }) {
  return (
    <>
      <SEO
        title={service.name}
        description={service.description}
        canonical={`https://strategicsync.com/services/${service.slug}`}
        jsonLd={[
          serviceSchema(service),
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }, { name: service.name, href: `/services/${service.slug}` }]),
        ]}
      />
      <Navbar />
      <Hero
        kicker={`§ Service · ${service.name}`}
        headline={<><em className="serif italic text-accent">{service.tagline}</em></>}
        sub={service.description}
        aside={{ label: 'Stack', body: service.tags.join(' · ') }}
        primaryCta={{ label: 'Book diagnostic', href: '/contact#book' }}
      />

      <section className="max-w-wrap mx-auto px-6 md:px-12 py-24 border-t border-rule">
        <div className="grid md:grid-cols-[120px_1fr_1fr] gap-12">
          <div className="kicker">Deliverables</div>
          <div>
            <h2 className="display-l mb-8">What you get.</h2>
            <ul className="space-y-4">
              {service.deliverables.map((d) => (
                <li key={d} className="body pl-6 relative before:absolute before:left-0 before:top-2 before:w-3 before:h-px before:bg-accent">{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="border border-rule p-8">
              <div className="kicker mb-3">Starting at</div>
              <div className="serif text-4xl font-light mb-4">{service.starting.replace(/^From /, '')}</div>
              <div className="kicker mb-2">Timeline</div>
              <div className="body mb-6">{service.timeline}</div>
              <div className="kicker mb-2">Best for</div>
              <p className="body-s">{service.buyerProfile}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-rule">
        <ContactBlock />
      </section>
      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const services = await listServices()
  return { paths: services.map((s) => ({ params: { slug: s.slug } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const service = await getService(params!.slug as string)
  if (!service) return { notFound: true }
  return { props: { service } }
}
```

- [ ] **Step 3: Build + commit**

Run: `cd ~/strategic-sync && npm run build 2>&1 | tail -30`
Expected: services pages compile.

```bash
cd ~/strategic-sync && git add pages/services/ && git commit -m "feat(services): index + detail pages"
```

### Task 5.3: `pages/work/index.tsx` + `pages/work/[slug].tsx`

- [ ] **Step 1: Create `pages/work/index.tsx`**

```tsx
// pages/work/index.tsx
import { GetStaticProps } from 'next'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import CaseStudyCard from '../../components/CaseStudyCard'
import { listCases, type CaseFront } from '../../lib/content'
import { breadcrumbs, itemListSchema } from '../../lib/seo'

type Case = CaseFront & { content: string }

export default function WorkIndex({ cases }: { cases: Case[] }) {
  return (
    <>
      <SEO
        title="Work — Case Studies"
        description="Selected case studies. AI voice agents, workflow integrations, custom systems shipped to production."
        jsonLd={[
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Work', href: '/work' }]),
          itemListSchema(cases.map((c) => ({ name: c.client, href: `/work/${c.slug}` }))),
        ]}
      />
      <Navbar />
      <Hero
        kicker="§ 03 — Work"
        headline={<>Things we <em className="serif italic text-accent">shipped.</em></>}
        sub="Real systems running in production. Numbers are real. Names anonymized where contracts require."
      />
      <section className="max-w-wrap mx-auto px-6 md:px-12 pb-32">
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <CaseStudyCard key={c.slug} industry={c.industry} client={c.client} outcome={c.outcome} metric={c.metric} metricLabel={c.metricLabel} href={`/work/${c.slug}`} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const cases = await listCases()
  return { props: { cases } }
}
```

- [ ] **Step 2: Create `pages/work/[slug].tsx`**

```tsx
// pages/work/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Article from '../../components/Article'
import { listCases, getCase, type CaseFront } from '../../lib/content'
import { articleSchema, breadcrumbs } from '../../lib/seo'

type Props = { mdx: MDXRemoteSerializeResult; meta: CaseFront }

export default function CasePage({ mdx, meta }: Props) {
  return (
    <>
      <SEO
        title={`${meta.client} — ${meta.industry}`}
        description={meta.description}
        canonical={`https://strategicsync.com/work/${meta.slug}`}
        jsonLd={[
          articleSchema({ title: meta.client, description: meta.description, slug: meta.slug, date: meta.date, author: 'Strategic Sync', type: 'work' }),
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Work', href: '/work' }, { name: meta.client, href: `/work/${meta.slug}` }]),
        ]}
      />
      <Navbar />
      <Article title={meta.client} kicker={`Case · ${meta.industry}`} date={meta.date} readingTime="5 min read" author="Strategic Sync">
        <div className="not-prose grid grid-cols-3 gap-6 mb-12 border-y border-rule py-8">
          <div><div className="kicker mb-2">Outcome</div><div className="serif text-3xl text-accent">{meta.metric}</div><div className="kicker mt-1">{meta.metricLabel}</div></div>
          <div><div className="kicker mb-2">Stack</div><div className="body-s">{meta.stack.join(', ')}</div></div>
          <div><div className="kicker mb-2">Date</div><div className="body-s">{new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div></div>
        </div>
        <MDXRemote {...mdx} />
      </Article>
      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const cases = await listCases()
  return { paths: cases.map((c) => ({ params: { slug: c.slug } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const c = await getCase(params!.slug as string)
  if (!c) return { notFound: true }
  const mdx = await serialize(c.content)
  const { content, ...meta } = c as any
  return { props: { mdx, meta } }
}
```

- [ ] **Step 3: Commit**

```bash
cd ~/strategic-sync && git add pages/work/ && git commit -m "feat(work): case studies index + MDX detail pages"
```

### Task 5.4: `pages/approach.tsx`

- [ ] **Step 1: Create `pages/approach.tsx`**

```tsx
// pages/approach.tsx
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import { breadcrumbs } from '../lib/seo'

const PHASES = [
  { num: '01', title: 'Diagnose', length: '30 min', body: 'A free call. We map your current stack, identify the highest-leverage automation, and tell you whether AI is even the right answer. If it isn\'t, we\'ll say so.' },
  { num: '02', title: 'Pilot', length: '2 weeks', body: 'Fixed-scope build. We ship one working integration end-to-end so you can hold it in your hands before committing to a bigger engagement.' },
  { num: '03', title: 'Deploy', length: '1 week', body: 'Production cutover. Real traffic. Monitoring, alerting, and human-in-the-loop guardrails wired up. We\'re on call during the transition.' },
  { num: '04', title: 'Hand Off', length: '1 day', body: 'Documentation, video walkthroughs, and 2 hours of training with your team. You own the system. We\'re available on retainer if you want us, but you don\'t need us.' },
]

export default function Approach() {
  return (
    <>
      <SEO
        title="Approach — How We Work"
        description="Four phases: Diagnose, Pilot, Deploy, Hand Off. No 12-month contracts. No vendor lock-in."
        jsonLd={[breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Approach', href: '/approach' }])]}
      />
      <Navbar />
      <Hero
        kicker="§ 04 — Approach"
        headline={<>Four phases.<br/><em className="serif italic text-accent">No lock-in.</em></>}
        sub="We don't sell retainers you can't escape. Every engagement is structured to end with you owning the system, not us holding it hostage."
      />
      <section className="max-w-wrap mx-auto px-6 md:px-12 pb-32">
        <div className="border-t border-rule">
          {PHASES.map((p) => (
            <div key={p.num} className="grid md:grid-cols-[120px_1fr_2fr] gap-8 py-16 border-b border-rule">
              <div>
                <div className="serif text-6xl font-light text-accent leading-none">{p.num}</div>
                <div className="kicker mt-3">{p.length}</div>
              </div>
              <h2 className="display-l">{p.title}</h2>
              <p className="body max-w-[640px]">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <a href="/contact#book" className="btn-ink">Book your diagnostic →</a>
        </div>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add pages/approach.tsx && git commit -m "feat(approach): 4-phase methodology page"
```

### Task 5.5: `pages/integrations/index.tsx` + `[slug].tsx`

- [ ] **Step 1: Create `pages/integrations/index.tsx`**

```tsx
// pages/integrations/index.tsx
import { GetStaticProps } from 'next'
import { useMemo, useState } from 'react'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import IntegrationTile from '../../components/IntegrationTile'
import { listIntegrations, type Integration } from '../../lib/content'
import { breadcrumbs, itemListSchema } from '../../lib/seo'

export default function IntegrationsIndex({ integrations }: { integrations: Integration[] }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('All')

  const categories = useMemo(() => ['All', ...Array.from(new Set(integrations.map((i) => i.category))).sort()], [integrations])
  const filtered = integrations.filter((i) => (cat === 'All' || i.category === cat) && (q === '' || i.name.toLowerCase().includes(q.toLowerCase()) || i.useCase.toLowerCase().includes(q.toLowerCase())))

  return (
    <>
      <SEO
        title="Integrations — Tools We Wire AI Into"
        description="Strategic Sync connects AI agents to FreeSWITCH, Twilio, OpenAI, Anthropic, HubSpot, Stripe, Cal.com, Slack, n8n, Supabase, and more."
        jsonLd={[
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Integrations', href: '/integrations' }]),
          itemListSchema(integrations.map((i) => ({ name: i.name, href: `/integrations/${i.slug}` }))),
        ]}
      />
      <Navbar />
      <Hero
        kicker="§ 05 — Integrations"
        headline={<>Every tool you<br/><em className="serif italic text-accent">already pay for.</em></>}
        sub="The directory of services we wire AI into. Don't see yours? We can probably still do it — most modern SaaS has webhooks or APIs we can hook into."
      />
      <div className="max-w-wrap mx-auto px-6 md:px-12 pb-32">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
          <input
            type="search"
            placeholder="Search integrations…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 bg-transparent border-b border-rule py-3 px-1 text-ink placeholder:text-mute focus:outline-none focus:border-accent"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`mono text-[10px] tracking-[0.16em] uppercase px-3 py-1.5 border ${cat === c ? 'bg-ink text-paper border-ink' : 'border-rule text-ink-2 hover:border-ink'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map((i) => <IntegrationTile key={i.slug} {...i} />)}
        </div>
        {filtered.length === 0 && <p className="body text-mute text-center py-16">No integrations match that filter. <a href="/contact#book" className="text-accent">Ask us about it →</a></p>}
      </div>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const integrations = await listIntegrations()
  return { props: { integrations } }
}
```

- [ ] **Step 2: Create `pages/integrations/[slug].tsx`**

```tsx
// pages/integrations/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import { listIntegrations, getIntegration, listServices, type Integration, type Service } from '../../lib/content'
import { breadcrumbs, serviceSchema } from '../../lib/seo'

type Props = { integration: Integration; relatedServices: Service[] }

export default function IntegrationDetail({ integration, relatedServices }: Props) {
  return (
    <>
      <SEO
        title={`${integration.name} Integration`}
        description={`How Strategic Sync wires AI into ${integration.name}. ${integration.useCase}`}
        canonical={`https://strategicsync.com/integrations/${integration.slug}`}
        jsonLd={[
          serviceSchema({ name: `${integration.name} AI Integration`, description: integration.useCase, slug: integration.slug }),
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Integrations', href: '/integrations' }, { name: integration.name, href: `/integrations/${integration.slug}` }]),
        ]}
      />
      <Navbar />
      <Hero
        kicker={`Integration · ${integration.category}`}
        headline={<>AI for <em className="serif italic text-accent">{integration.name}</em></>}
        sub={integration.useCase}
        primaryCta={{ label: `Wire ${integration.name} into your stack`, href: '/contact#book' }}
      />
      <section className="max-w-wrap mx-auto px-6 md:px-12 py-24 border-t border-rule grid md:grid-cols-2 gap-16">
        <div>
          <div className="kicker mb-6">How we wire it</div>
          <ul className="space-y-4">
            {integration.details.map((d) => (
              <li key={d} className="body pl-6 relative before:absolute before:left-0 before:top-2 before:w-3 before:h-px before:bg-accent">{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="kicker mb-6">Related services</div>
          <div className="space-y-4">
            {relatedServices.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="block border border-rule p-6 hover:bg-paper-2 transition-colors no-underline text-ink">
                <h3 className="serif text-xl font-medium mb-2">{s.name}</h3>
                <p className="body-s">{s.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const items = await listIntegrations()
  return { paths: items.map((i) => ({ params: { slug: i.slug } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const integration = await getIntegration(params!.slug as string)
  if (!integration) return { notFound: true }
  const allServices = await listServices()
  const relatedServices = allServices.filter((s) => integration.relatedServices.includes(s.slug))
  return { props: { integration, relatedServices } }
}
```

- [ ] **Step 3: Commit**

```bash
cd ~/strategic-sync && git add pages/integrations/ && git commit -m "feat(integrations): searchable directory + detail pages"
```

### Task 5.6: `pages/journal/index.tsx` + `[slug].tsx`

- [ ] **Step 1: Create `pages/journal/index.tsx`**

```tsx
// pages/journal/index.tsx
import { GetStaticProps } from 'next'
import Link from 'next/link'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import { listJournal, type JournalFront } from '../../lib/content'
import { breadcrumbs, itemListSchema } from '../../lib/seo'

type Post = JournalFront & { content: string }

export default function JournalIndex({ posts }: { posts: Post[] }) {
  return (
    <>
      <SEO
        title="Journal — Field Notes from Strategic Sync"
        description="Field notes on AI automation, integration patterns, and what we're building."
        jsonLd={[
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Journal', href: '/journal' }]),
          itemListSchema(posts.map((p) => ({ name: p.title, href: `/journal/${p.slug}` }))),
        ]}
      />
      <Navbar />
      <Hero
        kicker="§ 06 — Journal"
        headline={<>Field <em className="serif italic text-accent">notes.</em></>}
        sub="What we're building, what surprised us, what we'd do differently."
      />
      <section className="max-w-wrap mx-auto px-6 md:px-12 pb-32 border-t border-rule">
        {posts.length === 0 ? (
          <p className="body text-mute py-16 text-center">First post coming soon.</p>
        ) : (
          posts.map((p) => (
            <Link key={p.slug} href={`/journal/${p.slug}`} className="block py-12 border-b border-rule no-underline text-ink group">
              <div className="grid md:grid-cols-[160px_1fr] gap-8">
                <div>
                  <div className="kicker mb-2">{p.kicker}</div>
                  <div className="mono text-[11px] text-mute">{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  <div className="mono text-[11px] text-mute mt-1">{p.readingTime}</div>
                </div>
                <div>
                  <h2 className="serif text-3xl font-medium mb-3 group-hover:text-accent">{p.title}</h2>
                  <p className="body max-w-[640px]">{p.description}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await listJournal()
  return { props: { posts } }
}
```

- [ ] **Step 2: Create `pages/journal/[slug].tsx`**

```tsx
// pages/journal/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Article from '../../components/Article'
import { listJournal, getJournalPost, type JournalFront } from '../../lib/content'
import { articleSchema, breadcrumbs } from '../../lib/seo'

type Props = { mdx: MDXRemoteSerializeResult; meta: JournalFront }

export default function JournalPost({ mdx, meta }: Props) {
  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={`https://strategicsync.com/journal/${meta.slug}`}
        jsonLd={[
          articleSchema({ title: meta.title, description: meta.description, slug: meta.slug, date: meta.date, author: meta.author, type: 'journal' }),
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Journal', href: '/journal' }, { name: meta.title, href: `/journal/${meta.slug}` }]),
        ]}
      />
      <Navbar />
      <Article title={meta.title} kicker={meta.kicker} date={meta.date} readingTime={meta.readingTime} author={meta.author}>
        <MDXRemote {...mdx} />
      </Article>
      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await listJournal()
  return { paths: posts.map((p) => ({ params: { slug: p.slug } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const p = await getJournalPost(params!.slug as string)
  if (!p) return { notFound: true }
  const mdx = await serialize(p.content)
  const { content, ...meta } = p as any
  return { props: { mdx, meta } }
}
```

- [ ] **Step 3: Commit**

```bash
cd ~/strategic-sync && git add pages/journal/ && git commit -m "feat(journal): index + MDX article detail (replaces /blog)"
```

### Task 5.7: `pages/pricing.tsx`

- [ ] **Step 1: Create `pages/pricing.tsx`**

```tsx
// pages/pricing.tsx
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import PricingTier from '../components/PricingTier'
import FAQ from '../components/FAQ'
import { breadcrumbs } from '../lib/seo'

const TIERS = [
  {
    name: 'Voice Agent',
    tagline: 'AI receptionist on your existing number.',
    price: 'From $1,495',
    priceNote: 'Per month, month-to-month',
    includes: [
      'AI receptionist live in 2 weeks',
      'Custom intake script + brand voice',
      'CRM/calendar sync (HubSpot, Cal.com, etc.)',
      'Multilingual (English + Spanish)',
      'Full call recordings + transcripts',
      'Monthly script tuning',
    ],
    excludes: [
      'Custom integrations beyond standard CRMs (add Integration Sprint)',
      'Long-term contract',
    ],
    cta: { label: 'Book diagnostic', href: '/contact#book' },
    featured: true,
  },
  {
    name: 'Integration Sprint',
    tagline: '2-week build, fixed scope.',
    price: 'From $4,500',
    priceNote: 'One-time, fixed scope',
    includes: [
      'Discovery + integration audit',
      '1 production-grade workflow shipped',
      'n8n + Anthropic agent setup',
      'Slack/email/SMS handoff',
      'Documentation + 1hr training',
      '30 days post-launch tuning',
    ],
    excludes: [
      'Hosting (we deploy to your Vercel/n8n cloud)',
      'Ongoing retainer (available separately)',
    ],
    cta: { label: 'Scope a sprint', href: '/contact#book' },
  },
  {
    name: 'Custom Build',
    tagline: 'Bespoke system, your codebase.',
    price: 'From $15,000',
    priceNote: 'Project-based',
    includes: [
      'Discovery + technical architecture doc',
      'MVP build (Next.js + Supabase + your stack)',
      'RAG pipeline if applicable',
      'Auth + role-based access',
      'Production deploy + monitoring',
      'Code handoff + 2hr engineering training',
    ],
    excludes: [
      'Ongoing maintenance (retainer available)',
      'Third-party SaaS subscriptions',
    ],
    cta: { label: 'Discuss your project', href: '/contact#book' },
  },
]

const FAQ_ITEMS = [
  { q: "Why no enterprise contracts?", a: "Our work is supposed to make you independent, not locked in. Voice Agents are month-to-month so you can leave any time. Integration Sprints and Custom Builds end with documentation + training so your team owns it." },
  { q: "What if I need more than what's listed?", a: "Every tier can be customized. Pricing here is a starting point. After a 30-min diagnostic call we'll send a fixed quote." },
  { q: "Do you take equity?", a: "No. Cash only. We've found the founders most asking for equity-instead-of-fees are also the ones who couldn't pay even if they wanted to." },
  { q: "How do you handle data security?", a: "All client data stays in your infrastructure (your Supabase, your n8n, your Vercel). We don't operate a multi-tenant SaaS — your stack is yours." },
]

export default function Pricing() {
  return (
    <>
      <SEO
        title="Pricing — Productized AI Services"
        description="Voice Agent from $1,495/mo. Integration Sprint from $4,500. Custom Build from $15,000. Month-to-month, no enterprise contracts."
        jsonLd={[breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Pricing', href: '/pricing' }])]}
      />
      <Navbar />
      <Hero
        kicker="§ 07 — Pricing"
        headline={<>Productized.<br/><em className="serif italic text-accent">No enterprise games.</em></>}
        sub="Three tiers. Real numbers. The price you see is the price you start at — final scope confirmed after a 30-min diagnostic."
      />
      <section className="max-w-wrap mx-auto px-6 md:px-12 pb-32">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {TIERS.map((t) => <PricingTier key={t.name} {...t} />)}
        </div>
      </section>
      <section className="max-w-wrap mx-auto px-6 md:px-12 py-32 border-t border-rule">
        <div className="grid md:grid-cols-[120px_1fr] gap-12 mb-12">
          <div className="kicker">FAQ</div>
          <h2 className="display-l">Pricing <em className="text-accent serif italic">questions.</em></h2>
        </div>
        <FAQ items={FAQ_ITEMS} />
      </section>
      <Footer />
    </>
  )
}
```

> **NOTE for Chad:** Confirm the three starting prices ($1,495 / $4,500 / $15,000) before launch. Set them too low and you attract the wrong buyer; too high and qualified leads bounce.

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add pages/pricing.tsx && git commit -m "feat(pricing): 3-tier productized pricing page"
```

### Task 5.8: Rewrite `pages/contact.tsx`

- [ ] **Step 1: Replace `pages/contact.tsx`**

```tsx
// pages/contact.tsx
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import ContactBlock from '../components/ContactBlock'
import { breadcrumbs, localBusinessSchema } from '../lib/seo'

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact — Book a Diagnostic"
        description="Book a 30-min diagnostic call with Strategic Sync. (949) 998-2424. San Clemente, CA."
        jsonLd={[
          localBusinessSchema(),
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }]),
        ]}
      />
      <Navbar />
      <Hero
        kicker="§ 08 — Contact"
        headline={<>Let's see if we<br/><em className="serif italic text-accent">fit.</em></>}
        sub="Book a 30-minute diagnostic. We'll map your current stack, identify the highest-leverage automation, and tell you whether AI is the right answer. If it isn't, we'll say so."
      />
      <section className="py-16">
        <ContactBlock calLink="strategicsync/30min" />
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/strategic-sync && git add pages/contact.tsx && git commit -m "feat(contact): merged contact + booking page"
```

### Task 5.9: Full build + dev-server smoke test

- [ ] **Step 1: Build**

Run: `cd ~/strategic-sync && npm run build 2>&1 | tail -50`
Expected: all 8 public pages + dynamic routes compile. If any error: fix before proceeding.

- [ ] **Step 2: Dev-server smoke test**

Run: `cd ~/strategic-sync && npm run dev` (background). Visit each route:
- `/`
- `/services`
- `/services/ai-voice-agents`
- `/work`
- `/work/strategic-sync-ivr`
- `/approach`
- `/integrations`
- `/integrations/freeswitch`
- `/journal`
- `/pricing`
- `/contact`
- `/sitemap.xml`
- `/robots.txt`
- `/api/og?title=Test`

Confirm: no 500s, no console errors, layout renders correctly.

- [ ] **Step 3: Verify redirects**

Run: `curl -I http://localhost:3000/blog 2>&1 | head -5 && curl -I http://localhost:3000/booking 2>&1 | head -5`
Expected: both return 308 with Location header pointing to `/journal` and `/contact#book` respectively.

---

## PHASE 6 — Cleanup

### Task 6.1: Delete obsolete components

- [ ] **Step 1: Remove obsolete files**

Run:
```bash
cd ~/strategic-sync && \
  rm -f components/StrategicSyncHero.tsx components/StrategicSyncSEO.tsx components/SEOAudit.tsx components/ConvAI.tsx components/ClientSideMotion.tsx components/index.tsx && \
  rm -f pages/blog.tsx pages/index.tsx.bak 'pages/index.tsx\' && \
  rm -rf pages/blog && \
  rm -f pages/booking.tsx && \
  rm -f output.css
```

- [ ] **Step 2: Build to surface any remaining imports of deleted files**

Run: `cd ~/strategic-sync && npm run build 2>&1 | tail -30`
Expected: build succeeds. If any error references deleted file: fix the importer.

- [ ] **Step 3: Commit**

```bash
cd ~/strategic-sync && git add -A && git commit -m "cleanup: remove obsolete components, blog pages, backup files"
```

### Task 6.2: Confirm dependency cleanup is complete

- [ ] **Step 1: Verify no remaining references**

Run:
```bash
cd ~/strategic-sync && grep -rn "react-icons\|react-scroll\|critters" --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null
```
Expected: no output. If any: refactor those imports inline (use SVGs or remove).

---

## PHASE 7 — Quality Gates

### Task 7.1: Add Lighthouse CI

- [ ] **Step 1: Install Lighthouse CI dev dep**

Run: `cd ~/strategic-sync && npm install -D @lhci/cli`

- [ ] **Step 2: Create `.lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/services",
        "http://localhost:3000/services/ai-voice-agents",
        "http://localhost:3000/work",
        "http://localhost:3000/approach",
        "http://localhost:3000/integrations",
        "http://localhost:3000/pricing",
        "http://localhost:3000/contact"
      ],
      "startServerCommand": "npm run start",
      "startServerReadyPattern": "Ready",
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 1.0 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

- [ ] **Step 3: Create `.github/workflows/lighthouse.yml`**

```yaml
name: Lighthouse CI
on:
  pull_request:
    branches: [main]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - run: npx @lhci/cli@latest autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

- [ ] **Step 4: Commit**

```bash
cd ~/strategic-sync && git add .lighthouserc.json .github/workflows/lighthouse.yml package.json package-lock.json && git commit -m "ci: Lighthouse gates (≥95 perf/a11y/best-practices, 100 SEO)"
```

### Task 7.2: Run Lighthouse locally

- [ ] **Step 1: Build production**

Run: `cd ~/strategic-sync && npm run build`

- [ ] **Step 2: Run Lighthouse autorun**

Run: `cd ~/strategic-sync && npx @lhci/cli@latest autorun 2>&1 | tail -40`
Expected: all assertions pass. If any fail: identify the page + category, fix root cause (image weight, missing alt text, missing meta, layout shift, etc.), re-run.

### Task 7.3: Validate JSON-LD via Rich Results Test

- [ ] **Step 1: Push branch + open Vercel preview URL**

Run: `cd ~/strategic-sync && git push origin rebuild-2026`
Wait for Vercel preview deploy. Get preview URL.

- [ ] **Step 2: Test each schema type**

For each URL below, paste into https://search.google.com/test/rich-results:
- `<preview>/` — expect Organization + ProfessionalService + (FAQPage if FAQ on page)
- `<preview>/services/ai-voice-agents` — expect Service + BreadcrumbList
- `<preview>/work` — expect ItemList + BreadcrumbList
- `<preview>/work/strategic-sync-ivr` — expect Article + BreadcrumbList
- `<preview>/integrations/freeswitch` — expect Service + BreadcrumbList
- `<preview>/contact` — expect ProfessionalService + BreadcrumbList

Expected: zero errors per page. Warnings (e.g., missing optional fields) are acceptable.

---

## PHASE 8 — Merge + Deploy

### Task 8.1: Open PR

- [ ] **Step 1: Open PR on GitHub**

Run:
```bash
cd ~/strategic-sync && gh pr create --base main --head rebuild-2026 --title "Site rebuild: industrial precision + 8-page IA + SEO" --body "$(cat <<'EOF'
## Summary
- Visual rebuild in Industrial Precision aesthetic (Fraunces + IBM Plex, paper/ink/orange palette)
- Expanded IA: 8 public pages (home, services, work, approach, integrations, journal, pricing, contact)
- Technical + on-page SEO: dynamic sitemap, JSON-LD per page type, OG image generation, 95+ Lighthouse gates
- 12 reusable components, full design token system
- 301 redirects: /blog → /journal, /booking → /contact#book
- Phone number 949-998-2424 throughout (already shipped via prior hotfix)

## Spec
docs/superpowers/specs/2026-05-14-strategic-sync-rebuild-design.md

## Test plan
- [x] npm run build succeeds
- [x] npx lhci autorun passes (95+ perf/a11y/best-practices, 100 SEO)
- [ ] Vercel preview reviewed by Chad
- [ ] Rich Results Test clean for Organization/Service/Article/FAQPage/ProfessionalService
- [ ] All 8 routes render without console errors
- [ ] /blog and /booking redirects working

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Wait for Lighthouse CI to pass**

Poll: `cd ~/strategic-sync && gh pr checks --watch`
Expected: green.

### Task 8.2: Final review checklist

- [ ] Chad reviews Vercel preview deploy URL
- [ ] Spot-check phone number on every page
- [ ] Confirm Cal.com link `strategicsync/30min` is real (or update to actual cal.com URL)
- [ ] Confirm pricing tiers ($1,495 / $4,500 / $15,000) are correct
- [ ] Confirm case studies are public-safe (or anonymize before merge)
- [ ] Confirm stats.json numbers are accurate (or update)

### Task 8.3: Merge

- [ ] **Step 1: Merge PR**

Run: `cd ~/strategic-sync && gh pr merge --squash --delete-branch`
Expected: merged. Vercel auto-deploys to production.

- [ ] **Step 2: Smoke test production**

Run:
```bash
sleep 90
curl -s https://strategicsync.com | grep -E "Strategic Sync|949-998-2424" | head -5
curl -sI https://strategicsync.com/blog | head -5
curl -sI https://strategicsync.com/booking | head -5
curl -s https://strategicsync.com/sitemap.xml | head -10
curl -s https://strategicsync.com/robots.txt
```
Expected: home renders correctly, redirects 308 to journal/contact, sitemap valid XML, robots correct.

### Task 8.4: Resubmit sitemap to search engines

- [ ] **Step 1: Google Search Console**

Open https://search.google.com/search-console → Strategic Sync property → Sitemaps → submit `https://strategicsync.com/sitemap.xml`.

- [ ] **Step 2: Bing Webmaster Tools**

Open https://www.bing.com/webmasters → Strategic Sync → Sitemaps → submit same URL.

- [ ] **Step 3: Monitor for 7 days**

Watch Search Console for:
- Coverage errors (expect a brief spike of 404s as old `/blog` URLs hit; redirects should resolve them)
- Sitemap validation status (should reach "Success" within 48hr)
- Core Web Vitals (should hold ≥95 from Lighthouse pre-merge)

---

## Self-review notes

- **Spec coverage**: All 13 spec sections covered. Section 9 (initial content) — case studies and pricing have explicit "Chad to confirm" notes; not blocking the build, but should be filled before public launch.
- **Type consistency**: `Service`, `Integration`, `CaseFront`, `JournalFront` types defined in `lib/content.ts:7-50` and used consistently across pages.
- **Cal.com link**: `strategicsync/30min` is assumed; verify actual link before merge (Task 8.2).
- **Stats.json**: numbers in Task 4.1 are illustrative — Chad to confirm or replace.
- **Lighthouse 95 threshold**: aggressive but achievable with local fonts, next/image, no client-side framework JS bloat. If a specific page misses, the most likely culprits are Cal.com embed (defer-loadable) or framer-motion bundle on hero (already used minimally).
