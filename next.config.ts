import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  allowedDevOrigins: ["192.168.1.28", "192.168.1.29"],

  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
