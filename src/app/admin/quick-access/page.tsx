'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';

/**
 * Hızlı Admin Erişim Sayfası
 * Bu sayfa test ve geliştirme amaçlıdır
 */
export default function QuickAccessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi',
        description: 'Lütfen email ve şifrenizi girin.',
      });
      return;
    }

    startTransition(async () => {
      const result = await loginAction(email, password);
      
      if (result.success && result.user) {
        // Set admin flags
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAdmin', 'true');
          sessionStorage.setItem('isAdmin', 'true');
          // Set cookie (expires in 7 days)
          const expires = new Date();
          expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
          document.cookie = `isAdmin=true; expires=${expires.toUTCString()}; path=/`;
          // Store user info
          // Store full user info including role
          localStorage.setItem('adminUser', JSON.stringify({
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role || 'viewer',
          }));
        }
        
        toast({
          title: 'Giriş Başarılı!',
          description: `Hoş geldiniz, ${result.user.name}!`,
        });
        
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 500);
      } else {
        toast({
          variant: 'destructive',
          title: 'Giriş Başarısız!',
          description: result.error || 'Email veya şifre hatalı.',
        });
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Hızlı Admin Erişimi</CardTitle>
          <CardDescription className="text-center">
            Yönetim paneline giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Adresi *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                required
                autoComplete="email"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push('/admin/login')}
                disabled={isPending}
              >
                Normal Giriş Sayfasına Git
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

