#!/usr/bin/env node
// Tüm eksik/kırık post bloklarını agresif şekilde temizle

const fs = require('fs');
const path = require('path');

const dataTsPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
let content = fs.readFileSync(dataTsPath, 'utf-8');

// Tüm { ile başlayıp }, ile biten ama içinde id: olmayan blokları kaldır
// Bu, eksik/kırık post bloklarını temizler
const lines = content.split('\n');
const cleanedLines = [];
let inBlock = false;
let blockStart = -1;
let blockContent = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  // Post bloğu başlangıcı
  if (trimmed.startsWith('{') && !inBlock) {
    inBlock = true;
    blockStart = i;
    blockContent = line;
    continue;
  }
  
  // Post bloğu içindeyiz
  if (inBlock) {
    blockContent += '\n' + line;
    
    // Post bloğu bitişi
    if (trimmed.endsWith('},') || trimmed === '}') {
      inBlock = false;
      
      // Bloğun içinde id: var mı kontrol et
      if (blockContent.includes("id:") && blockContent.includes("title:")) {
        // Geçerli post bloğu, ekle
        cleanedLines.push(blockContent);
      } else {
        // Eksik/kırık blok, kaldır
        // Boş bırak
      }
      
      blockContent = '';
      continue;
    }
  } else {
    // Normal satır, ekle
    cleanedLines.push(line);
  }
}

// Eğer hala açık bir blok varsa, kaldır
if (inBlock && !blockContent.includes("id:")) {
  // Kaldır
} else if (inBlock) {
  cleanedLines.push(blockContent);
}

content = cleanedLines.join('\n');

// Fazla boşlukları temizle
content = content.replace(/\n\s*\n\s*\n+/g, '\n\n');
content = content.replace(/,\s*,\s*/g, ',');
content = content.replace(/,\s*\n\s*\n\s*\}/g, '\n  }');
content = content.replace(/export const POSTS: Post\[\] = \[\s*\n\s*\n/g, 'export const POSTS: Post[] = [\n');

fs.writeFileSync(dataTsPath, content, 'utf-8');
console.log('Agresif temizlik tamamlandı.');


