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
