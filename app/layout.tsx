
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eataliano-mauve.vercel.app"),
  title: "Eataliano | Authentic Italian Food",
  description:
    "Discover delicious Italian pizza, pasta and more at Eataliano. Order your favorite meals online.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
  openGraph: {
    type: "website",
    siteName: "Eataliano",
    title: "Eataliano | Authentic Italian Food",
    description:
      "Discover delicious Italian pizza, pasta and more at Eataliano. Order your favorite meals online.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Eataliano Restaurant Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eataliano | Authentic Italian Food",
    description:
      "Discover delicious Italian pizza, pasta and more at Eataliano.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#284b36",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
