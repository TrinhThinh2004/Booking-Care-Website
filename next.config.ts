import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['bcryptjs', 'sequelize'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'mysql2/promise': require.resolve('mysql2/promise')
    };
    return config;
  },
};

export default nextConfig;