import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import { ThemeProvider } from "@/theme/ThemeContext";
import { LanguageProvider } from "@/i18n/LanguageContext";

import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://learning-hub-by-kd.vercel.app'),
  title: {
    default: "Learning Hub - Cinematic EdTech",
    template: "%s | Learning Hub",
  },
  description: "Advanced Learning Management System featuring 3D visuals, live masterclasses, and certified credentials.",
  keywords: ["edtech", "learning", "courses", "masterclasses", "technology"],
  authors: [{ name: "Learning Hub Team" }],
  creator: "Learning Hub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Learning Hub - Cinematic EdTech",
    description: "Advanced Learning Management System featuring 3D visuals, live masterclasses, and certified credentials.",
    siteName: "Learning Hub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Learning Hub Cover",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Hub - Cinematic EdTech",
    description: "Advanced Learning Management System featuring 3D visuals.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://learning-hub-by-kd.vercel.app/#organization',
        name: 'Learning Hub',
        url: 'https://learning-hub-by-kd.vercel.app',
        logo: 'https://learning-hub-by-kd.vercel.app/logo.png',
        sameAs: [
          'https://twitter.com/learninghub',
          'https://linkedin.com/company/learninghub'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://learning-hub-by-kd.vercel.app/#website',
        url: 'https://learning-hub-by-kd.vercel.app',
        name: 'Learning Hub',
        publisher: {
          '@id': 'https://learning-hub-by-kd.vercel.app/#organization'
        }
      }
    ]
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <LanguageProvider>
            <NextAuthProvider>
                {children}
            </NextAuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
