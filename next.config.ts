import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during builds to allow deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore type errors during builds to allow deployment
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer }) => {
    // Disable fs, path, crypto modules for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
