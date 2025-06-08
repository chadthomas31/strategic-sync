import Head from 'next/head'
import { siteUrl } from '../seo.config'

interface SEOProps {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'service'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  keywords?: string[]
  schema?: any
}

export default function SEO({
  title,
  description,
  path = '',
  image = '/images/og-image.jpg',
  type = 'website',
  author = 'Strategic Sync',
  publishedTime,
  modifiedTime,
  keywords = ['AI consulting', 'artificial intelligence', 'business automation', 'digital transformation', 'machine learning'],
  schema,
}: SEOProps) {
  const url = `${siteUrl}${path}`
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  // Default schema.org structured data
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebPage',
    name: title,
    description,
    url,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Organization',
      name: author,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Strategic Sync',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
  }

  // Organization schema for homepage
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Strategic Sync',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: 'Expert AI consulting and implementation services to drive measurable business impact',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-949-529-2424',
      contactType: 'customer service',
      email: 'contact@strategicsync.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Clemente',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    sameAs: [
      'https://linkedin.com/company/strategic-sync',
      'https://twitter.com/strategicsync',
    ],
    service: [
      {
        '@type': 'Service',
        name: 'AI Integration',
        description: 'Custom AI solutions tailored to your business needs',
      },
      {
        '@type': 'Service',
        name: 'Business Intelligence',
        description: 'Transform your data into actionable insights',
      },
      {
        '@type': 'Service',
        name: 'AI Security',
        description: 'Ensure your AI implementations are secure and compliant',
      },
    ],
  }

  const finalSchema = schema || (path === '/' ? organizationSchema : defaultSchema)

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="language" content="English" />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Strategic Sync" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@strategicsync" />
      <meta name="twitter:creator" content="@strategicsync" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon and Web App Manifest */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#0066cc" />
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalSchema),
        }}
      />
    </Head>
  )
}