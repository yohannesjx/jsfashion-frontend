/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "jsfashion.et", pathname: "/**" }, // ✅ added your main site
      { protocol: "https", hostname: "api.jsfashion.et", pathname: "/**" },
      { protocol: "https", hostname: "**.amazonaws.com", pathname: "/**" },
      { protocol: "https", hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com", pathname: "/**" },
      { protocol: "https", hostname: "**.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "**.medusa-commerce.com", pathname: "/**" },
    ],
  },
}

export default nextConfig