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
      }
    ],
    formats: ['image/webp', 'image/avif'],
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
