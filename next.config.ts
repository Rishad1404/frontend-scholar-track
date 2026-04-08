import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',           
        pathname: '/dvskpbmoa/**', 
      },
    ],
  },
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'https://backend-scholar-track.vercel.app/api/auth/:path*',
      },
      {
        source: '/api/v1/:path*',
        destination: 'https://backend-scholar-track.vercel.app/api/v1/:path*',
      }
    ]
  }
};

export default nextConfig;