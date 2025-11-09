// Usage: node scripts/ocr-batch-category.js "cuma-mesajlari" 20
// Finds first N posts in given category, OCR first image's first line, updates title in src/lib/data.ts

const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

async function ocrTitle(imagePath) {
  const extractBestTitleLine = (text) => {
    const lines = String(text || '')
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean);
    if (lines.length === 0) return '';
    
    // İlk satırı al
    let t = lines[0].replace(/\s+/g, ' ').trim();
    
    // Aynı başlığın iki kez yazılması durumunu temizle
    const duplicatePatterns = [
      /^(.+?)\s+\1\s*$/i,
      /^(.+?)\s*[-–—:]\s*\1\s*$/i,
      /^(.+?)\s*[|/·•]\s*\1\s*$/i,
      /^(.+?)\s*,\s*\1\s*$/i
    ];
    for (const p of duplicatePatterns) {
      const m = t.match(p);
      if (m) { t = m[1].trim(); break; }
    }
    
    // Sadece Türkçe karakterler, rakamlar ve bazı özel karakterler içeren satırları tercih et
    const turkishChars = /[A-ZÇĞİÖŞÜ]/i;
    const hasLetters = turkishChars.test(t);
    if (!hasLetters || t.length < 3) {
      // İlk satır uygun değilse, diğer satırları kontrol et
      for (let i = 1; i < Math.min(5, lines.length); i++) {
        let candidate = lines[i].replace(/\s+/g, ' ').trim();
        for (const p of duplicatePatterns) {
          const m = candidate.match(p);
          if (m) { candidate = m[1].trim(); break; }
        }
        if (turkishChars.test(candidate) && candidate.length >= 3) {
          t = candidate;
          break;
        }
      }
    }
    
    return t;
  };
  
  const result = await Tesseract.recognize(
    imagePath,
    'tur+eng',
    { 
      tessedit_char_whitelist: " ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789-–—:.'",
      preserve_interword_spaces: '1',
      user_defined_dpi: '300',
      psm: 6 // Otomatik blok tespiti
    }
  );
  return extractBestTitleLine(result?.data?.text);
}

function loadPlaceholderMap(phPath) {
  const raw = JSON.parse(fs.readFileSync(phPath, 'utf8'));
  const list = Array.isArray(raw) ? raw : Array.isArray(raw.placeholderImages) ? raw.placeholderImages : [];
  const byId = new Map();
  for (const x of list) byId.set(x.id, x);
  return byId;
}

function resolveImagePath(fromIdRecord) {
  if (!fromIdRecord || !fromIdRecord.imageUrl) return null;
  const relative = fromIdRecord.imageUrl.replace(/^\//, '');
  const candidate1 = path.resolve(__dirname, '..', relative);
  const candidate2 = path.resolve(__dirname, '../public', relative.replace(/^uploads\//, 'uploads/'));
  if (fs.existsSync(candidate1)) return candidate1;
  if (fs.existsSync(candidate2)) return candidate2;
  return null;
}

async function main() {
  const categoryArg = process.argv[2] || 'cuma-mesajlari';
  const limit = parseInt(process.argv[3] || '20', 10);
  const dataTsPath = path.resolve(__dirname, '../src/lib/data.ts');
  const phPath = path.resolve(__dirname, '../src/lib/placeholder-images.json');

  let dataSrc = fs.readFileSync(dataTsPath, 'utf8');
  const phById = loadPlaceholderMap(phPath);

  // Forward-only narrow window from category to next object end
  const targets = [];
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
  const catRe = new RegExp("category:\\s*['\"]" + escapeRegex(categoryArg) + "['\"]", 'gi');
  let m;
  while ((m = catRe.exec(dataSrc)) !== null) {
    // find end of current object by brace counting starting slightly before match
    let start = dataSrc.lastIndexOf('{', m.index);
    if (start < 0) start = m.index;
    let depth = 0, end = -1;
    for (let i = start; i < Math.min(dataSrc.length, start + 20000); i++) {
      const ch = dataSrc[i];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
    }
    if (end === -1) continue;
    const block = dataSrc.slice(start, end);
    // extract old title for comparison
    const oldTitleMatch = block.match(/title:\s*(['\"`])(.*?)\1/);
    const oldTitle = oldTitleMatch ? oldTitleMatch[2] : '';
    const mid = block.match(/imageId:\s*['\"]([^'\"]+)['\"]/);
    let firstId = null;
    if (mid) firstId = mid[1];
    if (!firstId) {
      const mids = block.match(/imageIds:\s*\[([^\]]+)\]/);
      if (mids) {
        const ids = (mids[1].match(/['\"]([^'\"]+)['\"]/g) || []).map(s=>s.replace(/^['\"]|['\"]$/g,''));
        if (ids.length) firstId = ids[0];
      }
    }
    if (!firstId) continue;
    if (!targets.find(t=>t.imageId===firstId)) targets.push({ imageId: firstId, oldTitle });
    if (targets.length >= limit) break;
  }

  console.log(`Bulunan hedef gönderi: ${targets.length} adet (kategori: ${categoryArg})\n`);
  let updates = 0;
  for (const t of targets) {
    const rec = phById.get(t.imageId);
    if (!rec) { console.warn('placeholder bulunamadı:', t.imageId); continue; }
    const imgPath = resolveImagePath(rec);
    if (!imgPath) { console.warn('görsel yolu bulunamadı:', rec.imageUrl); continue; }
    console.log(`[${updates + 1}/${targets.length}] OCR işleniyor: ${path.basename(imgPath)}`);
    let title;
    try {
      title = await ocrTitle(imgPath);
    } catch (e) {
      console.warn('OCR hata:', e?.message || e); continue;
    }
    if (!title) { console.warn('OCR boş sonuç'); continue; }
    const safe = title.replace(/`/g, '\\`');
    const reA = new RegExp('(imageId:\\s*["\']' + t.imageId + '["\'][\\s\\S]*?title:\\s*)(["\'])[^\"\']*\\2', 'g');
    const reB = new RegExp('(imageIds:[\\s\\S]*?["\']' + t.imageId + '["\'][\\s\\S]*?title:\\s*)(["\'])[^\"\']*\\2', 'g');
    const before = dataSrc;
    dataSrc = dataSrc.replace(reA, (_, a) => a + '`' + safe + '`').replace(reB, (_, a) => a + '`' + safe + '`');
    if (dataSrc === before) { console.warn('title değişmedi (id:', t.imageId, ')'); continue; }
    console.log(`  Eski: ${t.oldTitle || '(boş)'}`);
    console.log(`  Yeni: ${title}`);
    console.log('');
    updates += 1;
  }

  if (updates > 0) {
    fs.writeFileSync(dataTsPath, dataSrc);
    console.log(`\n✅ Güncellenen gönderi sayısı: ${updates}`);
  } else {
    console.log('Güncellenecek uygun gönderi bulunamadı.');
  }
}

main();


