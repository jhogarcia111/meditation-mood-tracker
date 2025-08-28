/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['localhost', 'ngrok.io', 'ngrok-free.app'],
    unoptimized: true
  }
}

module.exports = nextConfig
