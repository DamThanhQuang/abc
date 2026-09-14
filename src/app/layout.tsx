import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { jsonLdScript } from "@/lib/sanitize";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fuelprecision.vn"),
  title: {
    default: "FuelPrecision Industrial — Giai phap nhien lieu chinh xac",
    template: "%s | FuelPrecision",
  },
  description: "Giải pháp nhiên liệu chính xác cho hạ tầng hiện đại. Hơn 20 năm kinh nghiệm, 500+ dự án tại 50+ quốc gia.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "FuelPrecision Industrial",
    title: "FuelPrecision Industrial — Giai phap nhien lieu chinh xac",
    description: "Giải pháp nhiên liệu chính xác cho hạ tầng hiện đại. Hơn 20 năm kinh nghiệm, 500+ dự án tại 50+ quốc gia.",
    url: "https://fuelprecision.vn",
  },
  twitter: {
    card: "summary_large_image",
    title: "FuelPrecision Industrial",
    description: "Giải pháp nhiên liệu chính xác cho hạ tầng hiện đại.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FuelPrecision Industrial",
    url: "https://fuelprecision.vn",
    description: "Giải pháp nhiên liệu chính xác cho hạ tầng hiện đại",
    address: {
      "@type": "PostalAddress",
      streetAddress: "120 Hoàng Quốc Việt",
      addressLocality: "Cầu Giấy",
      addressRegion: "Hà Nội",
      addressCountry: "VN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-24-3856-7890",
      contactType: "customer service",
      availableLanguage: "Vietnamese",
    },
  };

  return (
    <html lang="vi" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
