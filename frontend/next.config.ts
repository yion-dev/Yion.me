import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: "https",
              hostname: "lruzdrf7t7zl7ff6.public.blob.vercel-storage.com"
          }
      ]
    }
};

export default nextConfig;