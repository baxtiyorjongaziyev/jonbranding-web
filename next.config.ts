require('dotenv').config({ path: './.env.local' });
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  publicRuntimeConfig: {
      AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
      AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
      AIRTABLE_TABLE_NAME_FAQ: process.env.AIRTABLE_TABLE_NAME_FAQ,
      AIRTABLE_TABLE_NAME_TESTIMONIALS: process.env.AIRTABLE_TABLE_NAME_TESTIMONIALS,
      AIRTABLE_TABLE_NAME_BRANDS: process.env.AIRTABLE_TABLE_NAME_BRANDS,
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
        hostname: 'cdn.prod.website-files.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
