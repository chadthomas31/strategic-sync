import { GetServerSideProps } from 'next'

function RobotsTxt() {
  // This function will not be executed
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://strategicsync.com'

  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin pages
Disallow: /admin/
Disallow: /private/
Disallow: /_next/
Disallow: /api/

# Allow specific API endpoints for SEO
Allow: /api/blog/posts

# Block AI training bots (optional)
User-agent: ChatGPT-User
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /`

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(robotsTxt)
  res.end()

  return {
    props: {},
  }
}

export default RobotsTxt 