import { DefaultSeoProps } from 'next-seo'

// Default SEO configuration for all pages
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://strategicsync.com'

// Keywords for the business
export const primaryKeywords = [
  'AI consulting',
  'artificial intelligence consulting',
  'business automation',
  'digital transformation',
  'machine learning solutions',
  'AI implementation',
  'business intelligence',
  'data analytics',
  'AI strategy',
  'enterprise AI solutions'
]

// Business information
export const businessInfo = {
  name: 'Strategic Sync',
  phone: '+1-949-529-2424',
  email: 'contact@strategicsync.com',
  address: {
    city: 'San Clemente',
    state: 'CA',
    country: 'US',
  },
  social: {
    twitter: '@strategicsync',
    linkedin: 'https://linkedin.com/company/strategic-sync',
  },
  services: [
    'AI Integration',
    'Business Intelligence', 
    'AI Security',
    'Performance Optimization',
    'Data Management',
    'AI Consulting'
  ]
}

const defaultSEO: DefaultSeoProps = {
  defaultTitle: 'Strategic Sync – AI Consulting & Implementation Services',
  titleTemplate: '%s | Strategic Sync',
  description:
    'Expert AI consulting and implementation services to drive measurable business impact. Transform your operations with cutting-edge AI solutions that deliver real ROI.',
  canonical: siteUrl,
  additionalMetaTags: [
    {
      name: 'keywords',
      content: primaryKeywords.join(', '),
    },
    {
      name: 'author',
      content: businessInfo.name,
    },
    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    {
      name: 'language',
      content: 'en-US',
    },
    {
      name: 'geo.region',
      content: 'US-CA',
    },
    {
      name: 'geo.placename',
      content: 'San Clemente',
    },
    {
      name: 'geo.position',
      content: '33.4269;-117.6120',
    },
    {
      name: 'ICBM',
      content: '33.4269, -117.6120',
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    site_name: businessInfo.name,
    title: 'Strategic Sync – AI Consulting & Implementation Services',
    description: 'Expert AI consulting and implementation services to drive measurable business impact. Transform your operations with cutting-edge AI solutions.',
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Strategic Sync AI Consulting & Implementation',
        type: 'image/jpeg',
      },
      {
        url: `${siteUrl}/images/og-square.jpg`,
        width: 600,
        height: 600,
        alt: 'Strategic Sync Logo',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: businessInfo.social.twitter,
    site: businessInfo.social.twitter,
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
    {
      rel: 'dns-prefetch',
      href: '//fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
      crossOrigin: 'anonymous',
    },
  ],
}

// Local Business Schema
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: businessInfo.name,
  description: 'Expert AI consulting and implementation services to drive measurable business impact',
  url: siteUrl,
  telephone: businessInfo.phone,
  email: businessInfo.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: businessInfo.address.city,
    addressRegion: businessInfo.address.state,
    addressCountry: businessInfo.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.4269,
    longitude: -117.6120,
  },
  sameAs: [
    businessInfo.social.linkedin,
    `https://twitter.com/${businessInfo.social.twitter.replace('@', '')}`,
  ],
  serviceType: businessInfo.services,
  priceRange: '$$$$',
  openingHours: 'Mo-Fr 09:00-17:00',
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
}

// FAQ Schema for common questions
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What AI consulting services do you offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer comprehensive AI consulting services including AI integration, business intelligence, AI security, performance optimization, data management, and strategic AI consulting.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does an AI implementation take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI implementation timelines vary based on project complexity, but most implementations take between 3-6 months from strategy to deployment.',
      },
    },
    {
      '@type': 'Question',
      name: 'What industries do you serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We serve various industries including retail, healthcare, finance, manufacturing, and technology companies looking to implement AI solutions.',
      },
    },
  ],
}

export default defaultSEO