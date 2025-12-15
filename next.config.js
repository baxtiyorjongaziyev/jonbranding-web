/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig;
