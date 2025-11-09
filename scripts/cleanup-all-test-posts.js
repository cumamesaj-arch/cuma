#!/usr/bin/env node
// Tüm test import postlarını (post-176219 ile başlayanlar) data.ts'den kaldır

const fs = require('fs');
const path = require('path');

const dataTsPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
let content = fs.readFileSync(dataTsPath, 'utf-8');

// Tüm post-176219 ile başlayan ID'lere sahip post bloklarını kaldır
// Post bloğu: { ile başlayıp }, ile biten ve içinde id: 'post-176219...' olan

let cleaned = content;
let removed = 0;

// Post bloğunu bulmak için daha güvenilir pattern
// { ile başlayıp }, ile biten ve içinde id: 'post-176219...' içeren
const postBlockRegex = /\{\s*id:\s*'post-176219[^']*',[\s\S]*?\},/g;

cleaned = cleaned.replace(postBlockRegex, (match) => {
  removed++;
  return ''; // Post bloğunu kaldır
});

// Eksik/kırık blokları temizle (sadece createdAt, status vb. var)
cleaned = cleaned.replace(/\{\s*createdAt:[^}]*?\},/g, '');
cleaned = cleaned.replace(/\{\s*status:[^}]*?\},/g, '');
cleaned = cleaned.replace(/\{\s*youtubeVideoId:[^}]*?\},/g, '');
cleaned = cleaned.replace(/\{\s*imageId:[^}]*?\},/g, '');
cleaned = cleaned.replace(/\{\s*imageIds:[^}]*?\},/g, '');

// Fazla boşlukları temizle
cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');
cleaned = cleaned.replace(/,\s*,\s*/g, ',');
cleaned = cleaned.replace(/,\s*\n\s*\n\s*\}/g, '\n  }');

// POSTS array'inin başında ve sonunda fazla boşluk/virgül temizle
cleaned = cleaned.replace(/export const POSTS: Post\[\] = \[\s*\n\s*\n/g, 'export const POSTS: Post[] = [\n');
cleaned = cleaned.replace(/,\s*\n\s*\];/g, '\n];');

fs.writeFileSync(dataTsPath, cleaned, 'utf-8');
console.log(`${removed} test post temizlendi.`);


