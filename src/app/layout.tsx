import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { companyInfo, siteConfig } from "@/config/site";
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Ánh Sáng Toàn Cầu — Thiết bị và giải pháp trạm xăng dầu",
    template: "%s | Ánh Sáng Toàn Cầu",
  },
  description: "Đo bồn tự động, thiết bị trạm xăng dầu và phần mềm quản lý.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: companyInfo.brandName,
    title: "Ánh Sáng Toàn Cầu — Thiết bị và giải pháp trạm xăng dầu",
    description: "Đo bồn tự động, thiết bị trạm xăng dầu và phần mềm quản lý.",
    url: siteConfig.url,
    images: [
      {
        url: "/images/hero-fuel-station-clean.png",
        alt: "Thiết bị và giải pháp trạm xăng dầu Ánh Sáng Toàn Cầu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: companyInfo.brandName,
    description: "Thiết bị và giải pháp cho trạm xăng dầu.",
    images: ["/images/hero-fuel-station-clean.png"],
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
    name: companyInfo.brandName,
    legalName: companyInfo.legalName,
    taxID: companyInfo.taxCode,
    url: siteConfig.url,
    description: siteConfig.description,
    email: companyInfo.invoiceEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: companyInfo.streetAddress,
      addressLocality: companyInfo.locality,
      addressRegion: companyInfo.locality,
      addressCountry: companyInfo.country,
    },
  };

  return (
    <html lang="vi" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
