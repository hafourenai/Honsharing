import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 uses Turbopack by default.
  // Turbopack handles Node.js built-in modules automatically for client bundles,
  // so no extra config is needed for @xenova/transformers.
  turbopack: {},
};

export default nextConfig;
