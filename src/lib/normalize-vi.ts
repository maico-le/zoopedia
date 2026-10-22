/**
 * Normalizes Vietnamese text by removing diacritical marks (dấu tiếng Việt)
 * and converting to lowercase for fast client-side fuzzy searching.
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Checks if search text matches target text either with or without accents.
 */
export function matchVietnameseText(target: string, query: string): boolean {
  if (!target || !query) return false;
  const normalizedTarget = removeVietnameseAccents(target);
  const normalizedQuery = removeVietnameseAccents(query);
  return normalizedTarget.includes(normalizedQuery);
}
