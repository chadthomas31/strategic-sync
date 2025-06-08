import { GetServerSideProps } from 'next'

function Sitemap() {
  // This function will not be executed
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://strategicsync.com'

  // Static pages
  const staticPages = [
    '',
    '/services',
    '/blog',
    '/contact',
    '/booking',
    '/client-login',
    '/seo-dashboard',
  ]

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map((page) => {
      const path = page === '' ? '' : page
      const priority = page === '' ? '1.0' : '0.8'
      const changefreq = page === '' ? 'weekly' : page === '/blog' ? 'daily' : 'monthly'
      
      return `
    <url>
      <loc>${baseUrl}${path}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>`
    })
    .join('')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap 