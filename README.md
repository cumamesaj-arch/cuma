# Müjde Portalı - Firebase Studio

Firebase Studio ile geliştirilmiş Next.js tabanlı İslami içerik yönetim sistemi.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 20+
- npm veya yarn
- Firebase hesabı (opsiyonel, Firebase servisleri için)

### Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment variables ayarlayın:
```bash
cp env.example .env.local
```

`.env.local` dosyasını düzenleyip Firebase yapılandırma bilgilerinizi girin.

3. Projeyi çalıştırın:
```bash
npm run dev
```

Sunucu http://localhost:9002 adresinde çalışacaktır.

## 📚 Dokümantasyon

- [Firebase Kurulum Kılavuzu](./FIREBASE_SETUP.md) - Firebase servislerini yapılandırma
- [Proje Blueprint](./docs/blueprint.md) - Proje özellikleri ve gereksinimler

## 🔥 Firebase Studio Özellikleri

- Firebase App Hosting desteği
- Firestore Database entegrasyonu
- Firebase Storage desteği
- Firebase Authentication hazır yapılandırma
- Google Gemini AI (Genkit) entegrasyonu
- Secrets Manager entegrasyonu

## 📁 Proje Yapısı

```
project/
├── src/
│   ├── app/           # Next.js App Router sayfaları
│   ├── components/    # React bileşenleri
│   ├── lib/           # Utility fonksiyonları ve Firebase yapılandırması
│   └── ai/            # Genkit AI akışları
├── firebase.json      # Firebase yapılandırması
├── apphosting.yaml    # Firebase App Hosting yapılandırması
└── .idx/              # Firebase Studio workspace yapılandırması
```

## 🛠️ Kullanılan Teknolojiler

- **Next.js 15** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Stil sistemi
- **shadcn/ui** - UI bileşenleri
- **Firebase** - Backend servisleri
- **Genkit** - AI entegrasyonu
- **Google Gemini AI** - AI modeli

## 📝 Notlar

- Firebase servislerini kullanmak için `.env.local` dosyasını doldurun
- Admin paneli için `/admin` yolunu kullanın
- AI özellikleri için Google Gemini API key gereklidir

## 🤝 Katkıda Bulunma

Proje hakkında daha fazla bilgi için [blueprint.md](./docs/blueprint.md) dosyasına bakın.
