
/** @type {import('next').NextConfig} */
if (process.env.NODE_ENV === 'development') {
  try {
    const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
    initOpenNextCloudflareForDev();
  } catch {
    // The adapter is optional for local Node.js development.
  }
}

const nextConfig = {
  output: process.env.NETLIFY ? undefined : 'standalone',
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
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'hls.js': require.resolve('hls.js'),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
