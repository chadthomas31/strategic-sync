// components/SEO.tsx
import { NextSeo, NextSeoProps } from 'next-seo'

export default function SEO(props: NextSeoProps & { jsonLd?: object[] }) {
  const { jsonLd, ...seo } = props
  return (
    <>
      <NextSeo {...seo} />
      {jsonLd?.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
