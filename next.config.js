/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/midad-alt",
  assetPrefix: "/midad-alt",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
