#!/usr/bin/env node
// Tüm yanlış/bozuk import edilmiş postları data.ts'den kaldır

const fs = require('fs');
const path = require('path');

const dataTsPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
let content = fs.readFileSync(dataTsPath, 'utf-8');

// 1) Eksik/kırık post bloklarını kaldır (sadece createdAt, status vb. var ama id/title yok)
content = content.replace(/\{\s*createdAt:[^}]*?\},/g, '');
content = content.replace(/\{\s*status:[^}]*?\},/g, '');
content = content.replace(/\{\s*youtubeVideoId:[^}]*?\},/g, '');

// 2) Belirli ID pattern'lerine sahip tüm test import postlarını kaldır
const testPostPatterns = [
  /post-176219\d+/g, // Tüm test import ID'leri (176219 ile başlayan)
];

for (const pattern of testPostPatterns) {
  // Post bloğunu bulup kaldır
  const regex = new RegExp(`\\{\\s*id:\\s*'${pattern.source.replace(/\\/g, '')}[^']*',[\\s\\S]*?\\},`, 'g');
  content = content.replace(regex, '');
}

// 3) Anlamsız başlıklara sahip postları kaldır
const meaninglessPatterns = [
  /Cuma Mesajlari bir (bağlantı|gönderi) paylaştı/i,
  /Facebook gönderisi/i,
  /Instagram gönderisi/i,
];

meaninglessPatterns.forEach(pattern => {
  // Post bloğunu bulup başlığı kontrol et
  const postBlockRegex = new RegExp(
    `\\{\\s*id:\\s*'([^']+)',[\\s\\S]*?title:\\s*'([^']*)',[\\s\\S]*?\\},`,
    'g'
  );
  
  content = content.replace(postBlockRegex, (match, id, title) => {
    if (pattern.test(title)) {
      return ''; // Anlamsız başlığa sahip postu kaldır
    }
    return match;
  });
});

// 4) Fazla boşlukları temizle
content = content.replace(/\n\s*\n\s*\n+/g, '\n\n');
content = content.replace(/,\s*,\s*/g, ',');
content = content.replace(/,\s*\n\s*\n\s*\}/g, '\n  }');

// 5) POSTS array'inin sonundaki fazla virgülleri temizle
content = content.replace(/,\s*\];/g, '\n];');

fs.writeFileSync(dataTsPath, content, 'utf-8');
console.log('Tüm yanlış import edilmiş postlar temizlendi.');


