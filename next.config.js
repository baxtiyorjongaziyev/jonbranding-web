
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    urlImports: [
      "https://framer.com/m/",
      "https://framerusercontent.com/",
      "https://ga.jspm.io/",
      "https://jspm.dev/",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'img1.teletype.in' },
      { protocol: 'https', hostname: 'img2.teletype.in' },
      { protocol: 'https', hostname: 'img3.teletype.in' },
      { protocol: 'https', hostname: 'img4.teletype.in' },
      { protocol: 'https', hostname: 'cdn.prod.website-files.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
  },
};

module.exports = nextConfig;
