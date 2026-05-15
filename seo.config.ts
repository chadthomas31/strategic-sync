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
