/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: process.cwd(),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/0198ffa5-f76d-ad1f-6712-215fd7a8a5cf',
        permanent: false, // This creates a 307 redirect
      },
    ]
  },

  // Ensure proper client-side rendering for dynamic routes
  experimental: {
    serverComponentsExternalPackages: ['@wagmi/core', 'viem'],
  },

  // Ensure proper static generation
  trailingSlash: false,
  
  // Handle environment variables
  env: {
    NEXT_PUBLIC_CHAIN_ID: '8453',
  },
}

export default nextConfig
