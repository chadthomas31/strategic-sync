// pages/_app.tsx
import type { AppProps } from 'next/app'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import defaultSEO from '../seo.config'
import { fraunces, plexSans, plexMono } from '../lib/fonts'
import '../styles/globals.css'

const GA_ID = 'G-99N4YNXSSS'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      <div className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} font-sans`}>
        <DefaultSeo {...defaultSEO} />
        <Component {...pageProps} />
        <Analytics />
        <SpeedInsights />
      </div>
    </>
  )
}
