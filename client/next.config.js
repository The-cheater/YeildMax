/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.coingecko.com', 'cryptologos.cc', 'raw.githubusercontent.com'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'YieldMax',
    NEXT_PUBLIC_APP_DESCRIPTION: 'AI-Powered DeFi Yield Optimizer',
  },
}

module.exports = nextConfig
