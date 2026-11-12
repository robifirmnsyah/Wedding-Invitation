/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Next serves AVIF/WebP variants at the exact responsive size requested
    // by each Image component, rather than shipping the original camera file.
    formats: ["image/avif", "image/webp"],
    // placeholder assets are SVG; safe here because they are first-party files
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;
