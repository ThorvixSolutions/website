import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages only serves files: `next build` writes the whole site to out/
  output: "export",
};

export default nextConfig;
