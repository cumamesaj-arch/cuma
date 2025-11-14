'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  PanelLeft,
  Settings,
  Menu,
  Image as ImageIcon,
  Users,
  PlusCircle,
  LayoutGrid,
  Bot,
  BarChart3,
  Share2,
  Mail,
  StickyNote,
  LogOut
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const navItems = [
  { href: '/admin', icon: Home, label: 'Ana Sayfa' },
  { href: '/admin/posts', icon: Package, label: 'Gönderiler' },
  { href: '/admin/posts/new', icon: PlusCircle, label: 'Yeni Gönderi' },
  { href: '/admin/media', icon: ImageIcon, label: 'Medya Deposu' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Ziyaret Analizi' },
  { href: '/admin/homepage', icon: LayoutGrid, label: 'Ana Sayfa Düzenle' },
  { href: '/admin/menus', icon: Menu, label: 'Menü Ayarları' },
  { href: '/admin/messages', icon: Mail, label: 'Ziyaretçi Mesajları' },
  { href: '/admin/social-media-apis', icon: Share2, label: 'Sosyal Medya API' },
  { href: '/admin/users', icon: Users, label: 'Kullanıcılar' },
  { href: '/admin/ai-capabilities', icon: Bot, label: 'AI Yetenekleri' },
  { href: '/admin/notes', icon: StickyNote, label: 'Notlarım' },
];

const NavLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
            isActive && 'bg-accent text-accent-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
};

export function AdminSidebar() {
  const [isAdmin, setIsAdmin] = React.useState(false);
  React.useEffect(() => {
    try {
      const refFromAdmin = typeof document !== 'undefined' && document.referrer.includes('/admin');
      const ls = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
      const ss = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';
      const cookie = typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('isAdmin=true'));
      setIsAdmin(Boolean(refFromAdmin || ls || ss || cookie));
    } catch {}
  }, []);
  const visibleItems = navItems.filter(item => item.href !== '/admin/ai-capabilities' || isAdmin);
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <TooltipProvider>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
              href="/"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <LayoutGrid className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">Cuma Mesajları</span>
            </Link>
            {visibleItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Ayarlar</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Ayarlar</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('isAdmin');
                      sessionStorage.removeItem('isAdmin');
                      localStorage.removeItem('adminUser');
                      // Clear cookie
                      document.cookie = 'isAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                      window.location.href = '/admin/login';
                    }
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-destructive md:h-8 md:w-8"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Çıkış Yap</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Çıkış Yap</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <VisuallyHidden>
              <SheetTitle>Ana Menü</SheetTitle>
            </VisuallyHidden>
            <nav className="grid gap-6 text-lg font-medium">
              <Logo />
              {visibleItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <Link
                  href="/admin/settings"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Ayarlar
                </Link>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('isAdmin');
                    sessionStorage.removeItem('isAdmin');
                    localStorage.removeItem('adminUser');
                    // Clear cookie
                    document.cookie = 'isAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.href = '/admin/login';
                  }
                }}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
                Çıkış Yap
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
