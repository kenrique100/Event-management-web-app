// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      }
    ]
  },
  productionBrowserSourceMaps: true // Enable source maps in production
};

// Use CommonJS export syntax
module.exports = nextConfig;
