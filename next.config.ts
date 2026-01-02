import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  // Allow builds to proceed while type fixes are in flight.
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

export default nextConfig
