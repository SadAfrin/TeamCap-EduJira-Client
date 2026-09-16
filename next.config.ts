import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // https://lh3.googleusercontent.com/a/ACg8o
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
