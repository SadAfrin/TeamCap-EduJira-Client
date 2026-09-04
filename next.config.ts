import type { NextConfig } from "next";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

const nextConfig: NextConfig = {
  // Better Auth route matching breaks when trailingSlash is enabled
  trailingSlash: false,
  images: {
    remotePatterns: [
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
  // Proxy feature APIs to Express so Better Auth cookies stay on :3000
  async rewrites() {
    return [
      { source: "/api/leave", destination: `${API_URL}/api/leave` },
      { source: "/api/leave/:path*", destination: `${API_URL}/api/leave/:path*` },
      { source: "/api/messages", destination: `${API_URL}/api/messages` },
      { source: "/api/messages/:path*", destination: `${API_URL}/api/messages/:path*` },
      { source: "/api/upload", destination: `${API_URL}/api/upload` },
      { source: "/api/upload/:path*", destination: `${API_URL}/api/upload/:path*` },
      { source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
