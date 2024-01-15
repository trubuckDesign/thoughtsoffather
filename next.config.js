/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: false,

  images: {
    domains: ["aoswchlkodefxg8r.public.blob.vercel-storage.com"],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

module.exports = nextConfig;
