'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { SiteBranding } from '@/lib/types';

export function Logo() {
  const [branding, setBranding] = useState<SiteBranding>({
    siteName: "Cuma Mesajları",
    useLogo: false,
    logoUrl: "",
    logoAlt: "Cuma Mesajları Logo",
    textColor: "#FFD700",
    fontFamily: "Playfair Display",
    fontSize: "2xl"
  });

  const fontSizeMap: { [key: string]: string } = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
  };

  useEffect(() => {
    // Firebase'den branding bilgilerini yükle
    const loadBranding = async () => {
      try {
        const { getHomepageSectionsAction } = await import('@/app/actions');
        const data = await getHomepageSectionsAction();
        if (data.branding) {
          setBranding(data.branding);
        }
      } catch (error) {
        console.error('Failed to load branding:', error);
      }
    };

    loadBranding();
  }, []);

  const fontClass = branding.fontSize ? fontSizeMap[branding.fontSize] || 'text-2xl' : 'text-2xl';
  const fontFamilyStyle = branding.fontFamily ? { fontFamily: branding.fontFamily } : {};
  const textColorStyle = branding.textColor ? { color: branding.textColor } : {};

  return (
    <Link href="/" className="flex items-center gap-2">
      {branding.useLogo && branding.logoUrl ? (
        <Image
          src={branding.logoUrl}
          alt={branding.logoAlt || branding.siteName}
          width={150}
          height={50}
          className="h-auto w-auto max-h-12 object-contain"
          priority
        />
      ) : (
        <h1 
          className={`${fontClass} font-bold font-headline`}
          style={{ ...fontFamilyStyle, ...textColorStyle }}
        >
          {branding.siteName}
        </h1>
      )}
    </Link>
  );
}

    logoAlt: "Cuma Mesajları Logo",
    textColor: "#FFD700",
    fontFamily: "Playfair Display",
    fontSize: "2xl"
  });

  const fontSizeMap: { [key: string]: string } = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
  };

  useEffect(() => {
    // Firebase'den branding bilgilerini yükle
    const loadBranding = async () => {
      try {
        const { getHomepageSectionsAction } = await import('@/app/actions');
        const data = await getHomepageSectionsAction();
        if (data.branding) {
          setBranding(data.branding);
        }
      } catch (error) {
        console.error('Failed to load branding:', error);
      }
    };

    loadBranding();
  }, []);

  const fontClass = branding.fontSize ? fontSizeMap[branding.fontSize] || 'text-2xl' : 'text-2xl';
  const fontFamilyStyle = branding.fontFamily ? { fontFamily: branding.fontFamily } : {};
  const textColorStyle = branding.textColor ? { color: branding.textColor } : {};

  return (
    <Link href="/" className="flex items-center gap-2">
      {branding.useLogo && branding.logoUrl ? (
        <Image
          src={branding.logoUrl}
          alt={branding.logoAlt || branding.siteName}
          width={150}
          height={50}
          className="h-auto w-auto max-h-12 object-contain"
          priority
        />
      ) : (
        <h1 
          className={`${fontClass} font-bold font-headline`}
          style={{ ...fontFamilyStyle, ...textColorStyle }}
        >
          {branding.siteName}
        </h1>
      )}
    </Link>
  );
}
