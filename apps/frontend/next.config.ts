import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons', 'lodash', 'date-fns'],
  },
};

export default nextConfig;
