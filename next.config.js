
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
  experimental: {},
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
