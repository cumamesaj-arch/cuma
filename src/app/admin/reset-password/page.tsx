'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { resetPasswordWithTokenAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const token = searchParams.get('token');

  React.useEffect(() => {
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Geçersiz Link',
        description: 'Şifre sıfırlama linki geçersiz veya eksik.',
      });
      router.push('/admin/login');
    }
  }, [token, router, toast]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Geçersiz Token',
        description: 'Şifre sıfırlama token\'ı bulunamadı.',
      });
      return;
    }
    
    if (!newPassword || !confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi',
        description: 'Lütfen yeni şifrenizi girin.',
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Şifreler Eşleşmiyor',
        description: 'Yeni şifre ve şifre onayı eşleşmiyor.',
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Şifre Çok Kısa',
        description: 'Şifre en az 6 karakter olmalıdır.',
      });
      return;
    }
    
    startTransition(async () => {
      const result = await resetPasswordWithTokenAction(token, newPassword);
      
      if (result.success) {
        toast({
          title: 'Şifre Başarıyla Sıfırlandı! ✅',
          description: 'Yeni şifreniz kaydedildi. Giriş sayfasına yönlendiriliyorsunuz...',
        });
        
        setTimeout(() => {
          router.push('/admin/login');
        }, 1500);
      } else {
        toast({
          variant: 'destructive',
          title: 'Şifre Sıfırlama Başarısız! ❌',
          description: result.error || 'Şifre sıfırlanırken bir hata oluştu. Lütfen tekrar deneyin veya yeni bir şifre sıfırlama linki isteyin.',
        });
      }
    });
  };

  if (!token) {
    return null; // useEffect redirect yapacak
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Yeni Şifre Belirle</CardTitle>
          <CardDescription className="text-center">
            Email adresinize gönderilen link ile bu sayfaya geldiniz. Yeni şifrenizi belirleyin (en az 6 karakter).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-base font-semibold">Yeni Şifre *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="En az 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  disabled={isPending}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isPending}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-base font-semibold">Yeni Şifre (Tekrar) *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  disabled={isPending}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isPending}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isPending}>
              {isPending ? 'Şifre sıfırlanıyor...' : 'Şifreyi Sıfırla'}
            </Button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => router.push('/admin/login')}
                className="text-sm text-primary hover:underline"
                disabled={isPending}
              >
                Giriş sayfasına dön
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              * Zorunlu alanlar
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

