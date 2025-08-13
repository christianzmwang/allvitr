/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/leads',
        destination: '/hugin',
        permanent: false,
      },
    ]
  },
}
export default nextConfig
