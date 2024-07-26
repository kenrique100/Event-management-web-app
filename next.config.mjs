/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'utfs.io',
          port: ''
        }
      ]
    },
    productionBrowserSourceMaps: true,  // Enable source maps in production
  };
  
  export default nextConfig;
  