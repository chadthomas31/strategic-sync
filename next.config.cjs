// next.config.cjs
const withMDX = require('@next/mdx')({ extension: /\.mdx?$/ })

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strategicsync.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
  distDir: '.next',
  generateEtags: false,
  poweredByHeader: false,
  trailingSlash: false,
  productionBrowserSourceMaps: false,
  async redirects() {
    return [
      { source: '/blog', destination: '/journal', permanent: true },
      { source: '/blog/:slug*', destination: '/journal/:slug*', permanent: true },
      { source: '/booking', destination: '/contact#book', permanent: true },
    ]
  },
}

module.exports = withMDX(nextConfig)
