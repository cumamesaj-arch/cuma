#!/usr/bin/env node
/*
  Basit içe aktarma aracı:
  - Facebook veya Instagram JSON ihracından metin tabanlı post oluşturur
  - Görsel/Youtube eşlemesi yapmaz; içerik metnini `content.meal` olarak yazar

  Kullanım örnekleri:
    node scripts/import-posts.js --source facebook --path "C:/exports/profile_posts_1.json" --category cuma-mesajlari
    node scripts/import-posts.js --source instagram --path "C:/exports/posts_1.json" --category diger

  Not: Proje, postları `src/lib/data.ts` içindeki POSTS dizisinde dosya-üstünden saklıyor.
*/

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--source') out.source = args[++i];
    else if (a === '--path') out.inputPath = args[++i];
    else if (a === '--category') out.category = args[++i];
    else if (a === '--limit') out.limit = Number(args[++i]);
    else if (a === '--status') out.status = args[++i]; // published|draft
    else if (a === '--useMedia') out.useMedia = args[++i]; // true|false
  }
  if (!out.source || !out.inputPath || !out.category) {
    console.error('Kullanım: --source <facebook|instagram> --path <file.json> --category <slug> [--limit N] [--status published|draft]');
    process.exit(1);
  }
  return out;
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function toIsoFromEpochSeconds(sec) {
  if (!sec) return new Date().toISOString();
  try { return new Date(sec * 1000).toISOString(); } catch { return new Date().toISOString(); }
}

// UTF-8 karakter kodlaması sorunlarını düzelt
// Facebook JSON'larında UTF-8 bytes'ları Unicode escape olarak saklanmış
// Örnek: \u00c4\u009f -> 0xC4 0x9F (UTF-8 bytes) -> "ğ"
function fixEncoding(str) {
  if (typeof str !== 'string') return str;
  try {
    // Windows-1254 veya Latin1 olarak yanlış decode edilmiş UTF-8 karakterleri düzelt
    // JSON.parse \u00c4\u009f'yi "Ä" olarak decode eder, ama bu aslında UTF-8 bytes çifti (ğ)
    
    let decoded = str;
    
    // Türkçe karakterler için UTF-8 byte çiftleri -> karakter eşlemesi
    // Bu eşleme, yanlış decode edilmiş UTF-8 bytes'larını düzeltir
    const utf8Fixes = {
      // ç (0xC3 0xA7) -> Ã§ -> ç
      'Ã§': 'ç', 'Ã‡': 'Ç',
      // ğ (0xC4 0x9F) -> ÄŸ -> ğ (ama genelde tek karakter olarak görünür: Ä)
      'Ä': 'ğ', 'ä': 'Ğ',
      'ÄŸ': 'ğ', 'Äž': 'Ğ',
      // ı (0xC4 0xB1) -> Ä± -> ı
      'Ä±': 'ı', 'Ä°': 'İ',
      // ö (0xC3 0xB6) -> Ã¶ -> ö
      'Ã¶': 'ö', 'Ã–': 'Ö',
      // ş (0xC5 0x9F) -> ÅŸ -> ş
      'Å': 'ş', 'å': 'Ş',
      'ÅŸ': 'ş', 'Åž': 'Ş',
      // ü (0xC3 0xBC) -> Ã¼ -> ü
      'Ã¼': 'ü', 'Ãœ': 'Ü',
      // ı (0xC4 0xB1) ama tek karakter olarak: Ã
      'Ã': 'ı', 'ã': 'İ',
      'Â': 'ı', 'â': 'İ',
    };
    
    // Önce çift karakterli sorunları düzelt (öncelikli)
    for (const [wrong, correct] of Object.entries(utf8Fixes)) {
      if (wrong.length > 1) {
        const regex = new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        decoded = decoded.replace(regex, correct);
      }
    }
    
    // Sonra tek karakterli sorunları düzelt (dikkatli: çift karakter eşleşmelerinden sonra)
    for (const [wrong, correct] of Object.entries(utf8Fixes)) {
      if (wrong.length === 1) {
        const regex = new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        decoded = decoded.replace(regex, correct);
      }
    }
    
    return decoded;
  } catch {
    return str;
  }
}

// YouTube URL'sinden video ID çıkar
function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

// Facebook JSON (profile_posts_*.json) için olası alanlar: title, data[].post, timestamp
function mapFacebookItem(item, category, baseDir) {
  const timestamp = item.timestamp || (item.creation_timestamp ?? undefined);
  // 1) edits_you_made_to_posts.json formatı: label_values[].label === 'Metin' -> value
  let text = '';
  if (Array.isArray(item.label_values)) {
    const lv = item.label_values.find(l => typeof l.label === 'string' && /metin|text/i.test(l.label));
    if (lv && typeof lv.value === 'string' && lv.value.trim()) {
      text = fixEncoding(lv.value.trim());
    }
  }
  // 2) profile_posts_*.json: data[].post veya title/description/story
  if (!text && Array.isArray(item.data)) {
    for (const d of item.data) {
      if (d && typeof d.post === 'string' && d.post.trim()) { 
        text = fixEncoding(d.post.trim()); 
        break; 
      }
    }
  }
  if (!text && typeof item.title === 'string') text = fixEncoding(item.title);
  if (!text && typeof item.description === 'string') text = fixEncoding(item.description);
  if (!text && typeof item.story === 'string') text = fixEncoding(item.story);

  // 3) Dış bağlantı: attachments[].data[].external_context.{name,url}
  let extName = '';
  let extUrl = '';
  let youtubeId = null;
  if (Array.isArray(item.attachments)) {
    for (const att of item.attachments) {
      if (att && Array.isArray(att.data)) {
        for (const d of att.data) {
          const ec = d && d.external_context;
          if (ec) {
            if (!extName && typeof ec.name === 'string') extName = fixEncoding(ec.name);
            if (!extUrl && typeof ec.url === 'string') {
              extUrl = ec.url;
              // YouTube URL kontrolü
              const ytId = extractYouTubeId(ec.url);
              if (ytId) youtubeId = ytId;
            }
          }
          // Medya dosyası kontrolü (basit)
          if (d && typeof d.media === 'object' && d.media.uri) {
            // Medya dosyası var ama şimdilik görsel ID eşlemesi yapmıyoruz
          }
        }
      }
    }
  }
  if (!text && extName) text = extName;
  if (extUrl && !youtubeId) {
    text = text ? `${text}\n${extUrl}` : extUrl;
  }

  if (!text) text = 'Facebook gönderisi';

  // Başlık için ilk satırı al ve encoding düzelt
  let title = (text.split('\n')[0] || '').trim().slice(0, 60) || 'Facebook gönderisi';
  title = fixEncoding(title);

  // Benzersiz slug üret
  const baseSlug = slugify(title);
  const uniqueSuffix = timestamp ? String(timestamp) : String(Date.now());
  const uniqueSlug = `${baseSlug}-${uniqueSuffix}`;

  // Varsayılan placeholder görsel havuzu (placeholder-images.json'da mevcut id'ler)
  const placeholderIds = ['6','5','4','3','2','1','new-1762033736211','new-1762076786861'];
  const randomImageId = placeholderIds[Math.floor(Math.random() * placeholderIds.length)];

  const post = {
    id: `post-${Date.now()}-${Math.floor(Math.random()*1e6)}`,
    title,
    slug: uniqueSlug,
    category,
    content: {
      meal: String(text),
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: toIsoFromEpochSeconds(timestamp),
  };

  // YouTube video ID varsa ekle
  if (youtubeId) {
    post.youtubeVideoId = youtubeId;
  }

  // Aday medya URI'leri (görseller) topla
  const mediaUris = [];
  if (Array.isArray(item.attachments)) {
    for (const att of item.attachments) {
      if (att && Array.isArray(att.data)) {
        for (const d of att.data) {
          const media = d && d.media;
          if (media && typeof media.uri === 'string') {
            const uri = media.uri;
            if (/\.(jpg|jpeg|png|webp)$/i.test(uri)) mediaUris.push(uri);
          }
        }
      }
    }
  }

  // Eğer medya bulunamazsa placeholder kullanmak üzere işaret bırak
  if (mediaUris.length === 0) {
    post._fallbackImageId = randomImageId;
  }

  return { post, mediaUris };
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function resolveExportMediaAbsolutePath(jsonAbsPath, uriFromJson) {
  const exportBase = path.resolve(path.dirname(jsonAbsPath), '..'); // .../this_profile's_activity_across_facebook
  const trimmed = uriFromJson.replace(/^this_profile's_activity_across_facebook[\\/]/, '');
  return path.join(exportBase, trimmed);
}

function loadPlaceholderImages() {
  const p = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');
  const raw = fs.readFileSync(p, 'utf-8');
  const json = JSON.parse(raw);
  return { path: p, json };
}

function savePlaceholderImages(pObj) {
  fs.writeFileSync(pObj.path, JSON.stringify(pObj.json, null, 2), 'utf-8');
}

function addImageToPlaceholdersIfNeeded(pObj, publicRelUrl) {
  const arr = pObj.json.placeholderImages || [];
  const existing = arr.find(x => x.imageUrl === publicRelUrl);
  if (existing) return existing.id;
  const id = `import-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
  arr.push({ id, description: 'Imported from Facebook', imageUrl: publicRelUrl, imageHint: 'auto' });
  pObj.json.placeholderImages = arr;
  return id;
}

// Instagram JSON (posts_*.json / media.json benzeri) için basit eşleme: caption -> text, taken_at -> timestamp
function mapInstagramItem(item, category) {
  const caption = item.caption || item.title || item.description || '';
  const takenAtSec = item.taken_at || item.creation_timestamp || item.timestamp;
  const text = fixEncoding(String(caption || 'Instagram gönderisi'));
  const title = (text.split('\n')[0] || '').trim().slice(0, 60) || 'Instagram gönderisi';
  const post = {
    id: `post-${Date.now()}-${Math.floor(Math.random()*1e6)}`,
    title: fixEncoding(title),
    slug: slugify(title),
    category,
    content: {
      meal: text,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: toIsoFromEpochSeconds(takenAtSec),
  };
  return post;
}

function readJsonArray(filePath) {
  // UTF-8 BOM veya farklı encoding sorunlarını önlemek için
  let raw = fs.readFileSync(filePath, 'utf-8');
  // BOM'u kaldır
  if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1);
  }
  
  // JSON'daki UTF-8 bytes çiftlerini düzelt (örn: \u00c4\u009f -> ğ)
  // Bu escape'leri yakalayıp UTF-8 bytes olarak decode et
  raw = raw.replace(/\\u00([c-fC-F][0-9a-fA-F])\\u00([0-9a-fA-F]{2})/g, (match, byte1, byte2) => {
    try {
      const b1 = parseInt(byte1, 16);
      const b2 = parseInt(byte2, 16);
      // UTF-8 bytes çifti olarak decode et
      const buffer = Buffer.from([b1, b2]);
      return buffer.toString('utf-8');
    } catch {
      return match;
    }
  });
  
  const data = JSON.parse(raw);
  if (Array.isArray(data)) return data;
  // Bazı ihracatlar kök objede array alanı içerir; en büyük array'i yakala
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key])) return data[key];
  }
  throw new Error('Beklenen JSON dizi bulunamadı');
}

function escapeForSingleQuote(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

function escapeForTemplateLiteral(str) {
  return String(str)
    .replace(/`/g, '\\`')
    .replace(/\\/g, '\\\\');
}

function buildPostBlock(p) {
  const title = escapeForSingleQuote(p.title);
  const slug = escapeForSingleQuote(p.slug);
  const id = escapeForSingleQuote(p.id);
  const category = escapeForSingleQuote(p.category);
  const createdAt = escapeForSingleQuote(p.createdAt);
  const meal = escapeForTemplateLiteral(p.content.meal || '');
  const mealleri = escapeForSingleQuote(p.content.mealleri || '');
  const tefsir = escapeForSingleQuote(p.content.tefsir || '');
  const kisaTefsir = escapeForSingleQuote(p.content.kisaTefsir || '');
  const statusLine = p.status ? `,\n    status: '${escapeForSingleQuote(p.status)}'` : '';
  const youtubeLine = p.youtubeVideoId ? `,\n    youtubeVideoId: '${escapeForSingleQuote(p.youtubeVideoId)}'` : '';
  const imageLine = p.imageId ? `\n    imageId: '${escapeForSingleQuote(p.imageId)}',` : '';
  const imageIdsLine = Array.isArray(p.imageIds) && p.imageIds.length > 0
    ? `\n    imageIds: [${p.imageIds.map(x => `'${escapeForSingleQuote(x)}'`).join(', ')}],`
    : '';
  return `
  {
    id: '${id}',
    title: '${title}',
    slug: '${slug}',
    category: '${category}',${imageLine}${imageIdsLine}
    content: {
      meal: \`${meal}\`,
      mealleri: '${mealleri}',
      tefsir: '${tefsir}',
      kisaTefsir: '${kisaTefsir}',
    },
    createdAt: '${createdAt}'${statusLine}${youtubeLine}
  },`;
}

function insertPostsIntoDataTs(newPostsBlocks) {
  const dataTsPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
  const fileContent = fs.readFileSync(dataTsPath, 'utf-8');
  const postsRegex = /export const POSTS: Post\[] = \[/;
  if (!postsRegex.test(fileContent)) {
    throw new Error('data.ts içinde POSTS dizisi bulunamadı');
  }
  const insertion = `export const POSTS: Post[] = [${newPostsBlocks.join('\n')}`;
  const newContent = fileContent.replace(postsRegex, insertion);
  fs.writeFileSync(dataTsPath, newContent, 'utf-8');
}

async function main() {
  const { source, inputPath, category, limit, status, useMedia } = parseArgs();
  const abs = path.isAbsolute(inputPath) ? inputPath : path.join(process.cwd(), inputPath);
  const items = readJsonArray(abs);

  const mapper = source === 'facebook' ? mapFacebookItem
                : source === 'instagram' ? mapInstagramItem
                : null;
  if (!mapper) {
    console.error('Desteklenmeyen kaynak:', source);
    process.exit(2);
  }

  const selected = typeof limit === 'number' && limit > 0 ? items.slice(0, limit) : items;
  const baseDir = path.dirname(abs);

  const mapped = selected.map(it => source === 'facebook' ? mapper(it, category, baseDir) : { post: mapper(it, category), mediaUris: [] });

  // Medyaları kopyala ve placeholder'a ekle
  const shouldUseMedia = String(useMedia ?? 'true') !== 'false';
  const publicDir = path.join(process.cwd(), 'public');
  const importedDir = path.join(publicDir, 'imported');
  ensureDirSync(importedDir);
  const placeholderObj = loadPlaceholderImages();

  for (const m of mapped) {
    const mediaIds = [];
    if (shouldUseMedia) {
      for (const uri of m.mediaUris || []) {
        try {
          const absMedia = resolveExportMediaAbsolutePath(abs, uri);
          if (!fs.existsSync(absMedia)) continue;
          const ext = path.extname(absMedia) || '.jpg';
          const fileName = `fb_${Date.now()}_${Math.floor(Math.random()*1e6)}${ext}`;
          const destAbs = path.join(importedDir, fileName);
          fs.copyFileSync(absMedia, destAbs);
          const publicRel = `/imported/${fileName}`;
          const id = addImageToPlaceholdersIfNeeded(placeholderObj, publicRel);
          mediaIds.push(id);
        } catch {}
      }
    }
    if (mediaIds.length > 0) {
      if (mediaIds.length === 1) m.post.imageId = mediaIds[0];
      m.post.imageIds = mediaIds;
    } else if (m.post._fallbackImageId) {
      m.post.imageId = m.post._fallbackImageId;
    }
    delete m.post._fallbackImageId;
  }

  savePlaceholderImages(placeholderObj);

  const posts = mapped.map(m => {
    const p = m.post;
    if (status === 'published' || status === 'draft') p.status = status;
    return p;
  });

  if (!posts.length) {
    console.log('Eklenecek post bulunamadı.');
    return;
  }

  const blocks = posts.map(buildPostBlock);
  insertPostsIntoDataTs(blocks);
  console.log(`Başarılı: ${posts.length} gönderi eklendi.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


