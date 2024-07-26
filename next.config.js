/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['rofjidbzyhtybpyqkfle.supabase.co'],
  },
  reactStrictMode: false,
}

module.exports = nextConfig