import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ufs.sh', // UploadThing CDN (new format with dynamic subdomains)
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
