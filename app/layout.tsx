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
  title: "Banko Arts | Professional 3D Architectural Visualization & Rendering",
  description: "Transform your vision into reality with photorealistic 3D architectural visualizations. 824+ completed projects, 10 years experience. Expert team delivering stunning exterior, interior, and animation renders.",
  keywords: ["3D visualization", "architectural rendering", "3D artist", "interior design", "exterior visualization", "3D animation", "photorealistic renders", "architectural visualization"],
  authors: [{ name: "Banko Arts" }],
  creator: "Banko Arts",
  publisher: "Banko Arts",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bankoarts.com",
    title: "Banko Arts | Professional 3D Architectural Visualization",
    description: "Transform your vision into reality with photorealistic 3D architectural visualizations. 824+ completed projects, 10 years experience.",
    siteName: "Banko Arts",
    images: [
      {
        url: "/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "Banko Arts - 3D Architectural Visualization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Banko Arts | Professional 3D Architectural Visualization",
    description: "Transform your vision into reality with photorealistic 3D architectural visualizations. 824+ completed projects.",
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
