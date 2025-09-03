
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
  env: {
      AIRTABLE_API_KEY: 'keyek4uDxgA6oZsBO',
      AIRTABLE_BASE_ID: 'app8xoyx1XCumYFXV',
      AIRTABLE_TABLE_NAME_FAQ: 'FAQ',
      AIRTABLE_TABLE_NAME_TESTIMONIALS: 'Testimonials',
      AIRTABLE_TABLE_NAME_BRANDS: 'Brands',
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
