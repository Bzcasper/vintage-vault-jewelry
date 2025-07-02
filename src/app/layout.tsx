import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VintageVault - Curated Vintage & Pre-owned Jewelry",
  description: "Discover exceptional vintage and pre-owned jewelry at VintageVault. Our curated collection features timeless pieces from renowned designers, authenticated vintage treasures, and sustainable luxury jewelry. Shop rings, necklaces, earrings, and bracelets with confidence.",
  keywords: ["vintage jewelry", "pre-owned jewelry", "luxury jewelry", "vintage rings", "antique jewelry", "designer jewelry", "sustainable jewelry", "jewelry marketplace"],
  authors: [{ name: "VintageVault" }],
  creator: "VintageVault",
  publisher: "VintageVault",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://vintage-vault-jewelry.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VintageVault - Curated Vintage & Pre-owned Jewelry",
    description: "Discover exceptional vintage and pre-owned jewelry at VintageVault. Curated collection of timeless pieces from renowned designers.",
    url: "https://vintage-vault-jewelry.vercel.app",
    siteName: "VintageVault",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VintageVault - Curated Vintage Jewelry Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VintageVault - Curated Vintage & Pre-owned Jewelry",
    description: "Discover exceptional vintage and pre-owned jewelry. Curated collection of timeless pieces from renowned designers.",
    images: ["/og-image.jpg"],
    creator: "@VintageVault",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#8B5CF6",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
