import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
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
