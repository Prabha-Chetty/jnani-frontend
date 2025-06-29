/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/assets/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'jnani-backend.onrender.com',
        pathname: '/media/**',
      },
    ],
    domains: ['localhost', 'jnani-backend.onrender.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: http:; frame-src 'self' https://www.google.com https://maps.googleapis.com; connect-src 'self' https://maps.googleapis.com http://localhost:8000 https://jnani-backend.onrender.com;"
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 