const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../src/lib/data.ts');

console.log('Dosya okunuyor...');
let content = fs.readFileSync(dataFilePath, 'utf-8');

// Önce tüm status: 'draft' değerlerini status: 'published' olarak değiştir
content = content.replace(/status:\s*'draft'/g, "status: 'published'");

// Tüm category değerlerini 'cuma-mesajlari' yap (eğer farklıysa)
content = content.replace(/category:\s*'[^']+'/g, "category: 'cuma-mesajlari'");

// Status olmayan gönderiler için status ekle
// Her post objesini bul (id ile başlayıp } ile biten)
const postRegex = /(\{\s*id:\s*'[^']+',[\s\S]*?)(createdAt:\s*'[^']+')([\s,]*)/g;
content = content.replace(postRegex, (match, before, createdAt, suffix) => {
  // Eğer status zaten varsa değiştirme
  if (before.includes("status:")) {
    return match;
  }
  // Status yoksa ekle (createdAt'ten önce)
  return `${before}    status: 'published',\n    ${createdAt}${suffix}`;
});

console.log('Dosya güncelleniyor...');
fs.writeFileSync(dataFilePath, content, 'utf-8');

// Kontrol et
const draftCount = (content.match(/status:\s*'draft'/g) || []).length;
const publishedCount = (content.match(/status:\s*'published'/g) || []).length;
const differentCategories = (content.match(/category:\s*'(?!cuma-mesajlari')[^']+'/g) || []).length;

console.log(`✅ İşlem tamamlandı!`);
console.log(`   - Draft gönderi sayısı: ${draftCount}`);
console.log(`   - Published gönderi sayısı: ${publishedCount}`);
console.log(`   - Farklı kategori sayısı: ${differentCategories}`);
