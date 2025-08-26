/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
  },
}

module.exports = nextConfig
