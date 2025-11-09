#!/usr/bin/env node
// Belirtilen klasördeki tüm görselleri public/uploads altına kopyalar
// ve src/lib/placeholder-images.json dosyasına ekler

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--dir') out.dir = args[++i];
    else if (a === '--glob') out.glob = args[++i];
  }
  if (!out.dir) {
    console.error('Kullanım: node scripts/bulk-import-media.js --dir "C:/path/to/images"');
    process.exit(1);
  }
  return out;
}

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

function isImageFile(file) {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(file);
}

async function walk(dir, files = []) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, files);
    else if (isImageFile(e.name)) files.push(full);
  }
  return files;
}

async function loadPlaceholderDb() {
  const dbPath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');
  const raw = await fsp.readFile(dbPath, 'utf-8');
  const json = JSON.parse(raw);
  if (!Array.isArray(json.placeholderImages)) json.placeholderImages = [];
  return { dbPath, json };
}

async function main() {
  const { dir } = parseArgs();
  const absSource = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
  if (!fs.existsSync(absSource)) {
    console.error('Klasör bulunamadı:', absSource);
    process.exit(2);
  }

  const files = await walk(absSource);
  if (files.length === 0) {
    console.log('İçe aktarılacak görsel bulunamadı.');
    return;
  }

  const publicDir = path.join(process.cwd(), 'public');
  const uploadsDir = path.join(publicDir, 'uploads');
  await ensureDir(uploadsDir);

  const { dbPath, json } = await loadPlaceholderDb();
  const added = [];

  for (const src of files) {
    const ext = path.extname(src) || '.jpg';
    const fileName = `bulk_${Date.now()}_${Math.floor(Math.random()*1e6)}${ext}`;
    const dest = path.join(uploadsDir, fileName);
    await fsp.copyFile(src, dest);
    const imageUrl = `/uploads/${fileName}`;
    const rec = {
      id: `upload-${Date.now()}-${Math.floor(Math.random()*1e6)}`,
      imageUrl,
      description: path.basename(src),
      imageHint: 'uploaded-bulk'
    };
    json.placeholderImages.unshift(rec);
    added.push(rec);
  }

  await fsp.writeFile(dbPath, JSON.stringify(json, null, 2), 'utf-8');
  console.log(`Başarılı: ${added.length} görsel eklendi.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});



