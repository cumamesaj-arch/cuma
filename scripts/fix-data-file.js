#!/usr/bin/env node
// data.ts içindeki basit sözdizimi sorunlarını düzeltir
// 1) category: 'xxx',,  -> category: 'xxx',
// 2) imageId: 'id'\n    content: { -> imageId: 'id',\n    content: {

const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
let content = fs.readFileSync(dataPath, 'utf-8');

// 1) Çift virgülü tek virgüle indir
content = content.replace(/category:\s*'([^']*)',\s*,/g, "category: '$1',");

// 2) imageId sonrası eksik virgülü ekle
content = content.replace(/(imageId:\s*'[^']*')\s*\n\s*content:/g, "$1,\n    content:");

// 3) Güvenlik için imageIds sonrası eksik virgül
content = content.replace(/(imageIds:\s*\[[^\]]*\])\s*\n\s*content:/g, "$1,\n    content:");

fs.writeFileSync(dataPath, content, 'utf-8');
console.log('src/lib/data.ts düzeltildi.');



