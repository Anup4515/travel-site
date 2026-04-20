import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    unoptimized: true, // Disable optimization for external images to avoid 404 errors during build
  },
  turbopack: {
    resolveAlias: {},
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  allowedDevOrigins: ['gertie-unostensible-changelessly.ngrok-free.dev'],
};

export default nextConfig;
