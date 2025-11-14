'use client';

import React from 'react';
import { Analytics } from '@/components/analytics/Analytics';
import { ImagesProvider } from '@/contexts/ImagesContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Analytics />
      <ImagesProvider>
        {children}
      </ImagesProvider>
    </>
  );
}





