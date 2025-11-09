#!/usr/bin/env node
// Eksik/kırık post bloklarını (id veya title olmayan) data.ts'den kaldır

const fs = require('fs');
const path = require('path');

const dataTsPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
let content = fs.readFileSync(dataTsPath, 'utf-8');

// Eksik blokları kaldır: id veya title olmayan bloklar
// Pattern: { ile başlayıp }, ile biten ama içinde id: yoksa
const incompleteBlockRegex = /\{\s*(?:createdAt|status|youtubeVideoId|imageId|imageIds|content|category|slug):[^}]*?\},/g;

content = content.replace(incompleteBlockRegex, '');

// Fazla boşlukları temizle
content = content.replace(/\n\s*\n\s*\n+/g, '\n\n');
content = content.replace(/,\s*,\s*/g, ',');
content = content.replace(/,\s*\n\s*\n\s*\}/g, '\n  }');
content = content.replace(/export const POSTS: Post\[\] = \[\s*\n\s*\n/g, 'export const POSTS: Post[] = [\n');

fs.writeFileSync(dataTsPath, content, 'utf-8');
console.log('Eksik/kırık post blokları temizlendi.');


