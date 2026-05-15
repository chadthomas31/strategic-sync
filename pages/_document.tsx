// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Strategic Sync',
  url: 'https://strategicsync.com',
  logo: 'https://strategicsync.com/images/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-949-998-2424',
    contactType: 'Sales',
    email: 'contact@strategicsync.com',
    areaServed: 'US',
    availableLanguage: 'English',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'San Clemente',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  sameAs: [
    'https://www.linkedin.com/company/strategic-sync',
    'https://twitter.com/strategicsync',
  ],
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f04e23" />
        <link rel="preconnect" href="https://cal.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </Head>
      <body className="bg-paper text-ink antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
