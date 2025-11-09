// Usage: node scripts/ocr-update-title.js <filename.jpg>
// Extract first text line via OCR (tesseract.js, lang 'tur') and set it as post title

const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

async function main() {
  const targetFile = process.argv[2];
  if (!targetFile) {
    console.error('Kullanım: node scripts/ocr-update-title.js <gorsel_dosyasi.jpg>');
    process.exit(1);
  }

  const phPath = path.resolve(__dirname, '../src/lib/placeholder-images.json');
  const dataTsPath = path.resolve(__dirname, '../src/lib/data.ts');

  // En iyi başlık satırını al ve yinelenmiş başlıkları temizle
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

  // Eğer doğrudan bir dosya yolu verdiysek: sadece OCR yap, yazdır ve çık
  const absArgPath = path.isAbsolute(targetFile) ? targetFile : path.resolve(process.cwd(), targetFile);
  if (fs.existsSync(absArgPath)) {
    console.log('OCR (doğrudan yol) başlıyor:', absArgPath);
    const result = await Tesseract.recognize(
      absArgPath,
      'tur+eng',
      { 
        tessedit_char_whitelist: " ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789-–—:.'",
        preserve_interword_spaces: '1',
        user_defined_dpi: '300',
        psm: 6 // Otomatik blok tespiti
      }
    ).catch(err => {
      console.error('OCR hatası:', err);
      process.exit(6);
    });
    const firstLine = extractBestTitleLine(result?.data?.text);
    if (!firstLine) {
      console.error('OCR metin bulunamadı.');
      process.exit(7);
    }
    console.log('OCR ilk satır:', firstLine);
    process.exit(0);
  }

  if (!fs.existsSync(phPath)) {
    console.error('placeholder-images.json bulunamadı:', phPath);
    process.exit(2);
  }
  if (!fs.existsSync(dataTsPath)) {
    console.error('data.ts bulunamadı:', dataTsPath);
    process.exit(3);
  }

  const phRaw = JSON.parse(fs.readFileSync(phPath, 'utf8'));
  const placeholders = Array.isArray(phRaw) ? phRaw : Array.isArray(phRaw.placeholderImages) ? phRaw.placeholderImages : [];
  const record = placeholders.find(x => {
    const url = String(x.imageUrl || '');
    const desc = String(x.description || '');
    return url.endsWith(targetFile) || desc === targetFile;
  });
  if (!record) {
    console.error('Görsel bulunamadı:', targetFile);
    process.exit(4);
  }

  const relativePath = record.imageUrl.replace(/^\//, '');
  const candidate1 = path.resolve(__dirname, '..', relativePath);
  const candidate2 = path.resolve(__dirname, '../public', relativePath.replace(/^uploads\//, 'uploads/'));
  const imagePath = fs.existsSync(candidate1) ? candidate1 : fs.existsSync(candidate2) ? candidate2 : null;
  if (!imagePath) {
    console.error('Görsel dosyası bulunamadı:', candidate1, 'veya', candidate2);
    process.exit(5);
  }

  console.log('OCR başlıyor:', imagePath);
  const result = await Tesseract.recognize(
    imagePath,
    'tur+eng',
    { 
      tessedit_char_whitelist: " ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789-–—:.'",
      preserve_interword_spaces: '1',
      user_defined_dpi: '300',
      psm: 6 // Otomatik blok tespiti
    }
  ).catch(err => {
    console.error('OCR hatası:', err);
    process.exit(6);
  });

  const firstLine = extractBestTitleLine(result?.data?.text);
  if (!firstLine) {
    console.error('OCR metin bulunamadı.');
    process.exit(7);
  }
  console.log('OCR ilk satır:', firstLine);

  const postImageId = record.id;
  let dataSrc = fs.readFileSync(dataTsPath, 'utf8');

  // Escape backticks for template usage in TS file
  const safe = firstLine.replace(/`/g, '\\`');

  // Two patterns:
  // 1) imageId: "<id>" ... title: "..."
  // 2) imageIds: [ ... "<id>" ... ] ... title: "..."
  const re1 = new RegExp('(imageId:\s*\\"' + postImageId + '\\"[\\s\\S]*?title:\s*)\\"[^\\"]*\\"', 'g');
  const re2 = new RegExp('(imageIds:\\s*\\[[^\\]]*\\"' + postImageId + '\\"[^\\]]*\\][\\s\\S]*?title:\\s*)\\"[^\\"]*\\"', 'g');

  const before = dataSrc;
  dataSrc = dataSrc.replace(re1, (_, a) => a + '`' + safe + '`').replace(re2, (_, a) => a + '`' + safe + '`');

  if (dataSrc === before) {
    console.warn('İlgili gönderi bulunamadı (imageId/imageIds eşleşmedi). Güncelleme yapılmadı.');
    process.exit(8);
  }

  fs.writeFileSync(dataTsPath, dataSrc);
  console.log('Başlık güncellendi ->', firstLine);
}

main();


