import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Strategic Sync',
    description: 'AI consulting and implementation services for business transformation',
    url: 'https://strategicsync.com',
    logo: 'https://strategicsync.com/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-949-529-2424',
      contactType: 'Customer Support',
      availableLanguage: 'English',
      areaServed: 'US',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Juan Capistrano',
      addressRegion: 'California',
      addressCountry: 'US',
    },
    sameAs: [
      'https://www.linkedin.com/company/strategic-sync',
      'https://twitter.com/strategicsync',
      'https://www.facebook.com/strategicsync',
    ],
    service: [
      {
        '@type': 'Service',
        name: 'AI Strategy Consulting',
        description: 'Comprehensive AI strategy development and planning services',
        provider: {
          '@type': 'Organization',
          name: 'Strategic Sync',
        },
      },
      {
        '@type': 'Service',
        name: 'AI Implementation',
        description: 'End-to-end AI solution implementation and integration services',
        provider: {
          '@type': 'Organization',
          name: 'Strategic Sync',
        },
      },
      {
        '@type': 'Service',
        name: 'AI Optimization',
        description: 'AI system optimization and performance enhancement services',
        provider: {
          '@type': 'Organization',
          name: 'Strategic Sync',
        },
      },
    ],
  }

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Strategic Sync',
    description: 'Expert AI consulting and implementation services for business transformation',
    url: 'https://strategicsync.com',
    telephone: '+1-949-529-2424',
    email: 'info@strategicsync.com',
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    },
    serviceType: [
      'AI Consulting',
      'AI Implementation', 
      'Business Intelligence',
      'Machine Learning Services',
      'AI Strategy Development'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Juan Capistrano',
      addressRegion: 'California',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.5017',
      longitude: '-117.6628'
    }
  }

  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0066cc" />
        <meta name="msapplication-TileColor" content="#0066cc" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Structured Data - Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional SEO Tags */}
        <meta name="author" content="Strategic Sync" />
        <meta name="publisher" content="Strategic Sync" />
        <meta name="copyright" content="Strategic Sync" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        
        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
