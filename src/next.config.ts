
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
        protocol: 'https',
        hostname: 'img3.teletype.in',
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
    ],
  },
};

export default nextConfig;
