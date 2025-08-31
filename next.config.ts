/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO optimizations
  trailingSlash: false,
  
  // Compress responses for better performance
  compress: true,
  
  // Generate static pages for better SEO
  output: 'standalone',
  
  // Optimize images for better loading
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
    ]
  },
}

export default nextConfig
