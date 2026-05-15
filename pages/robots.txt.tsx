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
