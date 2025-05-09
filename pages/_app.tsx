import React from 'react';
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";

// Import ConvAI component dynamically with SSR disabled
const ConvAI = dynamic(
  () => import('../components/ConvAI'),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Strategic Sync - AI Solutions for Business</title>
        <meta name="description" content="Transform your business with Strategic Sync's AI solutions. Expert consulting, implementation, and optimization services." />
      </Head>
      <Navbar />
      <Component {...pageProps} />
      <ConvAI />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
