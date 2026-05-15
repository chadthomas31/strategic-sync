// pages/_app.tsx
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import defaultSEO from '../seo.config'
import { fraunces, plexSans, plexMono } from '../lib/fonts'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} font-sans`}>
      <DefaultSeo {...defaultSEO} />
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </div>
  )
}
