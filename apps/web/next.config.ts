import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // When deploying on Vercel, use native serverless output; use standalone for Docker containers.
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(self)" }
      ]
    }];
  }
};

export default nextConfig;
