'use client';

import { useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Admin panelindeyken flag'i set et
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAdmin', 'true');
      sessionStorage.setItem('isAdmin', 'true');
    }
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
    </div>
  );
}
