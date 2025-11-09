'use server';
/**
 * @fileOverview SEO anahtar kelime araştırması ve üretimi için AI agent
 * 
 * - generateSEOKeywords - Anahtar kelimeleri otomatik üretir
 * - GenerateSEOKeywordsInput - Input tipi
 * - GenerateSEOKeywordsOutput - Output tipi
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSEOKeywordsInputSchema = z.object({
  title: z.string().describe('Gönderi başlığı'),
  content: z.string().describe('Gönderi içeriği (meal, açıklama vb.)'),
  category: z.string().describe('Gönderi kategorisi'),
});

export type GenerateSEOKeywordsInput = z.infer<typeof GenerateSEOKeywordsInputSchema>;

const GenerateSEOKeywordsOutputSchema = z.object({
  metaTitle: z.string().describe('SEO optimizasyonlu başlık (55-60 karakter, başlıkla ilgili ama SEO odaklı)'),
  metaDescription: z.string().describe('SEO açıklaması (150-160 karakter, içeriği özetleyen ve arama motorları için optimize edilmiş)'),
  keywords: z.array(z.string()).describe('Anahtar kelimeler listesi (10-15 adet, Türkçe ve İngilizce karışık, yüksek arama hacmine sahip)'),
  suggestions: z.array(z.string()).describe('İlgili arama önerileri'),
});

export type GenerateSEOKeywordsOutput = z.infer<typeof GenerateSEOKeywordsOutputSchema>;

export async function generateSEOKeywords(input: GenerateSEOKeywordsInput): Promise<GenerateSEOKeywordsOutput> {
  return generateSEOKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSEOKeywordsPrompt',
  input: {schema: GenerateSEOKeywordsInputSchema},
  output: {schema: GenerateSEOKeywordsOutputSchema},
  prompt: `Sen bir SEO (Arama Motoru Optimizasyonu) uzmanısın. Türkçe İslami içerikler için SEO optimizasyonu yapıyorsun.

Görev:
1. Verilen içeriğe göre SEO optimizasyonlu bir başlık oluştur (metaTitle)
   - 55-60 karakter arası olmalı
   - Anahtar kelimeyi içermeli
   - Okuyucuyu cezbedecek ama arama motorları için optimize edilmiş olmalı
   
2. SEO açıklaması (metaDescription) oluştur
   - 150-160 karakter arası olmalı
   - İçeriği özetlemeli
   - Anahtar kelimeleri doğal şekilde içermeli
   - CTA (Call to Action) içerebilir
   
3. Anahtar kelimeler (keywords) listesi oluştur
   - 10-15 adet anahtar kelime
   - Türkçe ve İngilizce karışık olabilir
   - Yüksek arama hacmine sahip kelimeler
   - Kategori ile ilgili genel kelimeler
   - Spesifik içerik kelimeleri
   
4. İlgili arama önerileri (suggestions)
   - Kullanıcıların arayabileceği sorular veya ifadeler
   - 5-7 adet öneri

İçerik Bilgileri:
Başlık: {{{title}}}
Kategori: {{{category}}}
İçerik: {{{content}}}

Önemli:
- Türkçe dilbilgisi kurallarına uygun olmalı
- İslami terimler doğru kullanılmalı
- Arama motorları için optimize edilmiş ama doğal görünmeli
- Anahtar kelime doldurma (keyword stuffing) yapmamalı`,
});

// Fallback SEO generation when AI is unavailable
function generateFallbackSEO(title: string, content: string, category: string): GenerateSEOKeywordsOutput {
  const titleWords = title.split(/\s+/).filter(w => w.length > 2);
  const contentWords = content.split(/\s+/).filter(w => w.length > 3);
  
  // Generate meta title (55-60 chars)
  let metaTitle = title;
  if (metaTitle.length > 60) {
    metaTitle = title.substring(0, 57) + '...';
  } else if (metaTitle.length < 40) {
    metaTitle = `${title} | Cuma Mesajları`;
    if (metaTitle.length > 60) {
      metaTitle = title.substring(0, 40) + ' | Cuma Mesajları';
    }
  }
  
  // Generate meta description (150-160 chars)
  const contentPreview = content.substring(0, 120).replace(/\n/g, ' ').trim();
  let metaDescription = `${contentPreview}... Daha fazla bilgi için sayfamızı ziyaret edin.`;
  if (metaDescription.length > 160) {
    metaDescription = contentPreview.substring(0, 130) + '...';
  }
  
  // Generate keywords from title and content
  const keywords = new Set<string>();
  titleWords.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-zçğıöşü]/g, '');
    if (clean.length > 3) keywords.add(clean);
  });
  contentWords.slice(0, 10).forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-zçğıöşü]/g, '');
    if (clean.length > 4) keywords.add(clean);
  });
  keywords.add(category.toLowerCase());
  keywords.add('cuma mesajları');
  keywords.add('islami içerik');
  
  // Generate suggestions
  const suggestions = [
    `${title} nedir?`,
    `${category} hakkında bilgi`,
    `${title} açıklaması`,
    'Cuma mesajları',
    'İslami içerikler'
  ];
  
  return {
    metaTitle,
    metaDescription,
    keywords: Array.from(keywords).slice(0, 15),
    suggestions: suggestions.slice(0, 7),
  };
}

const generateSEOKeywordsFlow = ai.defineFlow(
  {
    name: 'generateSEOKeywordsFlow',
    inputSchema: GenerateSEOKeywordsInputSchema,
    outputSchema: GenerateSEOKeywordsOutputSchema,
  },
  async input => {
    // Retry mekanizması ile 3 deneme
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // 503 hatası veya rate limit hatası için bekle
        if (error instanceof Error && (
          error.message.includes('503') || 
          error.message.includes('overloaded') ||
          error.message.includes('rate limit') ||
          error.message.includes('Service Unavailable')
        )) {
          if (attempt < 3) {
            // Exponential backoff: 1s, 2s, 4s
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
            continue;
          }
        }
        
        // Diğer hatalar için tekrar dene
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
      }
    }
    
    // Tüm denemeler başarısız olduysa fallback kullan
    console.warn('AI SEO generation failed, using fallback:', lastError?.message);
    return generateFallbackSEO(input.title, input.content, input.category);
  }
);


