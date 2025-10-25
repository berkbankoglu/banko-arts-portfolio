import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";
import GoogleAnalytics from "./components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bankoarts.com'),
  title: {
    default: "Banko Arts | Professional 3D Architectural Visualization & Rendering",
    template: "%s | Banko Arts"
  },
  description: "Transform your vision into reality with photorealistic 3D architectural visualizations. 824+ completed projects, 10 years experience. Top Rated Plus on Upwork. Expert team delivering stunning exterior, interior, and animation renders.",
  keywords: [
    "3D visualization",
    "architectural rendering",
    "3D artist",
    "interior design",
    "exterior visualization",
    "3D animation",
    "photorealistic renders",
    "architectural visualization",
    "architectural 3D rendering",
    "interior rendering",
    "exterior rendering",
    "3D modeling",
    "architectural design",
    "visualization services",
    "render studio",
    "CGI visualization",
    "architecture portfolio",
    "real estate visualization",
    "property visualization",
    "Turkey architectural rendering"
  ],
  authors: [{ name: "Banko Arts", url: "https://bankoarts.com" }],
  creator: "Banko Arts",
  publisher: "Banko Arts",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://bankoarts.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bankoarts.com",
    title: "Banko Arts | Professional 3D Architectural Visualization",
    description: "Transform your vision into reality with photorealistic 3D architectural visualizations. 824+ completed projects, 10 years experience. Top Rated Plus on Upwork.",
    siteName: "Banko Arts",
    images: [
      {
        url: "/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "Banko Arts - Professional 3D Architectural Visualization & Rendering Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Banko Arts | Professional 3D Architectural Visualization",
    description: "Transform your vision into reality with photorealistic 3D architectural visualizations. 824+ completed projects. Top Rated Plus.",
    images: ["/hero-image.jpg"],
    creator: "@bankoarts",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics - Replace with your actual GA4 Measurement ID */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {children}
      </body>
    </html>
  );
}
