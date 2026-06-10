// lib/seo.ts
const BASE = 'https://strategicsync.com'

type Crumb = { name: string; href: string }

export const breadcrumbs = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${BASE}${c.href}`,
  })),
})

export const serviceSchema = (s: { name: string; description: string; slug: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.name,
  description: s.description,
  url: `${BASE}/services/${s.slug}`,
  provider: { '@type': 'Organization', name: 'Strategic Sync', url: BASE },
  areaServed: { '@type': 'Country', name: 'United States' },
})

export const articleSchema = (a: { title: string; description: string; slug: string; date: string; author: string; type: 'work' | 'journal' }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.title,
  description: a.description,
  url: `${BASE}/${a.type}/${a.slug}`,
  datePublished: a.date,
  author: { '@type': 'Person', name: a.author },
  publisher: { '@type': 'Organization', name: 'Strategic Sync', logo: { '@type': 'ImageObject', url: `${BASE}/images/logo.png` } },
})

export const itemListSchema = (items: { name: string; href: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    url: `${BASE}${it.href}`,
  })),
})

export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'ComputerStore'],
  name: 'Strategic Sync',
  description: 'Orange County IT services — computer and Mac repair, networking and WiFi, IT support and managed IT, and security camera installs. Onsite across Orange County and remote support.',
  url: BASE,
  telephone: '+1-949-998-2424',
  email: 'contact@strategicsync.com',
  priceRange: '$$',
  serviceType: ['Computer Repair', 'Networking', 'IT Support', 'Managed IT', 'Security Camera Installation', 'Smart Home Installation'],
  areaServed: { '@type': 'AdministrativeArea', name: 'Orange County, CA' },
  address: { '@type': 'PostalAddress', addressLocality: 'San Clemente', addressRegion: 'CA', addressCountry: 'US' },
  geo: { '@type': 'GeoCoordinates', latitude: 33.4269, longitude: -117.612 },
})
