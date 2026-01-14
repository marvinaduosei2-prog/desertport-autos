import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { DynamicFavicon } from "@/components/dynamic-favicon";
import { LogoPreloader } from "@/components/logo-preloader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DesertPort Autos - Luxury Automotive Platform",
  description: "Premium automotive marketplace with AI-powered support",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover', // This makes iOS extend to the edges
  },
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent', // Makes status bar transparent on iOS
    title: 'DesertPort Autos',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <DynamicFavicon />
          <LogoPreloader />
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}

