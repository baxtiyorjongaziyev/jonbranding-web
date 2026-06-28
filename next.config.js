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
      {
        source: '/presentation',
        destination: '/uz/presentation',
        permanent: true,
      },
    ];
  },
  experimental: {
    optimizeCss: true,
  },
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'hls.js': require.resolve('hls.js'),
    };
    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              process.env.NODE_ENV === 'development'
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://mc.yandex.ru https://static.hotjar.com https://script.hotjar.com https://www.clarity.ms https://cdn.amplitude.com"
                : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://mc.yandex.ru https://static.hotjar.com https://script.hotjar.com https://www.clarity.ms https://cdn.amplitude.com",
              "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com",
              "font-src 'self' data: https://api.fontshare.com https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://cdn.sanity.io https://cdn.prod.website-files.com https://images.unsplash.com https://www.google-analytics.com https://mc.yandex.ru https://www.googletagmanager.com https://www.clarity.ms https://www.facebook.com",
              "connect-src 'self' https://cdn.sanity.io https://h6ymmj0v.api.sanity.io https://www.google-analytics.com https://analytics.google.com https://mc.yandex.ru https://in.hotjar.com https://vc.hotjar.io https://o.clarity.ms https://api.amplitude.com https://region1.google-analytics.com wss://ws.hotjar.com https://www.facebook.com",
              "media-src 'self' https://cdn.sanity.io https://player.vimeo.com https://*.vimeocdn.com blob:",
              "frame-src 'self' https://player.vimeo.com https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
