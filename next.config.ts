/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "contents.irctc.co.in",
      },
    ],
  },
};

module.exports = nextConfig;
