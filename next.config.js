/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NETLIFY ? undefined : 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/xizmatlar/brand-strategy',
        destination: '/uz/xizmatlar/brand-strategiyasi',
        permanent: true,
      },
      {
        source: '/uz/xizmatlar/brand-strategy',
        destination: '/uz/xizmatlar/brand-strategiyasi',
        permanent: true,
      },
      {
        source: '/ru/xizmatlar/brand-strategy',
        destination: '/ru/xizmatlar/brand-strategiyasi',
        permanent: true,
      },
      {
        source: '/en/xizmatlar/brand-strategy',
        destination: '/en/xizmatlar/brand-strategiyasi',
        permanent: true,
      },
      {
        source: '/zh/xizmatlar/brand-strategy',
        destination: '/zh/xizmatlar/brand-strategiyasi',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.sanity.io', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.prod.website-files.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
