import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'static-00.iconduck.com',
    },
  ],
},

  /* config options here */
};

export default nextConfig;
