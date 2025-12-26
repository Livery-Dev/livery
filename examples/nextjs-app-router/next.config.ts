import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,

  // Transpile packages from the monorepo
  transpilePackages: ['@livery/core', '@livery/react', '@livery/next'],
};

export default nextConfig;
