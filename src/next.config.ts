
import type {NextConfig} from 'next';

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
   async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img2.teletype.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img1.teletype.in',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'img4.teletype.in',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https.