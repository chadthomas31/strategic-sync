import Head from 'next/head'
import { siteUrl } from '../seo.config'

interface SEOProps {
  title: string
  description: string
  path?: string
  image?: string
}

export default function SEO({
  title,
  description,
  path = '',
  image = '/images/og-image.jpg',
}: SEOProps) {
  const url = `${siteUrl}${path}`
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: title,
            description,
            url,
            image: imageUrl,
          }),
        }}
      />
    </Head>
  )
}