/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['rofjidbzyhtybpyqkfle.supabase.co'],
  },
}

module.exports = nextConfig