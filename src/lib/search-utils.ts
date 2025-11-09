// Türkçe karakterleri normalize et (û->u, â->a, î->i, ğ->g, ş->s, ç->c, ö->o, ü->u, ı->i, İ->i)
export function normalizeTurkish(text: string): string {
  return text
    .toLowerCase()
    .replace(/û/g, 'u')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/Ü/g, 'u')
    .replace(/Ö/g, 'o')
    .replace(/Ş/g, 's')
    .replace(/Ç/g, 'c')
    .replace(/Ğ/g, 'g')
    .replace(/Â/g, 'a')
    .replace(/Î/g, 'i')
    .replace(/Û/g, 'u');
}

// Arama fonksiyonu - normalize edilmiş ve orijinal metinlerde arama yapar
export function matchesSearch(text: string, query: string): boolean {
  const queryLower = query.toLowerCase();
  const normalizedQuery = normalizeTurkish(query);
  const normalizedText = normalizeTurkish(text);
  
  return (
    text.toLowerCase().includes(queryLower) ||
    normalizedText.includes(normalizedQuery)
  );
}


