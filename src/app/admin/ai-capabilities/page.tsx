"use client";
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Image as ImageIcon, Pencil, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Yapay Zeka ile Görsel Oluşturma (Text-to-Image)",
    description: "Kullanıcıların metin açıklamaları girerek (örneğin, 'gün batımında cami silüeti') gönderileri için özgün ve dikkat çekici görseller oluşturmasını sağlar. Bu, stok fotoğraf bulma zorunluluğunu ortadan kaldırır.",
    icon: Sparkles,
  },
  {
    title: "Yapay Zeka ile Görsel Düzenleme (Image-to-Image)",
    description: "Mevcut bir görseli yükleyip, basit komutlarla (örneğin, 'bu fotoğrafa yıldızlı bir gece ekle') üzerinde değişiklikler yapmalarını sağlar.",
    icon: Pencil,
  },
  {
    title: "Otomatik Görsel Açıklaması ve İpucu Oluşturma",
    description: "Bir görsel yüklendiğinde, yapay zeka görseli analiz edip otomatik olarak bir açıklama (alt metni) ve arama motorları için ipuçları (data-ai-hint) oluşturabilir.",
    icon: ImageIcon,
  },
  {
    title: "Bitki Teşhisi Aracı",
    description: "Mevcut aracımız. Bir bitkinin fotoğrafını ve açıklamasını yükleyerek sağlık durumu hakkında bilgi alın.",
    icon: Bot,
    link: "/admin/ai-test",
  }
];

export default function AiCapabilitiesPage() {
  // Admin kontrolü (sidebar ile aynı mantık)
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

  if (!isAdmin) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Yalnızca Yönetici</CardTitle>
            <CardDescription>Bu sayfa yalnızca yetkili yönetici kullanıcılar tarafından görüntülenebilir.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Yapay Zeka Yetenekleri
          </CardTitle>
          <CardDescription>
            Uygulamamıza ekleyebileceğimiz potansiyel yapay zeka özellikleri.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <feature.icon className="h-5 w-5 text-primary" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-muted-foreground max-w-prose">{feature.description}</p>
                {feature.title === 'Yapay Zeka ile Görsel Oluşturma (Text-to-Image)' ? (
                  <Button asChild>
                    <Link href="/admin/media?ai=1">Aracı Dene</Link>
                  </Button>
                ) : feature.link ? (
                  <Button asChild>
                    <Link href={feature.link}>Aracı Dene</Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
