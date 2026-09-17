import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 skips the optimizer automatically for `.svg` sources, so the SVG
    // placeholders stay untouched while real photos get resized and re-encoded.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
