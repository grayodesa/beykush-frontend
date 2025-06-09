import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.beykush.com',
      },
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@apollo/client', 'zustand'],
  },
};

export default nextConfig;
