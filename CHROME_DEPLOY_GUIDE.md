# 🌐 Chrome'da Yayınlama İşlemi - Adım Adım

## Adım 1: Firebase Console'da Proje Kontrolü

1. Chrome'da Firebase Console açıldı: https://console.firebase.google.com/project/cumamesajlari-6eeef
2. Proje açıldı mı kontrol edin
3. Sol menüden "Project Settings" (⚙️) tıklayın

## Adım 2: Web Uygulaması Ekleme/Kontrol

1. "Project Settings" sayfasında "Your apps" bölümüne gidin
2. Web uygulaması var mı kontrol edin
3. **Yoksa:**
   - "Web" (</>) ikonuna tıklayın
   - App nickname girin: "Mujde Portal" veya "Cuma Mesajları"
   - "Register app" butonuna tıklayın
   - Firebase SDK yapılandırmasını kopyalayın (config objesi)

## Adım 3: Firebase Config Bilgilerini Alma

1. "Project Settings" → "Your apps" → Web app
2. Config objesindeki değerleri kopyalayın:
   ```javascript
   {
     apiKey: "AIza...",
     authDomain: "cumamesajlari-6eeef.firebaseapp.com",
     projectId: "cumamesajlari-6eeef",
     storageBucket: "cumamesajlari-6eeef.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   }
   ```

## Adım 4: Firebase Studio'da Secrets Manager

1. Firebase Studio'yu açın (veya Firebase Console'dan)
2. Sol menüden "Secrets" veya "Environment Variables" seçin
3. Şu değişkenleri ekleyin (Config'den alınan değerlerle):

   - `NEXT_PUBLIC_FIREBASE_API_KEY` = apiKey değeri
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = authDomain değeri
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = projectId değeri
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = storageBucket değeri
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = messagingSenderId değeri
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = appId değeri

## Adım 5: Firebase Hosting Kontrolü

1. Firebase Console'da sol menüden "Hosting" seçin
2. Hosting etkin mi kontrol edin
3. **Etkin değilse:**
   - "Get started" butonuna tıklayın
   - Kurulum adımlarını takip edin

## Adım 6: Deploy İşlemi

### Seçenek A: Firebase Studio (Önerilen)
1. Firebase Studio'da projeyi açın
2. "Deploy" veya "Publish" butonuna tıklayın
3. Build otomatik başlar ve deploy yapılır

### Seçenek B: Firebase Console'dan
1. Firebase Console → Hosting
2. "Get started" ile Hosting'i etkinleştirin
3. Terminal'de deploy yapın (sonraki adımda)

## Adım 7: Deploy Sonrası

1. Firebase Console → Hosting → Site URL
2. Site URL'ini kopyalayın: `https://cumamesajlari-6eeef.web.app`
3. Chrome'da yeni sekmede açın ve test edin

