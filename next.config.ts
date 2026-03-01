/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "neon.ipsator.com",
      },
      {
        protocol: "https",
        hostname: "b.zmtcdn.com",
      },
      {
        protocol: "https",
        hostname: "contents.irctc.co.in",
      }
    ],
  },
};

module.exports = nextConfig;