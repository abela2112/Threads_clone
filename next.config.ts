import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ['images.clerk.dev', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'res.cloudinary.com', 'cdn.discordapp.com', 'i.imgur.com'], // Add your allowed image domains here
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
