import type { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import defaultSEO from '../seo.config'
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import dynamic from 'next/dynamic'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Import ConvAI component dynamically with SSR disabled
const ConvAI = dynamic(
  () => import('../components/ConvAI'),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...defaultSEO} />
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
      <ConvAI />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
