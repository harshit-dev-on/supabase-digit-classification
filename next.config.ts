import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In production (Vercel), proxy /api/* to the standalone ML microservice URL (e.g. on Render)
    // Set ML_SERVICE_URL as a Vercel environment variable (e.g. https://digit-classification-ml-api.onrender.com)
    const mlServiceUrl =
      process.env.ML_SERVICE_URL ||
      process.env.ML_API_URL ||
      process.env.BACKEND_URL ||
      "http://localhost:8008";

    return [
      {
        source: "/api/:path*",
        destination: `${mlServiceUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
