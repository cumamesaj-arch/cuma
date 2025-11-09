const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../src/lib/data.ts');

console.log('Dosya okunuyor...');
let content = fs.readFileSync(dataFilePath, 'utf-8');

// Her post objesinde duplicate status'ları temizle
// Post objesi içinde birden fazla status: 'published' varsa sadece birini tut
const postRegex = /(\{\s*id:\s*'[^']+',[\s\S]*?)(\})/g;
content = content.replace(postRegex, (match, postContent, closingBrace) => {
  // Status'ları bul
  const statusMatches = postContent.match(/status:\s*'published'/g);
  
  if (statusMatches && statusMatches.length > 1) {
    // İlk status'u tut, diğerlerini kaldır
    let cleaned = postContent;
    let firstFound = false;
    
    cleaned = cleaned.replace(/status:\s*'published'/g, (statusMatch) => {
      if (!firstFound) {
        firstFound = true;
        return statusMatch;
      }
      // Sonraki status'ları kaldır
      return '';
    });
    
    // Boş satırları temizle
    cleaned = cleaned.replace(/\n\s*\n\s*status:\s*'published'/g, '');
    cleaned = cleaned.replace(/status:\s*'published'\s*\n\s*\n/g, '\n');
    
    return `${cleaned}${closingBrace}`;
  }
  
  return match;
});

// Temizleme: boş satırları ve fazla boşlukları düzenle
content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
content = content.replace(/,\s*\n\s*status:/g, ',\n    status:');

console.log('Dosya güncelleniyor...');
fs.writeFileSync(dataFilePath, content, 'utf-8');

console.log('✅ Duplicate status\'lar temizlendi!');


