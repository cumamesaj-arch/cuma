# 🔧 Environment Variables - Adım Adım

## Ne Yapacağız?
Site çalışması için Firebase config değerlerini build'e ekleyeceğiz.

## Adım 1: Firebase Console'da Config Değerlerini Bulun

1. Chrome'da Firebase Console açıldı: https://console.firebase.google.com/project/studio-2885285944-396af/settings/general

2. Sol menüden **"Project Settings"** (⚙️) tıklayın

3. **"Your apps"** bölümünde **Web** (</>) ikonuna tıklayın

4. Eğer web app yoksa:
   - **"Add app"** veya **"Uygulama ekle"** butonuna tıklayın
   - **Web** (</>) seçin
   - App nickname: **"Mujde Portal"** yazın
   - **"Register app"** butonuna tıklayın

5. Firebase SDK yapılandırmasında şu değerleri bulun:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",                    // ← Bu değer
     authDomain: "studio-2885285944-396af.firebaseapp.com",  // ← Bu değer
     projectId: "studio-2885285944-396af",  // ← Bu değer
     storageBucket: "studio-2885285944-396af.appspot.com",  // ← Bu değer
     messagingSenderId: "123456789",        // ← Bu değer
     appId: "1:123456789:web:abc123"        // ← Bu değer
   };
   ```

## Adım 2: Bu Değerleri Bana Verin

Şu formatta paylaşın:
```
apiKey: AIza...
authDomain: studio-2885285944-396af.firebaseapp.com
projectId: studio-2885285944-396af
storageBucket: studio-2885285944-396af.appspot.com
messagingSenderId: 123456789
appId: 1:123456789:web:abc123
```

## Adım 3: Ben Dosyayı Oluşturacağım ve Deploy Edeceğim

Değerleri aldıktan sonra:
1. `.env.production` dosyasını oluşturacağım
2. Yeniden build alacağım
3. Deploy edeceğim

## Özet
**Sizden istediğim:** Firebase Console'dan 6 değeri kopyalayıp bana vermeniz.
**Ben yapacağım:** Dosyayı oluşturup deploy edeceğim.

