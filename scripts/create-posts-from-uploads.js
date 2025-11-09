#!/usr/bin/env node
// public/uploads klasöründeki TÜM görsellerden
// placeholder-images.json'a ekler ve "cuma-mesajlari" kategorisinde Post kayıtları üretir

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
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function escapeTpl(str) {
  return String(str).replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\\/g, '\\\\');
}

async function getAllImageFiles(dir) {
  const files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          files.push({
            name: entry.name,
            path: fullPath,
            url: `/uploads/${entry.name}`
          });
        }
      }
    }
  } catch (err) {
    console.error('Klasör okuma hatası:', err.message);
  }
  return files;
}

async function main() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const placeholderPath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');
  const dataTsPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');

  // 1. public/uploads klasöründeki tüm görselleri bul
  console.log('Görseller taranıyor...');
  const imageFiles = await getAllImageFiles(uploadsDir);
  console.log(`${imageFiles.length} adet görsel bulundu.`);

  if (imageFiles.length === 0) {
    console.log('Görsel bulunamadı.');
    return;
  }

  // 2. placeholder-images.json'u oku
  let placeholderData;
  try {
    const raw = await fs.readFile(placeholderPath, 'utf-8');
    placeholderData = JSON.parse(raw);
  } catch (err) {
    placeholderData = { placeholderImages: [] };
  }

  if (!Array.isArray(placeholderData.placeholderImages)) {
    placeholderData.placeholderImages = [];
  }

  // 3. Her görsel için placeholder-images.json'da kayıt oluştur (yoksa)
  const existingUrls = new Set(placeholderData.placeholderImages.map(img => img.imageUrl));
  let addedCount = 0;

  for (const imgFile of imageFiles) {
    if (!existingUrls.has(imgFile.url)) {
      const imageId = `upload-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
      const fileName = path.basename(imgFile.name, path.extname(imgFile.name));
      placeholderData.placeholderImages.push({
        id: imageId,
        imageUrl: imgFile.url,
        description: fileName,
        imageHint: 'uploaded'
      });
      addedCount++;
    }
  }

  if (addedCount > 0) {
    await fs.writeFile(placeholderPath, JSON.stringify(placeholderData, null, 2), 'utf-8');
    console.log(`${addedCount} adet görsel placeholder-images.json'a eklendi.`);
  } else {
    console.log('Tüm görseller zaten placeholder-images.json\'da mevcut.');
  }

  // 4. data.ts'yi oku
  const fileContent = await fs.readFile(dataTsPath, 'utf-8');
  const postsRegex = /export const POSTS: Post\[] = \[/;
  const match = fileContent.match(postsRegex);
  if (!match) {
    throw new Error('data.ts içinde POSTS bulunamadı');
  }

  // 5. Var olan post slug'larını kontrol et
  const existingSlugs = new Set(
    (fileContent.match(/slug:\s*'([^']+)'/g) || []).map(s => s.replace(/.*'|'.*/g, ''))
  );

  // 6. Her görsel için post oluştur
  const nowIso = new Date().toISOString();
  const newPosts = [];

  for (const img of placeholderData.placeholderImages) {
    // Sadece /uploads/ ile başlayan görselleri işle
    if (!img.imageUrl.startsWith('/uploads/')) continue;

    // Zaten bu görsel için post var mı kontrol et
    const imageIdPattern = new RegExp(`imageId:\\s*'${img.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g');
    if (fileContent.match(imageIdPattern)) {
      continue; // Bu görsel için zaten post var
    }

    const titleBase = img.description || img.imageUrl.split('/').pop() || 'Cuma Mesajı';
    let baseSlug = slugify(String(titleBase).slice(0, 60)) || 'cuma-mesaji';
    let slug = baseSlug;
    let idx = 1;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${idx++}`;
    }
    existingSlugs.add(slug);

    const postId = `post-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const meal = `Paylaşılan görsel: ${img.description || ''}`.trim();

    newPosts.push({
      id: postId,
      title: titleBase,
      slug: slug,
      imageId: img.id,
      meal: meal
    });
  }

  if (newPosts.length === 0) {
    console.log('Tüm görseller için zaten post mevcut.');
    return;
  }

  // 7. Post'ları data.ts'ye ekle
  const postBlocks = newPosts.map(post => {
    return `\n  {\n    id: '${escapeSingle(post.id)}',\n    title: '${escapeSingle(post.title)}',\n    slug: '${escapeSingle(post.slug)}',\n    category: 'cuma-mesajlari',\n    imageId: '${escapeSingle(post.imageId)}',\n    imageIds: ['${escapeSingle(post.imageId)}'],\n    content: {\n      meal: \`${escapeTpl(post.meal)}\`,\n      mealleri: '',\n      tefsir: '',\n      kisaTefsir: '',\n    },\n    createdAt: '${escapeSingle(nowIso)}',\n    status: 'published'\n  },`;
  });

  const newContent = fileContent.replace(postsRegex, `export const POSTS: Post[] = [${postBlocks.join('')}`);
  await fs.writeFile(dataTsPath, newContent, 'utf-8');

  console.log(`\n✅ Başarılı: ${newPosts.length} adet cuma-mesajları postu oluşturuldu.`);
  console.log(`📁 Toplam görsel: ${imageFiles.length}`);
  console.log(`➕ Yeni eklenen görsel: ${addedCount}`);
  console.log(`📝 Yeni oluşturulan post: ${newPosts.length}`);
}

main().catch(e => {
  console.error('Hata:', e);
  process.exit(1);
});





