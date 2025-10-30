import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https", // or 'http'
        hostname: "res.cloudinary.com", // Replace with your image host
      },
    ],
  },
};

export default nextConfig;
