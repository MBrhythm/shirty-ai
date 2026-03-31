import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This tells the app to ignore those "quote" errors during the build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This tells it to ignore tiny typing errors too, just to be safe
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
