const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../src/lib/data.ts');

console.log('Dosya okunuyor...');
let content = fs.readFileSync(dataFilePath, 'utf-8');

// Her post objesinde duplicate status'ları temizle
// createdAt'ten önce olan status'u tut, createdAt'ten sonra olan status'u kaldır
content = content.replace(
  /(createdAt:\s*'[^']+')(\s*,\s*)(status:\s*'published')/g,
  '$1'
);

// Eğer status createdAt'ten önce yoksa ama createdAt'ten sonra varsa, createdAt'ten önce ekle
content = content.replace(
  /(content:\s*\{[\s\S]*?\})\s*,\s*(createdAt:\s*'[^']+')(\s*,\s*)(status:\s*'published')/g,
  (match, contentPart, createdAtPart, comma, statusPart) => {
    // Eğer content ile createdAt arasında status yoksa, createdAt'ten önce ekle
    if (!contentPart.includes('status:')) {
      return `${contentPart},\n    status: 'published',\n    ${createdAtPart}`;
    }
    // Eğer zaten varsa, createdAt'ten sonrakini kaldır
    return `${contentPart},\n    ${createdAtPart}`;
  }
);

// Son temizlik: createdAt'ten sonraki gereksiz status'ları kaldır
content = content.replace(
  /(createdAt:\s*'[^']+')(\s*,\s*status:\s*'published'\s*,\s*status:\s*'published')/g,
  '$1'
);

content = content.replace(
  /(createdAt:\s*'[^']+')(\s*,\s*status:\s*'published'\s*,\s*)(status:\s*'published')/g,
  '$1'
);

console.log('Dosya güncelleniyor...');
fs.writeFileSync(dataFilePath, content, 'utf-8');

// Kontrol et
const duplicateStatusPattern = /createdAt:\s*'[^']+'[\s\S]*?status:\s*'published'[\s\S]*?status:\s*'published'/g;
const duplicates = (content.match(duplicateStatusPattern) || []).length;

console.log(`✅ Duplicate status'lar temizlendi!`);
console.log(`   - Kalan duplicate sayısı: ${duplicates}`);


