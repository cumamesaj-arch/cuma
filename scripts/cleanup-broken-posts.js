#!/usr/bin/env node
// Yanlış import edilmiş postları data.ts'den kaldır

const fs = require('fs');
const path = require('path');

const dataTsPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
let fileContent = fs.readFileSync(dataTsPath, 'utf-8');

// 1) Belirli ID pattern'lerine sahip bozuk postları kaldır
const brokenPostPatterns = [
  /\{\s*id:\s*'post-176219712581[^']*',[\s\S]*?createdAt:[^}]*?\},/g,
  /\{\s*id:\s*'post-176219764[^']*',[\s\S]*?createdAt:[^}]*?\},/g,
  /\{\s*id:\s*'post-176219783[^']*',[\s\S]*?createdAt:[^}]*?\},/g,
  /\{\s*id:\s*'post-176219786[^']*',[\s\S]*?createdAt:[^}]*?\},/g,
  /\{\s*id:\s*'post-176219790[^']*',[\s\S]*?createdAt:[^}]*?\},/g,
  /\{\s*id:\s*'post-176219835[^']*',[\s\S]*?createdAt:[^}]*?\},/g,
];

for (const pattern of brokenPostPatterns) {
  fileContent = fileContent.replace(pattern, '');
}

// 2) Anlamsız başlıklara sahip postları kaldır
// "Cuma Mesajlari bir bağlantı paylaştı" veya "Cuma Mesajlari bir gönderi paylaştı" gibi
const meaninglessTitles = [
  /Cuma Mesajlari bir bağlantı paylaştı/i,
  /Cuma Mesajlari bir gönderi paylaştı/i,
  /Facebook gönderisi/i,
  /Instagram gönderisi/i,
];

// Her post bloğunu kontrol et ve anlamsız başlıkları kaldır
let cleaned = fileContent;
meaninglessTitles.forEach(titlePattern => {
  // Post bloğunu bulup başlığı kontrol et
  const postBlockPattern = new RegExp(
    `\\{\\s*id:\\s*'([^']+)',[\\s\\S]*?title:\\s*'([^']*)',[\\s\\S]*?\\},`,
    'g'
  );
  
  cleaned = cleaned.replace(postBlockPattern, (match, id, title) => {
    if (titlePattern.test(title)) {
      return ''; // Anlamsız başlığa sahip postu kaldır
    }
    return match; // Diğer postları koru
  });
});

// 3) Fazla boşlukları temizle
cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');
// Boş satırları düzelt
cleaned = cleaned.replace(/\{\s*\n\s*\n\s*\}/g, '');
// Virgül sorunlarını düzelt
cleaned = cleaned.replace(/,\s*,\s*/g, ',');
cleaned = cleaned.replace(/,\s*\n\s*\n\s*\}/g, '\n  }');

fs.writeFileSync(dataTsPath, cleaned, 'utf-8');
console.log('Yanlış import edilmiş postlar temizlendi.');

