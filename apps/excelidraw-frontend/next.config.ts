import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Allow Cloudinary
      },
      {
        protocol: "https",
        hostname: "i.ibb.co", // Allow i.ibb.co
      },
    ],
  },
};

export default nextConfig;
