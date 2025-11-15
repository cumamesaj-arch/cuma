'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      try {
        const ls = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
        const ss = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';
        const cookie = typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('isAdmin=true'));
        const isAuth = Boolean(ls || ss || cookie);
        
        setIsAuthenticated(isAuth);
        
        // If not authenticated and not on login/quick-access page, redirect to login
        if (!isAuth && pathname !== '/admin/login' && pathname !== '/admin/quick-access') {
          router.push('/admin/login');
        }
      } catch {
        setIsAuthenticated(false);
        if (pathname !== '/admin/login' && pathname !== '/admin/quick-access') {
          router.push('/admin/login');
        }
      }
    };
    
    checkAuth();
  }, [router, pathname]);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  // If on login page or quick-access page, don't show sidebar
  if (pathname === '/admin/login' || pathname === '/admin/quick-access') {
    return <>{children}</>;
  }

  // If not authenticated, show nothing (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

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
