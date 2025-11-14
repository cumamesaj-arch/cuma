'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { loginAction, resetPasswordAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isResetting, startResetTransition] = useTransition();

  // Check if already logged in - with delay to prevent flash
  React.useEffect(() => {
    const checkAuth = () => {
      try {
        const ls = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
        const ss = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';
        const cookie = typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('isAdmin=true'));
        if (ls || ss || cookie) {
          // Small delay to show login page briefly before redirect
          setTimeout(() => {
            router.push('/admin');
          }, 100);
        } else {
          setIsCheckingAuth(false);
        }
      } catch {
        setIsCheckingAuth(false);
      }
    };
    
    // Small delay to ensure page renders first
    const timer = setTimeout(() => {
      checkAuth();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
          localStorage.setItem('adminUser', JSON.stringify(result.user));
        }
        
        toast({
          title: 'Giriş Başarılı!',
          description: `Hoş geldiniz, ${result.user.name}!`,
        });
        
        // Small delay before redirect to show success message
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

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi',
        description: 'Lütfen email adresinizi girin.',
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
    
    startResetTransition(async () => {
      const result = await resetPasswordAction(resetEmail, newPassword);
      
      if (result.success) {
        toast({
          title: 'Şifre Başarıyla Sıfırlandı!',
          description: 'Yeni şifrenizle giriş yapabilirsiniz.',
        });
        
        // Reset form and close dialog
        setResetEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setShowForgotPassword(false);
        
        // Pre-fill email in login form
        setEmail(resetEmail);
      } else {
        toast({
          variant: 'destructive',
          title: 'Şifre Sıfırlama Başarısız!',
          description: result.error || 'Şifre sıfırlanırken bir hata oluştu.',
        });
      }
    });
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Yükleniyor...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Yönetim Paneli Girişi</CardTitle>
          <CardDescription className="text-center">
            Yönetim paneline erişmek için email ve şifrenizi girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">Email Adresi *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  disabled={isPending}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-semibold">Şifre *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  disabled={isPending}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isPending}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isPending}>
              {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email); // Pre-fill with current email
                  setShowForgotPassword(true);
                }}
                className="text-sm text-primary hover:underline"
                disabled={isPending}
              >
                Şifremi Unuttum
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              * Zorunlu alanlar
            </p>
          </form>
        </CardContent>
      </Card>
      
      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Şifremi Unuttum</DialogTitle>
            <DialogDescription>
              Email adresinizi girin ve yeni şifrenizi belirleyin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-base font-semibold">Email Adresi *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="pl-10 h-11"
                  disabled={isResetting}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>
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
                  disabled={isResetting}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isResetting}
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
                  disabled={isResetting}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isResetting}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={isResetting}
              >
                İptal
              </Button>
              <Button type="submit" className="flex-1" disabled={isResetting}>
                {isResetting ? 'Sıfırlanıyor...' : 'Şifreyi Sıfırla'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

