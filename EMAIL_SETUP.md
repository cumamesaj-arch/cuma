# Email Servisi Yapılandırma Kılavuzu

## Sorun
Email gönderme işlemi çalışmıyor çünkü `EMAIL_USER` ve `EMAIL_PASSWORD` environment variables eksik.

## Çözüm: Firebase Console'dan Email Ayarlarını Ekleme

### Adım 1: Firebase Console'a Giriş
1. [Firebase Console](https://console.firebase.google.com/) açın
2. Projenizi seçin: `cuma-mesajlari-dfc6c`

### Adım 2: App Hosting Backend Ayarları
1. Sol menüden **App Hosting** seçin
2. Backend'inizi seçin: `cuma`
3. **Environment** sekmesine gidin
4. **Add Variable** butonuna tıklayın

### Adım 3: Email Değişkenlerini Ekle

#### EMAIL_USER (Gmail için)
- **Variable name:** `EMAIL_USER`
- **Value:** Gmail adresiniz (örn: `your-email@gmail.com`)
- **Type:** Secret (güvenlik için)

#### EMAIL_PASSWORD (Gmail App Password)
- **Variable name:** `EMAIL_PASSWORD`
- **Value:** Gmail App Password (aşağıdaki adımları takip edin)
- **Type:** Secret (güvenlik için)

### Adım 4: Gmail App Password Oluşturma

Gmail için normal şifre yerine **App Password** kullanmanız gerekiyor:

1. [Google Account](https://myaccount.google.com/) açın
2. **Security** (Güvenlik) sekmesine gidin
3. **2-Step Verification** (2 Adımlı Doğrulama) aktif olmalı
4. **App passwords** (Uygulama şifreleri) bölümüne gidin
5. **Select app:** "Mail" seçin
6. **Select device:** "Other (Custom name)" seçin ve "Cuma Mesajları" yazın
7. **Generate** butonuna tıklayın
8. Oluşturulan 16 haneli şifreyi kopyalayın (boşluklar olmadan)
9. Bu şifreyi `EMAIL_PASSWORD` olarak Firebase Console'a ekleyin

### Adım 5: Değişiklikleri Kaydet
1. Her iki değişkeni de ekledikten sonra **Save** butonuna tıklayın
2. Backend otomatik olarak yeniden deploy edilecek (~2-3 dakika)

## Test Etme

1. Deploy tamamlandıktan sonra `/admin/login` sayfasına gidin
2. "Şifremi Unuttum" butonuna tıklayın
3. Email adresinizi girin
4. "Email Gönder" butonuna tıklayın
5. Email kutunuzu kontrol edin

## Alternatif: Başka SMTP Servisi Kullanma

Gmail yerine başka bir SMTP servisi kullanmak isterseniz:

1. `apphosting.yaml` dosyasında `EMAIL_SERVICE` değerini değiştirin
2. Örneğin Outlook için: `EMAIL_SERVICE: outlook`
3. `EMAIL_USER` ve `EMAIL_PASSWORD` değerlerini ilgili servisin bilgileriyle güncelleyin

## Sorun Giderme

### Email gönderilmiyor
- ✅ `EMAIL_USER` ve `EMAIL_PASSWORD` Firebase Console'da eklendi mi?
- ✅ Gmail App Password kullanıldı mı? (normal şifre değil!)
- ✅ 2-Step Verification aktif mi?
- ✅ Backend yeniden deploy edildi mi?

### "Invalid login" hatası
- Gmail App Password kullanıldığından emin olun
- Normal Gmail şifresi çalışmaz

### "ECONNECTION" hatası
- İnternet bağlantısını kontrol edin
- Firewall ayarlarını kontrol edin

## Notlar

- Email değişkenleri **Secret** olarak eklenmelidir (güvenlik için)
- Gmail App Password 16 haneli bir şifredir (boşluklar olmadan)
- Backend her değişiklikten sonra otomatik olarak yeniden deploy edilir

