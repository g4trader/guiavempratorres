import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : null;

const nextConfig: NextConfig = {
  typedRoutes: true,
  turbopack: { root: process.cwd() },
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "127.0.0.1", port: "54321" },
      ...(supabaseHostname
        ? ([{ protocol: "https", hostname: supabaseHostname }] as const)
        : [])
    ]
  }
};

export default nextConfig;
