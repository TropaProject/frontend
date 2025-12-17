/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Полностью отключаем Dev Tools / dev indicators в дев-режиме
  devIndicators: false,
}

export default nextConfig
