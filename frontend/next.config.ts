import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In production (Vercel), proxy /api/* to the Render backend URL
    // Set BACKEND_URL as a Vercel environment variable (e.g. https://your-app.onrender.com)
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8008";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
