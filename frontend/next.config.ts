import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
