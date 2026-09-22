import type { NextConfig } from "next";

const r2PublicHost = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined;

const secondaryDomains = [
  "www.astc.com.vn",
  "cotbom.com.vn",
  "www.cotbom.com.vn",
  "cotbom.vn",
  "www.cotbom.vn",
  "mayxangdau.vn",
  "www.mayxangdau.vn",
  "mayxangdau.com",
  "www.mayxangdau.com",
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return secondaryDomains.map((hostname) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: hostname.replaceAll(".", "\\.") }],
      destination: "https://astc.com.vn/:path*",
      permanent: true,
    }));
  },
  images: {
    remotePatterns: r2PublicHost
      ? [{ protocol: "https" as const, hostname: r2PublicHost }]
      : [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
