/** @type {import('next').NextConfig} */
if (process.env.NODE_ENV === 'development') {
  try {
    const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
    initOpenNextCloudflareForDev();
  } catch {
    // The adapter is optional for local Node.js development.
  }
}

const isDev = process.env.NODE_ENV === 'development';

// Tashqi skriptlar uchun ruxsatlar har bir vositaning rasmiy CSP qo'llanmasidan
// olingan. Biror domen tushib qolsa, brauzer skriptni jimgina bloklaydi —
// Google Ads konversiyasi va Clarity aynan shunday o'chib qolgan edi.
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    // GTM, GA4, Google Ads
    'https://*.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://www.googleadservices.com',
    'https://googleads.g.doubleclick.net',
    'https://pagead2.googlesyndication.com',
    'https://www.google.com',
    // Meta Pixel
    'https://connect.facebook.net',
    // Yandex Metrika
    'https://mc.yandex.ru',
    'https://yastatic.net',
    // Hotjar
    'https://*.hotjar.com',
    // Microsoft Clarity
    'https://*.clarity.ms',
    'https://c.bing.com',
    // Amplitude
    'https://cdn.amplitude.com',
    // Cloudflare Turnstile
    'https://challenges.cloudflare.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://api.fontshare.com',
    'https://fonts.googleapis.com',
    'https://*.hotjar.com',
  ],
  'font-src': [
    "'self'",
    'data:',
    'https://api.fontshare.com',
    'https://fonts.gstatic.com',
    'https://*.hotjar.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://cdn.sanity.io',
    'https://cdn.prod.website-files.com',
    'https://images.unsplash.com',
    'https://*.google-analytics.com',
    'https://*.googletagmanager.com',
    'https://googleads.g.doubleclick.net',
    'https://www.googleadservices.com',
    'https://pagead2.googlesyndication.com',
    'https://www.google.com',
    'https://www.google.co.uz',
    'https://www.facebook.com',
    'https://mc.yandex.ru',
    'https://mc.yandex.com',
    'https://*.hotjar.com',
    'https://*.clarity.ms',
    'https://c.bing.com',
  ],
  'connect-src': [
    "'self'",
    ...(isDev ? ['ws://localhost:*', 'ws://127.0.0.1:*'] : []),
    'https://cdn.sanity.io',
    'https://h6ymmj0v.api.sanity.io',
    'https://*.google-analytics.com',
    'https://analytics.google.com',
    'https://*.analytics.google.com',
    'https://*.googletagmanager.com',
    'https://googleads.g.doubleclick.net',
    'https://www.googleadservices.com',
    'https://pagead2.googlesyndication.com',
    'https://www.google.com',
    'https://www.facebook.com',
    'https://mc.yandex.ru',
    'https://mc.yandex.com',
    'https://*.hotjar.com',
    'https://*.hotjar.io',
    'wss://*.hotjar.com',
    'https://*.clarity.ms',
    'https://c.bing.com',
    'https://api.amplitude.com',
    'https://api2.amplitude.com',
  ],
  'media-src': [
    "'self'",
    'https://cdn.sanity.io',
    'https://player.vimeo.com',
    'https://*.vimeocdn.com',
    'blob:',
  ],
  'frame-src': [
    "'self'",
    'https://player.vimeo.com',
    'https://www.google.com',
    'https://challenges.cloudflare.com',
    'https://td.doubleclick.net',
    'https://*.googletagmanager.com',
    'https://mc.yandex.ru',
    'https://mc.yandex.com',
    'https://*.hotjar.com',
    'blob:',
  ],
  'worker-src': ["'self'", 'blob:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
};

const contentSecurityPolicy = [
  ...Object.entries(cspDirectives).map(([directive, sources]) => `${directive} ${sources.join(' ')}`),
  ...(process.env.NODE_ENV === 'production' ? ['upgrade-insecure-requests'] : []),
].join('; ');

const nextConfig = {
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  output: process.env.NEXT_STANDALONE === 'true' ? 'standalone' : undefined,
  allowedDevOrigins: ['127.0.0.1'],
  async redirects() {
    return [
      // Narxlar sahifasi `/narxlar` da. `/tariflar` bir muddat uni ko'rsatgan,
      // shuning uchun eski manzil haqiqiy sahifaga yo'naltiriladi.
      { source: '/tariflar', destination: '/narxlar', permanent: true },
      { source: '/:lang(ru|en|zh)/tariflar', destination: '/:lang/narxlar', permanent: true },
      // Eski slaydli taqdimot `/credentials` bilan almashtirildi.
      { source: '/presentation', destination: '/credentials', permanent: true },
      { source: '/:lang(ru|en|zh)/presentation', destination: '/:lang/credentials', permanent: true },
      // Brand Strategy xizmati `/brand-strategy` ga birlashtirildi. Yagona joy shu
      // (proxy'dan oldin ishlaydi); til prefiksi saqlanadi.
      { source: '/:uz(uz)?/xizmatlar/:old(brand-strategiyasi|brand-strategy)', destination: '/brand-strategy', permanent: true },
      { source: '/:lang(ru|en|zh)/xizmatlar/:old(brand-strategiyasi|brand-strategy)', destination: '/:lang/brand-strategy', permanent: true },
    ];
  },
  experimental: {
    cpus: 1,
  },
  turbopack: {
    root: __dirname,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'hls.js': require.resolve('hls.js'),
    };
    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
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
            value: contentSecurityPolicy,
          },
        ],
      },
      ...(process.env.NODE_ENV === 'production'
        ? [
            {
              source: '/images/(.*)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=86400, stale-while-revalidate=604800',
                },
              ],
            },
          ]
        : []),
    ];
  },
};

module.exports = nextConfig;
