import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ['bcryptjs'],
};


export default nextConfig;
