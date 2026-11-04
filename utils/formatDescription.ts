/**
 * Limpia y resume descripciones de productos para vista comercial en tarjetas y modales.
 * - Elimina spam de descargas/boosts ('Boost Me Please', links externos, etc.).
 * - Elimina especificaciones de impresión técnica inapropiadas para comprador final.
 * - Limita la salida a máximo 1 o 2 párrafos concisos y bien redactados.
 */
export function cleanProductDescription(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string') return '';

  let text = raw
    // Quitar tags HTML si vinieron en el campo de texto
    .replace(/<[^>]+>/g, ' ')
    // Quitar spam común de plataformas como MakerWorld
    .replace(/boost\s*me\s*please[^.!?\n]*[.!?]?/gi, '')
    .replace(/boosts?\s*help\s*me[^.!?\n]*[.!?]?/gi, '')
    .replace(/hit\s*that\s*boost\s*button[^.!?\n]*[.!?]?/gi, '')
    .replace(/https?:\/\/\S+/gi, '')
    // Quitar artefactos de codificación o interrogaciones repetidas
    .replace(/\?{2,}/g, ' ')
    // Quitar bloques de ajustes técnicos de impresión
    .replace(/(?:suggested\s*print\s*settings|print\s*settings|layer\s*height|infill|gyroid|wall\s*count).*$/is, '')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

/**
 * Divide la descripción limpia en un array de máximo 2 párrafos comerciales.
 */
export function getProductParagraphs(raw: string | null | undefined, maxParagraphs: number = 2): string[] {
  const cleaned = cleanProductDescription(raw);
  if (!cleaned) return [];

  // Si el texto original tenía saltos de línea deliberados
  const rawBlocks = cleaned
    .split(/\r?\n+/)
    .map(b => b.trim())
    .filter(b => b.length > 20);

  if (rawBlocks.length >= 2) {
    return rawBlocks.slice(0, maxParagraphs);
  }

  // Si es un bloque continuo de texto, segmentar por oraciones
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  if (sentences.length === 0) return [cleaned];
  if (sentences.length <= 2) return [sentences.join(' ')];

  // Distribuir en 2 párrafos equilibrados
  const mid = Math.ceil(Math.min(sentences.length, 4) / 2);
  const p1 = sentences.slice(0, mid).join(' ');
  const p2 = sentences.slice(mid, Math.min(sentences.length, 4)).join(' ');

  return [p1, p2].filter(Boolean).slice(0, maxParagraphs);
}
