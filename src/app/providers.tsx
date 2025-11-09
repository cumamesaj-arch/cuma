'use client';

import React from 'react';
import { Analytics } from '@/components/analytics/Analytics';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Analytics />
      {children}
    </>
  );
}





