import { DefaultSeoProps } from 'next-seo'

// Default SEO configuration for all pages
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://strategicsync.com'

const defaultSEO: DefaultSeoProps = {
  defaultTitle: 'Strategic Sync – AI Consulting & Implementation Services',
  titleTemplate: '%s | Strategic Sync',
  description:
    'Expert AI consulting and implementation services to drive measurable business impact. Transform your operations with cutting-edge AI solutions.',
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    site_name: 'Strategic Sync',
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Strategic Sync AI Consulting & Implementation',
      },
    ],
  },
  twitter: {
    handle: '@strategicsync',
    site: '@strategicsync',
    cardType: 'summary_large_image',
  },
}

export default defaultSEO