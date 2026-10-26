export interface FilamentColor {
  id: string;
  label: string;
  brand: string;
  hex: string;
  textColor: string;
  material?: string;
  costPerKg?: number;
  inStock?: boolean;
  stockGrams?: number;
  supplierDeliveryDays?: number;
  supplierUrl?: string;
}

export const ORIGINAL_COLOR_OPTION = {
  id: 'original',
  label: 'Como en el modelo',
  brand: 'Referencia visual del modelo',
  swatch: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%)',
};

// Colores disponibles en catálogo con estado de taller físico
export const SUNLU_BAMBU_COLORS: FilamentColor[] = [
  // Neutros & Metálicos (PLA)
  { id: 'black', label: 'Negro Mate', brand: 'Bambu Black / Sunlu Black', hex: '#18181B', textColor: '#FFFFFF', material: 'PLA', costPerKg: 300, inStock: true, supplierDeliveryDays: 2 },
  { id: 'white', label: 'Blanco Puro', brand: 'Bambu Jade / Sunlu White', hex: '#FFFFFF', textColor: '#18181B', material: 'PLA', costPerKg: 300, inStock: true, supplierDeliveryDays: 2 },
  { id: 'gray', label: 'Gris Ceniza', brand: 'Bambu Gray / Sunlu Grey', hex: '#71717A', textColor: '#FFFFFF', material: 'PLA', costPerKg: 320, inStock: false, supplierDeliveryDays: 2 },
  { id: 'silver', label: 'Plata / Silver', brand: 'Sunlu Silk Silver', hex: '#9CA3AF', textColor: '#18181B', material: 'PLA', costPerKg: 360, inStock: false, supplierDeliveryDays: 3 },
  { id: 'gold', label: 'Oro Seda / Gold', brand: 'Sunlu Silk Gold', hex: '#D4AF37', textColor: '#18181B', material: 'PLA', costPerKg: 380, inStock: false, supplierDeliveryDays: 3 },
  { id: 'copper', label: 'Cobre / Bronze', brand: 'Sunlu Silk Copper', hex: '#B87333', textColor: '#FFFFFF', material: 'PLA', costPerKg: 380, inStock: false, supplierDeliveryDays: 3 },
  { id: 'beige', label: 'Beige / Hueso', brand: 'Bambu Desert / Sunlu Bone', hex: '#E4D5B7', textColor: '#18181B', material: 'PLA', costPerKg: 300, inStock: false, supplierDeliveryDays: 2 },
  { id: 'brown', label: 'Café / Marrón', brand: 'Bambu Brown / Sunlu Brown', hex: '#5C3A21', textColor: '#FFFFFF', material: 'PLA', costPerKg: 300, inStock: false, supplierDeliveryDays: 2 },
  
  // Colores Vivos (PLA)
  { id: 'red', label: 'Rojo Carmesí', brand: 'Bambu Red / Sunlu Red', hex: '#DC2626', textColor: '#FFFFFF', material: 'PLA', costPerKg: 320, inStock: false, supplierDeliveryDays: 2 },
  { id: 'orange', label: 'Naranja', brand: 'Bambu Orange / Sunlu Orange', hex: '#EA580C', textColor: '#FFFFFF', material: 'PLA', costPerKg: 320, inStock: false, supplierDeliveryDays: 2 },
  { id: 'yellow', label: 'Amarillo', brand: 'Bambu Yellow / Sunlu Yellow', hex: '#EAB308', textColor: '#18181B', material: 'PLA', costPerKg: 320, inStock: false, supplierDeliveryDays: 2 },
  { id: 'bambu_green', label: 'Verde Bambú', brand: 'Bambu Green / Sunlu Grass', hex: '#16A34A', textColor: '#FFFFFF', material: 'PLA', costPerKg: 320, inStock: false, supplierDeliveryDays: 2 },
  { id: 'forest_green', label: 'Verde Bosque', brand: 'Sunlu Dark Green', hex: '#14532D', textColor: '#FFFFFF', material: 'PLA', costPerKg: 320, inStock: false, supplierDeliveryDays: 2 },
  { id: 'cyan', label: 'Azul Cielo / Cian', brand: 'Bambu Cyan / Sunlu Cyan', hex: '#06B6D4', textColor: '#FFFFFF', material: 'PLA', costPerKg: 320, inStock: false, supplierDeliveryDays: 2 },
  { id: 'blue', label: 'Azul Rey', brand: 'Bambu Blue / Sunlu Royal', hex: '#2563EB', textColor: '#FFFFFF', material: 'PLA', costPerKg: 320, inStock: false, supplierDeliveryDays: 2 },
  { id: 'navy', label: 'Azul Marino', brand: 'Sunlu Dark Blue', hex: '#1E3A8A', textColor: '#FFFFFF', material: 'PLA', costPerKg: 320, inStock: false, supplierDeliveryDays: 2 },
  { id: 'purple', label: 'Púrpura / Morado', brand: 'Bambu Purple / Sunlu Purple', hex: '#7C3AED', textColor: '#FFFFFF', material: 'PLA', costPerKg: 340, inStock: false, supplierDeliveryDays: 2 },
  { id: 'pink', label: 'Rosa Sakura', brand: 'Bambu Magenta / Sunlu Pink', hex: '#F472B6', textColor: '#18181B', material: 'PLA', costPerKg: 320, inStock: false, supplierDeliveryDays: 2 },

  // Materiales de Ingeniería (PETG y ASA)
  { id: 'petg_black', label: 'PETG Negro Resistente', brand: 'Sunlu PETG', hex: '#111827', textColor: '#FFFFFF', material: 'PETG', costPerKg: 350, inStock: true, supplierDeliveryDays: 2 },
  { id: 'petg_white', label: 'PETG Blanco Puro', brand: 'Sunlu PETG', hex: '#F9FAFB', textColor: '#18181B', material: 'PETG', costPerKg: 350, inStock: false, supplierDeliveryDays: 2 },
  { id: 'asa_black', label: 'ASA Automotriz Negro', brand: 'Polymaker / Sunlu ASA', hex: '#09090B', textColor: '#FFFFFF', material: 'ASA', costPerKg: 490, inStock: false, supplierDeliveryDays: 3 },
  { id: 'asa_gray', label: 'ASA Automotriz Gris', brand: 'Polymaker ASA', hex: '#4B5563', textColor: '#FFFFFF', material: 'ASA', costPerKg: 490, inStock: false, supplierDeliveryDays: 3 },
];

/**
 * Matriz de Niveles de Exposición Térmica y Recomendación de Materiales
 */
export interface MaterialTierInfo {
  id: 'indoor' | 'outdoor' | 'auto' | 'engineering';
  name: string;
  recommendedMaterial: string;
  defaultMaterial: string;
  maxOperatingTemp: string;
  icon: string;
  badge: string;
  warningTitle: string;
  warningDesc: string;
  priceDeltaPercent: number; // Porcentaje adicional sobre el costo base (ej. ASA es ~30% más costoso que PLA)
}

export const MATERIAL_TIERS: Record<string, MaterialTierInfo> = {
  indoor: {
    id: 'indoor',
    name: 'Interior / Decoración',
    recommendedMaterial: 'PLA',
    defaultMaterial: 'PLA',
    maxOperatingTemp: '~50°C',
    icon: '🏠',
    badge: 'Uso en Interior',
    warningTitle: '',
    warningDesc: '',
    priceDeltaPercent: 0
  },
  outdoor: {
    id: 'outdoor',
    name: 'Exterior / Intemperie',
    recommendedMaterial: 'PETG',
    defaultMaterial: 'PETG',
    maxOperatingTemp: '~75°C',
    icon: '🌿',
    badge: 'Recomendado en PETG',
    warningTitle: 'Recomendación para Exterior y Humedad',
    warningDesc: 'Este producto puede estar expuesto al sol o lluvia continua. El PLA básico se degrada y pierde rigidez con los rayos UV. Sugerimos imprimirlo en PETG para máxima durabilidad.',
    priceDeltaPercent: 15
  },
  auto: {
    id: 'auto',
    name: 'Automotriz / Calor Extremo',
    recommendedMaterial: 'ASA',
    defaultMaterial: 'ASA',
    maxOperatingTemp: '~95°C',
    icon: '☀️',
    badge: 'Recomendado en ASA Automotriz',
    warningTitle: 'Atención: Calor Extremo en Automóvil',
    warningDesc: 'En temporada de calor, el interior de un automóvil cerrado bajo el sol supera fácilmente los 75°C en el tablero o parabrisas. El PLA y PETG se deformarían; recomendamos imprimirlo en ASA de grado automotriz de alta resistencia térmica.',
    priceDeltaPercent: 30
  },
  engineering: {
    id: 'engineering',
    name: 'Ingeniería / Fricción e Impacto',
    recommendedMaterial: 'PA-CF',
    defaultMaterial: 'PA-CF',
    maxOperatingTemp: '>110°C',
    icon: '⚙️',
    badge: 'Grado Técnico / Fibra de Carbono',
    warningTitle: 'Uso Mecánico Exigente',
    warningDesc: 'Diseñado para soportar tensión mecánica, torsión y fricción repetitiva con refuerzo de polímero de ingeniería.',
    priceDeltaPercent: 50
  }
};

/**
 * Detecta automáticamente el nivel del producto si no viene explicitado
 */
export function detectMaterialTier(title: string, category = '', tags: string[] = []): MaterialTierInfo {
  const text = `${title} ${category} ${tags.join(' ')}`.toLowerCase();

  // 1. Automotriz / Coche / Tablero / Parabrisas
  if (/(coche|auto|automotriz|carro|tablero|parabrisas|rejilla auto|retrovisor|dashcam|cupholder|porta celular auto|soporte auto)/i.test(text)) {
    return MATERIAL_TIERS.auto;
  }

  // 2. Jardín / Exterior / Baño / Regadera / Humedad
  if (/(jard[ií]n|maceta|planta exterior|regadera|ba[ñn]o|jab[oó]n|intemperie|outdoor|patio|terraza)/i.test(text)) {
    return MATERIAL_TIERS.outdoor;
  }

  // 3. Mecánico / Engranaje / Taller / Herramienta
  if (/(engranaje|motor|fricci[oó]n|polea|soporte taladro|herramienta taller|fuerza|mec[aá]nic)/i.test(text)) {
    return MATERIAL_TIERS.engineering;
  }

  // Default: Interior
  return MATERIAL_TIERS.indoor;
}

/**
 * Calcula el costo base más alto de un material para proteger el margen
 */
export function getMaxCostForMaterial(material = 'PLA', colors = SUNLU_BAMBU_COLORS): number {
  const target = material.toUpperCase();
  const matching = colors.filter(c => (c.material || 'PLA').toUpperCase() === target);
  if (!matching.length) return 300;
  return Math.max(...matching.map(c => c.costPerKg || 300));
}
