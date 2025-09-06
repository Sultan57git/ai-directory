// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "img-src 'self' data: https:; " +
              "style-src 'self' 'unsafe-inline'; " +
              "font-src 'self' data:; " +
              "script-src 'self' 'unsafe-inline'; " +
              "connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
