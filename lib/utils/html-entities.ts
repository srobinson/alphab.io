/**
 * Decode HTML entities from strings
 * Handles common entities like &#039; (apostrophe), &quot;, &amp;, etc.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return text;

  // Create a temporary element to decode HTML entities
  if (typeof window !== 'undefined') {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  // Server-side or fallback: decode common entities manually
  const entities: Record<string, string> = {
    '&#039;': "'",
    '&apos;': "'",
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '&#x27;': "'",
    '&#x2F;': '/',
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }

  // Handle numeric entities like &#39;, &#34;, etc.
  decoded = decoded.replace(/&#(\d+);/g, (_match, dec) => {
    return String.fromCharCode(dec);
  });

  // Handle hex entities like &#x27;
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (_match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}

/**
 * Decode HTML entities from an object's string properties
 */
export function decodeObjectProperties<T extends Record<string, unknown>>(
  obj: T,
  properties: (keyof T)[]
): T {
  const decoded = { ...obj };
  for (const prop of properties) {
    if (typeof decoded[prop] === 'string') {
      decoded[prop] = decodeHtmlEntities(decoded[prop] as string) as T[keyof T];
    }
  }
  return decoded;
}
