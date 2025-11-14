# Firebase Index Kurulumu

## Index'leri Deploy Etme

Test scriptinde index hatası alıyorsanız, index'leri Firebase'e deploy etmeniz gerekiyor:

```bash
firebase deploy --only firestore:indexes
```

Veya tüm Firebase servislerini deploy etmek için:

```bash
firebase deploy
```

## Eklenen Index'ler

### Posts Koleksiyonu:
1. `category + createdAt` - Kategoriye göre sıralama
2. `category + status + createdAt` - Kategori ve duruma göre filtreleme + sıralama
3. `status + createdAt` - Duruma göre filtreleme + sıralama
4. `status + order` - Durum ve sıralama numarasına göre

### Images Koleksiyonu:
1. `imageHint + id` - Görsel tipine göre filtreleme + ID'ye göre sıralama
2. `imageHint + description` - Görsel tipine göre filtreleme + açıklamaya göre sıralama

## Index Oluşturma Süresi

Index'ler oluşturulurken birkaç dakika sürebilir. Firebase Console'dan index durumunu kontrol edebilirsiniz:
- [Firebase Console - Firestore Indexes](https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/firestore/indexes)

## Alternatif: Index Oluşturma Linki

Hata mesajında verilen link'i kullanarak da index'leri oluşturabilirsiniz. Test scripti çalıştırıldığında hata mesajında link görünecektir.

