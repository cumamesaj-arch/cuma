'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { POSTS, CATEGORIES } from '@/lib/data';
import { BarChart3, Eye, Users, TrendingUp, Share2, MousePointerClick } from 'lucide-react';

export default function AnalyticsPage() {
  const totalPosts = POSTS.filter(p => p.status !== 'draft').length;
  const totalCategories = CATEGORIES.length + CATEGORIES.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0);

  // Bu sayfa şimdilik statik veriler gösteriyor
  // Google Analytics entegrasyonu ile gerçek veriler çekilebilir
  const stats = {
    totalViews: 0, // GA4'ten gelecek
    uniqueVisitors: 0, // GA4'ten gelecek
    bounceRate: 0, // GA4'ten gelecek
    avgSessionDuration: 0, // GA4'ten gelecek
    topPosts: [] as Array<{ id: string; title: string; views: number }>,
    topCategories: [] as Array<{ name: string; views: number }>,
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ziyaret Analizi</h2>
          <p className="text-muted-foreground">
            Web sitesi ziyaret istatistikleri ve performans analizi
          </p>
        </div>
        <a 
          href={`https://analytics.google.com/analytics/web/#/p${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.replace('G-', '')}/realtime`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Google Analytics'te Görüntüle →
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Görüntülenme</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString('tr-TR')}</div>
            <p className="text-xs text-muted-foreground">
              Tüm zamanlar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Benzersiz Ziyaretçi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString('tr-TR')}</div>
            <p className="text-xs text-muted-foreground">
              Son 30 gün
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Oturum Süresi</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(stats.avgSessionDuration / 60)}:{(stats.avgSessionDuration % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-muted-foreground">
              Dakika:Saniye
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zıplama Oranı</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bounceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Tüm zamanlar
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>İçerik İstatistikleri</CardTitle>
            <CardDescription>Toplam gönderi ve kategori sayıları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Toplam Gönderi</span>
                <span className="text-2xl font-bold">{totalPosts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Toplam Kategori</span>
                <span className="text-2xl font-bold">{totalCategories}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taslak Gönderi</span>
                <span className="text-2xl font-bold">
                  {POSTS.filter(p => p.status === 'draft').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Google Analytics Entegrasyonu</CardTitle>
            <CardDescription>Analiz için Google Analytics kullanın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Durum</span>
                <span className={`text-sm font-semibold ${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 'text-green-600' : 'text-red-600'}`}>
                  {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Measurement ID</span>
                  <span className="text-sm font-mono">{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}</span>
                </div>
              )}
              <div className="pt-4">
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Google Analytics'i Aç →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Not</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gerçek zamanlı analitik verileri için Google Analytics hesabınızı kullanın. 
            Bu sayfa şu anda statik içerik istatistiklerini gösteriyor. 
            Detaylı analiz için{' '}
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Analytics
            </a>
            {' '}paneline gidin.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}











