import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Programme covers, coach portraits and avatars are remote assets. The
    // allowlist is explicit: `images.domains` is deprecated and `qualities`
    // is restricted from Next 16 onwards.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "i.pravatar.cc", pathname: "/**" },
    ],
    qualities: [75, 90],
  },
};

export default nextConfig;
