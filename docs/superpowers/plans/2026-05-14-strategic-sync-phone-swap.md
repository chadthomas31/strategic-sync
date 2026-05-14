# Strategic Sync — Phone Number Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `949-529-2424` with `949-998-2424` across all production code, ship as standalone hotfix PR before rebuild.

**Architecture:** Pure find-and-replace across 7 files. No tests (project has no test suite). Verification = grep returns zero hits + `npm run build` succeeds + dev server visual check.

**Tech Stack:** Next.js 14 Pages Router, TypeScript, npm.

---

### Task 1: Phone number swap

**Files:**
- Modify: `seo.config.ts:23`
- Modify: `components/Navbar.tsx:198,201`
- Modify: `components/SEO.tsx:78`
- Modify: `pages/_document.tsx:13,66`
- Modify: `pages/index.tsx:477,483,659`
- Modify: `pages/contact.tsx:199,200`
- Modify: `scripts/testBlogUpdate.ts:21` (script-only, includes test HTML with old number — update for consistency)

- [ ] **Step 1: Confirm CWD**

Run: `cd ~/strategic-sync && pwd`
Expected: `/home/runninja/strategic-sync`

- [ ] **Step 2: Pre-change grep — capture baseline**

Run: `grep -rn "529-2424\|5292424\|529 2424\|529.2424" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.md" 2>/dev/null`
Expected: 7 source files matched (seo.config.ts, components/Navbar.tsx, components/SEO.tsx, pages/_document.tsx, pages/index.tsx, pages/contact.tsx, scripts/testBlogUpdate.ts).

- [ ] **Step 3: Update `seo.config.ts:23`**

Edit `seo.config.ts`:
```ts
// BEFORE
  phone: '+1-949-529-2424',
// AFTER
  phone: '+1-949-998-2424',
```

- [ ] **Step 4: Update `components/Navbar.tsx:198,201`**

Edit `components/Navbar.tsx`:
```tsx
// BEFORE
                      href="tel:949-529-2424"
                    >
                      949-529-2424
// AFTER
                      href="tel:949-998-2424"
                    >
                      949-998-2424
```

- [ ] **Step 5: Update `components/SEO.tsx:78`**

Edit `components/SEO.tsx`:
```ts
// BEFORE
      telephone: '+1-949-529-2424',
// AFTER
      telephone: '+1-949-998-2424',
```

- [ ] **Step 6: Update `pages/_document.tsx:13,66`**

Edit `pages/_document.tsx` — both occurrences (use `replace_all` if both lines are identical strings):
```ts
// BEFORE (both lines)
      telephone: '+1-949-529-2424',
// AFTER
      telephone: '+1-949-998-2424',
```

- [ ] **Step 7: Update `pages/index.tsx:477,483,659`**

Edit `pages/index.tsx`:
```tsx
// Line 477 BEFORE
                  <a href="tel:949-529-2424" className="flex items-center gap-4 text-[#a0a0a0] hover:text-[#00f0ff] transition-colors group">
// Line 477 AFTER
                  <a href="tel:949-998-2424" className="flex items-center gap-4 text-[#a0a0a0] hover:text-[#00f0ff] transition-colors group">

// Line 483 BEFORE
                      <div className="font-medium text-white">949-529-2424</div>
// Line 483 AFTER
                      <div className="font-medium text-white">949-998-2424</div>

// Line 659 BEFORE
                    <a href="tel:949-529-2424" className="footer-link">949-529-2424</a>
// Line 659 AFTER
                    <a href="tel:949-998-2424" className="footer-link">949-998-2424</a>
```

- [ ] **Step 8: Update `pages/contact.tsx:199,200`**

Edit `pages/contact.tsx`:
```tsx
// BEFORE
                  value: '(949) 529-2424',
                  href: 'tel:949-529-2424',
// AFTER
                  value: '(949) 998-2424',
                  href: 'tel:949-998-2424',
```

- [ ] **Step 9: Update `scripts/testBlogUpdate.ts:21`**

Edit `scripts/testBlogUpdate.ts` — string contains old number twice in JSON-LD inside an HTML test fixture:
```ts
// Replace within line 21 (use sed for safety since line is huge)
```
Run: `cd ~/strategic-sync && sed -i 's/+1-949-529-2424/+1-949-998-2424/g' scripts/testBlogUpdate.ts`
Expected: silent success.

- [ ] **Step 10: Post-change grep — verify zero hits**

Run: `cd ~/strategic-sync && grep -rn "529-2424\|5292424\|529 2424\|529.2424" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.md" 2>/dev/null; echo "exit=$?"`
Expected: no output, `exit=1` (grep found nothing).

- [ ] **Step 11: Verify new number present in expected count**

Run: `cd ~/strategic-sync && grep -rn "998-2424" --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null | wc -l`
Expected: ≥10 (covers 7 files, some have multiple occurrences).

- [ ] **Step 12: Build to confirm no TypeScript regressions**

Run: `cd ~/strategic-sync && npm run build 2>&1 | tail -30`
Expected: `Compiled successfully` and no errors. Warnings about pre-existing issues (not from these edits) are acceptable.

- [ ] **Step 13: Dev-server visual check**

Run: `cd ~/strategic-sync && npm run dev` (background)
Open `http://localhost:3000` in browser. Confirm new number visible in:
- Top-right navbar phone link
- Footer phone link on home
- Contact page phone block

Stop dev server (Ctrl-C in terminal that started it) when done.

- [ ] **Step 14: Commit**

Run:
```bash
cd ~/strategic-sync && git add seo.config.ts components/Navbar.tsx components/SEO.tsx pages/_document.tsx pages/index.tsx pages/contact.tsx scripts/testBlogUpdate.ts && git commit -m "$(cat <<'EOF'
fix: update phone number to 949-998-2424 across site

Old number 949-529-2424 replaced everywhere. Hotfix shipped
ahead of rebuild-2026 site overhaul.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```
Expected: commit succeeds, lists 7 files changed.

- [ ] **Step 15: Push to main → Vercel auto-deploy**

Run: `cd ~/strategic-sync && git push origin main`
Expected: push succeeds. Vercel will auto-deploy within ~2 min.

- [ ] **Step 16: Verify production**

After Vercel deploy completes, open `https://strategicsync.com` and confirm:
- Navbar shows `949-998-2424`
- Footer phone link shows `949-998-2424`
- `/contact` shows `(949) 998-2424`

Run: `curl -s https://strategicsync.com | grep -o "949-[0-9]*-2424" | sort -u`
Expected: `949-998-2424` (only).
