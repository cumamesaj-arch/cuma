'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, UserCog } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { SocialIcons } from '../shared/SocialIcons';
import { getCustomMenusAction, getCategorySettingsAction, getCategoriesAction } from '@/app/actions';
import type { CustomMenu, CategorySettings, Category } from '@/lib/types';

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href || ''}
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';


function DesktopNav() {
  const pathname = usePathname();
  const [customMenus, setCustomMenus] = React.useState<CustomMenu[]>([]);
  const [categorySettings, setCategorySettings] = React.useState<CategorySettings[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    // Firebase'den custom menus, category settings ve categories'i yükle
    getCustomMenusAction().then(menus => {
      setCustomMenus(menus.slice().sort((a, b) => a.order - b.order));
    });
    getCategorySettingsAction().then(settings => {
      setCategorySettings(settings.slice().sort((a, b) => a.order - b.order));
    });
    getCategoriesAction().then(cats => {
      setCategories(cats);
    });
  }, []);

  const visibleCustomMenus = customMenus.filter(m => m.visible).sort((a, b) => a.order - b.order);
  
  const getCategorySetting = (categoryId: string): CategorySettings | undefined => {
    return categorySettings.find(s => s.categoryId === categoryId);
  };
  
  const visibleCategories = categories.map(cat => {
    const setting = getCategorySetting(cat.id);
    return {
      ...cat,
      visible: setting?.visible ?? true,
      order: setting?.order ?? 0
    };
  }).filter(cat => cat.visible).sort((a, b) => a.order - b.order);

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {visibleCategories.map((category) =>
          category.subcategories ? (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuTrigger className="rounded-md px-4 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                {category.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="rounded-xl border shadow-lg bg-popover/95 backdrop-blur">
                <div className="px-4 pt-4 pb-2">
                  <div className="text-sm font-semibold text-foreground">{category.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Alt başlıklardan birini seçin</p>
                </div>
                <ul className="grid w-[420px] max-h-[60vh] overflow-y-auto gap-3 px-4 pb-4 md:w-[560px] md:grid-cols-2 lg:w-[680px]">
                  {category.subcategories.map((sub) => (
                    <ListItem
                      key={sub.id}
                      href={`/${sub.slug}`}
                      title={sub.title}
                    >
                      {sub.title} ile ilgili videolar
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuLink asChild active={pathname === `/${category.slug}`}>
                  <Link href={`/${category.slug}`} className={navigationMenuTriggerStyle()}>
                    {category.title}
                  </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
        {visibleCustomMenus.map((menu) => (
          <NavigationMenuItem key={menu.id}>
            <NavigationMenuLink asChild active={pathname === menu.href}>
              <Link href={menu.href} className={navigationMenuTriggerStyle()}>
                {menu.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [customMenus, setCustomMenus] = React.useState<CustomMenu[]>(() => {
    try {
      return (initialCustomMenus as unknown as CustomMenu[]).slice().sort((a,b)=>a.order-b.order);
    } catch {
      return [];
    }
  });
  const [categorySettings, setCategorySettings] = React.useState<CategorySettings[]>(() => {
    try {
      return (initialCategorySettings as unknown as CategorySettings[]).slice().sort((a,b)=>a.order-b.order);
    } catch {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    getCustomMenusAction().then(setCustomMenus);
    getCategorySettingsAction().then(setCategorySettings);
    getCategoriesAction().then(setCategories);
    try {
      const refFromAdmin = typeof document !== 'undefined' && document.referrer.includes('/admin');
      const ls = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
      const ss = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';
      const cookie = typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('isAdmin=true'));
      setIsAdmin(Boolean(refFromAdmin || ls || ss || cookie));
    } catch {}
  }, []);

  const visibleCustomMenus = customMenus.filter(m => m.visible).sort((a, b) => a.order - b.order);
  
  const getCategorySetting = (categoryId: string): CategorySettings | undefined => {
    return categorySettings.find(s => s.categoryId === categoryId);
  };
  
  const visibleCategories = categories.map(cat => {
    const setting = getCategorySetting(cat.id);
    return {
      ...cat,
      visible: setting?.visible ?? true,
      order: setting?.order ?? 0
    };
  }).filter(cat => cat.visible).sort((a, b) => a.order - b.order);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const searchUrl = `/search?q=${encodeURIComponent(trimmedQuery)}`;
      router.push(searchUrl);
      setSearchQuery('');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        const searchUrl = `/search?q=${encodeURIComponent(trimmedQuery)}`;
        router.push(searchUrl);
        setSearchQuery('');
      }
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <VisuallyHidden>
          <SheetTitle>Ana Menü</SheetTitle>
        </VisuallyHidden>
        <nav className="grid gap-6 text-lg font-medium">
          <Logo />
          <form onSubmit={handleSearch} className="relative md:hidden">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              type="search"
              placeholder="İçerik arayın..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </form>
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className={cn(
                'hover:text-foreground',
                pathname === `/${category.slug}`
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {category.title}
            </Link>
          ))}
          {visibleCustomMenus.map((menu) => (
            <Link
              key={menu.id}
              href={menu.href}
              className={cn(
                'hover:text-foreground',
                pathname === menu.href
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {menu.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground"
            >
              Yönetim Paneli
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    try {
      const refFromAdmin = typeof document !== 'undefined' && document.referrer.includes('/admin');
      const ls = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
      const ss = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';
      const cookie = typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('isAdmin=true'));
      setIsAdmin(Boolean(refFromAdmin || ls || ss || cookie));
    } catch {}
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const searchUrl = `/search?q=${encodeURIComponent(trimmedQuery)}`;
      router.push(searchUrl);
      setSearchQuery(''); // Clear input after search
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        const searchUrl = `/search?q=${encodeURIComponent(trimmedQuery)}`;
        router.push(searchUrl);
        setSearchQuery('');
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-center gap-4">
          <DesktopNav />
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              type="search"
              placeholder="İçerik arayın... örn: Nur Suresi"
              className="pl-8 sm:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </form>
          {isAdmin && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <UserCog className="h-5 w-5" />
                <span className="sr-only">Yönetim Paneli</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

    