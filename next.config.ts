import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@xenova/transformers", "bufferutil", "utf-8-validate", "ws", "isomorphic-ws", "msedge-tts"],
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /onnxruntime-web/ },
    ]
    return config
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

// Runtime Check: Ensure critical env vars are set in production
if (process.env.NODE_ENV === "production") {
  const required = ["GROQ_API_KEY", "SESSION_SECRET"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`\u001b[31m[CRITICAL] Missing required environment variables: ${missing.join(", ")}\u001b[0m`);
    console.error(`\u001b[33mPlease set these in the Vercel dashboard.\u001b[0m`);
  }
}

export default nextConfig;
