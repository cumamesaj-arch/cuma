# 🚀 Development Server - Hızlı Başlangıç

## ✅ Düzeltilen Sorunlar

1. **Port Çakışması**: Artık otomatik olarak temizleniyor
2. **Environment Variables**: `.env.local` otomatik oluşturuluyor
3. **Kolay Başlatma**: Tek komutla server başlatılıyor

## 📋 Kullanım

### Yöntem 1: Normal Başlatma (Önerilen)
```bash
npm run dev
```
Bu komut:
- Port 9002'yi otomatik temizler
- Development server'ı başlatır
- http://localhost:9002 adresinde çalışır

### Yöntem 2: PowerShell Script ile
```bash
npm run dev:start
```
Bu komut:
- Port kontrolü yapar
- `.env.local` dosyasını kontrol eder
- `node_modules` kontrolü yapar
- Server'ı başlatır

### Yöntem 3: Batch Script ile (Windows)
```bash
scripts\dev-start.bat
```

## 🔧 Sorun Giderme

### Port Hala Kullanımda?
```bash
# Manuel temizleme
node scripts/kill-port.js 9002
```

### Environment Variables Eksik?
`.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# ... diğer değişkenler
```

### Server Açılmıyor?
1. Port'u kontrol edin: `netstat -ano | findstr :9002`
2. Process'i sonlandırın: `taskkill /F /PID <PID>`
3. Yeniden başlatın: `npm run dev`

## 📝 Notlar

- Server her başlatıldığında port otomatik temizlenir
- `.env.local` dosyası git'e commit edilmez (güvenlik)
- `env.example` dosyasından template kopyalayabilirsiniz


