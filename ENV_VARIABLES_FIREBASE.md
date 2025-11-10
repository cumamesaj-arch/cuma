# 🔧 Firebase App Hosting - Environment Variables

## 📋 Eklenecek Environment Variables

Firebase Console → App Hosting → Settings → Environment Variables sayfasına gidin ve şu değişkenleri ekleyin:

### Zorunlu Değişkenler:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB_YePigrW7TjzzXhrtoaimFktrlji8lRE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cuma-mesajlari-dfc6c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cuma-mesajlari-dfc6c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cuma-mesajlari-dfc6c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=136445087189
NEXT_PUBLIC_FIREBASE_APP_ID=1:136445087189:web:153086538227a86781015c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-512SQLEGJC
```

### Opsiyonel Değişkenler (AI özellikleri için):

```
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## 📝 Adım Adım

1. **Firebase Console → App Hosting → Settings**
2. **"Environment Variables"** sekmesine gidin
3. **"Add variable"** veya **"Değişken ekle"** butonuna tıklayın
4. Her değişken için:
   - **Name**: Değişken adı (örn: `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value**: Değişken değeri (yukarıdaki değerlerden)
   - **"Save"** tıklayın
5. Tüm değişkenleri ekledikten sonra **"Save"** tıklayın

## ⚠️ Önemli Notlar

- `NEXT_PUBLIC_` ile başlayan değişkenler client-side'da kullanılabilir
- Environment variables eklendikten sonra yeniden deploy gerekir
- Değişkenler deployment sırasında build'e dahil edilir


