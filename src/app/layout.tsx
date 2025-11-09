import React from 'react';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { DynamicAnalytics } from '@/components/analytics/DynamicAnalytics';
import { Providers } from './providers';
import { loadHomepageSections } from '@/lib/homepage-sections';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  // Load branding from homepage sections
  let metaTitle = 'Cuma Mesajları - İslami Mesajlar ve İçerik';
  let metaDescription = 'İslami Mesajlar, Videolar ve İçerik. Kur\'an Mealleri, Tefsirler, Cuma Mesajları ve daha fazlası.';
  let siteName = 'Cuma Mesajları';

  try {
    const sections = await loadHomepageSections();
    if (sections.branding) {
      if (sections.branding.metaTitle) {
        metaTitle = sections.branding.metaTitle;
      }
      if (sections.branding.metaDescription) {
        metaDescription = sections.branding.metaDescription;
      }
      if (sections.branding.siteName) {
        siteName = sections.branding.siteName;
      }
    }
  } catch (error) {
    // Error loading metadata - use defaults (production'da log yok)
  }

  return {
    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },
    description: metaDescription,
    keywords: ['islam', 'kur\'an', 'meal', 'tefsir', 'cuma mesajları', 'islami içerik', 'dini sohbet'],
    authors: [{ name: siteName }],
    icons: {
      icon: '/favicon.ico',
    },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mujdeportal.com',
      siteName: siteName,
      title: metaTitle,
      description: metaDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: metaDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <DynamicAnalytics />
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
