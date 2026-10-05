import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production Nginx sends this directly to FastAPI. This fallback is for local dev.
  async rewrites() {
    return [{ source: "/api/visitors/track", destination: `${process.env.BASE_URL || "http://localhost:8000"}/visitors/track` }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lruzdrf7t7zl7ff6.public.blob.vercel-storage.com",
      },
    ],
  },
  generateBuildId: async () => {
    return process.env.GIT_SHA || "yion-build";
  },
};

export default nextConfig;
