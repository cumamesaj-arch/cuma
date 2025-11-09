# 🚀 Yayınlama Öncelikleri - Adım Adım

## ✅ ÖNCELİK 1: Environment Variables (ZORUNLU)

### Firebase Config Değerleri
Firebase Console'dan alınması gereken değerler:

1. **Firebase Console'a gidin**: https://console.firebase.google.com/project/studio-2885285944-396af
2. **Project Settings** → **Your apps** → **Web** ikonuna tıklayın
3. **Firebase SDK config** değerlerini kopyalayın:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyChfP50uN7l9277WW61pDlU2MBpxcUybNw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-2885285944-396af.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-2885285944-396af
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-2885285944-396af.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1013431767645
NEXT_PUBLIC_FIREBASE_APP_ID=1:1013431767645:web:c6b47af195cfbc9d0873b4
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3YZV7MZNF7
```

### `.env.production` Dosyası Oluşturma
```bash
cd project
# .env.production dosyası oluşturun ve yukarıdaki değerleri ekleyin
```

**Durum**: ✅ Değerler alındı, `.env.production` oluşturulmalı

---

## ✅ ÖNCELİK 2: Production Build

### Build Kontrolü
```bash
cd project
npm run build
```

**Kontrol Edilecekler**:
- [ ] Build başarılı mı?
- [ ] TypeScript hataları var mı?
- [ ] Tüm sayfalar derlendi mi?

**Durum**: ⏳ Yapılacak

---

## ✅ ÖNCELİK 3: Firebase Hosting Kontrolü

### Hosting Durumu
1. Firebase Console: https://console.firebase.google.com/project/studio-2885285944-396af/hosting
2. Hosting etkin mi kontrol edin
3. Etkin değilse "Get started" ile etkinleştirin

**Durum**: ✅ Hosting etkin (deploy yapıldı)

---

## ✅ ÖNCELİK 4: Firebase Services Kontrolü

### Gerekli Servisler
- [ ] **Firestore Database**: Etkin mi?
- [ ] **Storage**: Etkin mi?
- [ ] **Authentication**: Etkin mi?
- [ ] **Hosting**: Etkin mi?

**Kontrol**: Firebase Console → Project Settings → Services

**Durum**: ⏳ Kontrol edilmeli

---

## ✅ ÖNCELİK 5: Firebase Rules Kontrolü

### Security Rules
- [ ] **Firestore Rules**: `firestore.rules` dosyası doğru mu?
- [ ] **Storage Rules**: `storage.rules` dosyası doğru mu?

**Kontrol**: Firebase Console → Firestore Database → Rules
**Kontrol**: Firebase Console → Storage → Rules

**Durum**: ⏳ Kontrol edilmeli

---

## ✅ ÖNCELİK 6: Deploy İşlemi

### Deploy Komutu
```bash
cd project
firebase use studio-2885285944-396af
npm run build
firebase deploy --only hosting
```

**Durum**: ✅ Deploy yapıldı (ancak environment variables eksik olabilir)

---

## ✅ ÖNCELİK 7: Post-Deploy Test

### Site Testi
- [ ] Ana sayfa açılıyor mu? (https://studio-2885285944-396af.web.app)
- [ ] Admin paneli çalışıyor mu? (`/admin`)
- [ ] API endpoint'leri çalışıyor mu?
- [ ] Görseller yükleniyor mu?
- [ ] Firebase bağlantısı çalışıyor mu?

**Durum**: ⏳ Test edilmeli

---

## 📋 ÖNCELİK SIRASI

1. **🔥 EN ÖNEMLİ**: `.env.production` dosyası oluştur ve Firebase değerlerini ekle
2. **🔥 ÖNEMLİ**: Production build al (`npm run build`)
3. **🔥 ÖNEMLİ**: Firebase Services kontrol et (Firestore, Storage, Auth)
4. **⚡ ÖNEMLİ**: Firebase Rules kontrol et
5. **⚡ ÖNEMLİ**: Deploy yap (`firebase deploy --only hosting`)
6. **✅ KONTROL**: Site test et

---

## 🚨 KRİTİK HATALAR

### Eğer Site Çalışmıyorsa:

1. **Environment Variables Eksik**
   - `.env.production` dosyası var mı?
   - Değerler doğru mu?

2. **Firebase Services Eksik**
   - Firestore etkin mi?
   - Storage etkin mi?
   - Auth etkin mi?

3. **Build Hataları**
   - `npm run build` başarılı mı?
   - TypeScript hataları var mı?

4. **Firebase Rules Sorunları**
   - Firestore rules doğru mu?
   - Storage rules doğru mu?

---

## 📝 HIZLI KONTROL LİSTESİ

```bash
# 1. Environment variables kontrol
cd project
cat .env.production

# 2. Build test
npm run build

# 3. Firebase proje kontrol
firebase use

# 4. Deploy
firebase deploy --only hosting

# 5. Site test
start chrome https://studio-2885285944-396af.web.app
```

---

## 🎯 ŞİMDİ YAPILACAKLAR

1. ✅ `.env.production` dosyasını oluştur (Firebase değerleri ile)
2. ✅ Production build al
3. ✅ Firebase Services kontrol et
4. ✅ Deploy yap
5. ✅ Site test et

