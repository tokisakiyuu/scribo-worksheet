/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.graphql/,
      use: ['raw-loader'],
    })
    return config
  },
}

module.exports = nextConfig
