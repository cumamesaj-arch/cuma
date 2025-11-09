# 🔧 Firebase Proje Erişim Sorunu Çözümü

## Sorun
Firebase Console'da hata: "The project does not exist or you do not have permission to list apps in the project"

## Çözüm Adımları

### Seçenek 1: Mevcut Projeleri Kontrol Et

1. Firebase Console ana sayfasına gidin: https://console.firebase.google.com/
2. Tüm projelerinizi görüntüleyin
3. `cumamesajlari-6eeef` projesi listede var mı kontrol edin

### Seçenek 2: Yeni Proje Oluştur

Eğer proje yoksa veya erişim yoksa:

1. Firebase Console ana sayfasında "Add project" veya "Proje ekle" tıklayın
2. Proje adı: "Cuma Mesajları" veya "Mujde Portal"
3. Google Analytics'i etkinleştirin (önerilir)
4. "Create project" tıklayın
5. Proje oluşturulduktan sonra yeni Proje ID'sini alın

### Seçenek 3: Proje ID'sini Güncelle

Yeni proje oluşturulduktan sonra:

1. `.firebaserc` dosyasındaki proje ID'sini güncelleyin
2. Firebase CLI ile projeyi bağlayın

## Hangi Projeyi Kullanmalıyız?

Firebase Console'da hangi projeleri görüyorsunuz? 
- Mevcut bir projeyi kullanabiliriz
- Veya yeni bir proje oluşturabiliriz

