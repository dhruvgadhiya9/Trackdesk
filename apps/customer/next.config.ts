import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@trackdesk/ui"],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default config;
