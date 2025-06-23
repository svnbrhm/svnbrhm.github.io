/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Image optimization - Modern remotePatterns configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dl.airtable.com',
      },
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'attachments.airtable.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'runningcrews.com',
      },
      {
        protocol: 'https',
        hostname: 'airtable.com',
      }
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Increase timeout for static generation to handle large datasets
  staticPageGenerationTimeout: 180,

  // Enable ISR optimizations
  experimental: {
    // ISR memory cache configuration removed as it's not a valid option
  },

  // Environment variables
  env: {
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
  },

  // ISR and caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;
