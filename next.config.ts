import type { NextConfig } from "next";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

const nextConfig: NextConfig = {
<<<<<<< HEAD
  // Better Auth route matching breaks when trailingSlash is enabled
  trailingSlash: false,
=======
  /* config options here */
  // https://lh3.googleusercontent.com/a/ACg8o
>>>>>>> 619ecd2a405a7beba7d7653bd8fda7820ed323f0
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
