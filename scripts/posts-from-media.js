#!/usr/bin/env node
// Medya Deposundaki (placeholder-images.json) TÜM görsellerden
// "cuma-mesajlari" kategorisinde minimal Post kayıtları üretir

const fs = require('fs/promises');
const path = require('path');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function escapeSingle(str) {
  return String(str).replace(/\\/g, '\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function escapeTpl(str) {
  return String(str).replace(/`/g, '\\`').replace(/\\/g, '\\');
}

async function main() {
  const placeholderPath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');
  const dataTsPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
  const raw = await fs.readFile(placeholderPath, 'utf-8');
  const ph = JSON.parse(raw);
  const images = Array.isArray(ph.placeholderImages) ? ph.placeholderImages : [];
  if (images.length === 0) {
    console.log('Medya Deposu boş.');
    return;
  }

  const fileContent = await fs.readFile(dataTsPath, 'utf-8');
  const postsRegex = /export const POSTS: Post\[] = \[/;
  const match = fileContent.match(postsRegex);
  if (!match) {
    throw new Error('data.ts içinde POSTS bulunamadı');
  }

  // Var olan post başlıklarını kontrol etmek için (id/slug çakışmasın)
  const existingSlugs = new Set(
    (fileContent.match(/slug:\s*'([^']+)'/g) || []).map(s => s.replace(/.*'|'.*/g, ''))
  );

  const nowIso = new Date().toISOString();
  const blocks = images.map(img => {
    const titleBase = img.description || img.imageHint || img.imageUrl.split('/').pop() || 'Cuma Mesajı';
    let baseSlug = slugify(String(titleBase).slice(0, 60)) || 'cuma-mesaji';
    let slug = baseSlug;
    let idx = 1;
    while (existingSlugs.has(slug)) { slug = `${baseSlug}-${idx++}`; }
    existingSlugs.add(slug);
    const postId = `post-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
    const meal = `Paylaşılan görsel: ${img.description || ''}`.trim();
    return `\n  {\n    id: '${escapeSingle(postId)}',\n    title: '${escapeSingle(titleBase)}',\n    slug: '${escapeSingle(slug)}',\n    category: 'cuma-mesajlari',\n    imageId: '${escapeSingle(img.id)}',\n    content: {\n      meal: \`${escapeTpl(meal)}\`,\n      mealleri: '',\n      tefsir: '',\n      kisaTefsir: '',\n    },\n    createdAt: '${escapeSingle(nowIso)}',\n    status: 'draft'\n  },`;
  });

  const newContent = fileContent.replace(postsRegex, `export const POSTS: Post[] = [${blocks.join('')}`);
  await fs.writeFile(dataTsPath, newContent, 'utf-8');
  console.log(`Başarılı: ${blocks.length} adet cuma-mesajları postu oluşturuldu.`);
}

main().catch(e => { console.error(e); process.exit(1); });



