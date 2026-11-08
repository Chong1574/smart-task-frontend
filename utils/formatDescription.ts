/**
 * Limpia y resume descripciones de productos para vista comercial en tarjetas y modales.
 * - Elimina spam de descargas/boosts ('Boost Me Please', links externos, etc.).
 * - Elimina especificaciones de impresión técnica inapropiadas para comprador final.
 * - Limita la salida a párrafos concisos y bien redactados (máx 165 chars en vista compacta).
 */
export function cleanProductDescription(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string') return '';

  let text = raw
    // Quitar tags HTML si vinieron en el campo de texto
    .replace(/<[^>]+>/g, ' ')
    // Quitar mensajes de debug si algún webhook falló antes
    .replace(/DEBUG\s*GEMINI[^.!?
]*/gi, '')
    // Quitar spam común de plataformas como MakerWorld
    .replace(/boost\s*me\s*please[^.!?
]*[.!?]?/gi, '')
    .replace(/boosts?\s*help\s*me[^.!?
]*[.!?]?/gi, '')
    .replace(/hit\s*that\s*boost\s*button[^.!?
]*[.!?]?/gi, '')
    .replace(/free\s*commercial\s*use[^.!?
]*[.!?]?/gi, '')
    .replace(/this\s*does\s*not\s*give\s*you\s*permission[^.!?
]*[.!?]?/gi, '')
    .replace(/https?:\/\/\S+/gi, '')
    // Quitar artefactos de codificación o interrogaciones repetidas
    .replace(/\?{2,}/g, ' ')
    // Quitar bloques de ajustes técnicos de impresión
    .replace(/(?:suggested\s*print\s*settings|print\s*settings|layer\s*height|infill|gyroid|wall\s*count|used\s*filament).*$/is, '')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

/**
 * Divide la descripción limpia en un array de párrafos comerciales concisos.
 */
export function getProductParagraphs(raw: string | null | undefined, maxParagraphs: number = 2): string[] {
  const cleaned = cleanProductDescription(raw);
  if (!cleaned) return [];

  // Si el texto es corto (<= 165 caracteres), devolver como un único párrafo compacto
  if (cleaned.length <= 165) {
    return [cleaned];
  }

  // Segmentar por oraciones o emojis separadores
  const sentences = cleaned
    .split(/(?<=[.!?])\s+|(?=\s*[🎄🎅✨🙏🩷☕•▪▸])/)
    .map(s => s.trim())
    .filter(s => s.length > 8);

  if (sentences.length <= 1) {
    const cut = cleaned.slice(0, 160).replace(/\s+\S*$/, '') + '…';
    const rest = cleaned.slice(cut.length - 1).trim();
    return rest ? [cut, rest] : [cut];
  }

  // Primer párrafo siempre <= 165 chars para vista compacta del modal
  let p1 = sentences[0];
  let idx = 1;
  while (idx < sentences.length && (p1 + ' ' + sentences[idx]).length <= 165) {
    p1 += ' ' + sentences[idx];
    idx++;
  }
  if (p1.length > 170) {
    p1 = p1.slice(0, 162).replace(/\s+\S*$/, '') + '…';
  }

  const remaining = sentences.slice(idx).join(' ').trim();
  if (!remaining) return [p1];

  const p2 = remaining.length > 260
    ? remaining.slice(0, 255).replace(/\s+\S*$/, '') + '…'
    : remaining;

  return [p1, p2].filter(Boolean).slice(0, maxParagraphs);
}
