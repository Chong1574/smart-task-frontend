export interface FilamentColor {
  id: string;
  label: string;
  brand: string;
  hex: string;
  textColor: string;
}

export const ORIGINAL_COLOR_OPTION = {
  id: 'original',
  label: 'Como en el modelo',
  brand: 'Referencia visual del modelo',
  swatch: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%)',
};

export const SUNLU_BAMBU_COLORS: FilamentColor[] = [
  // Neutros & Metálicos
  { id: 'white', label: 'Blanco Puro', brand: 'Bambu Jade / Sunlu White', hex: '#FFFFFF', textColor: '#18181B' },
  { id: 'black', label: 'Negro Mate', brand: 'Bambu Black / Sunlu Black', hex: '#18181B', textColor: '#FFFFFF' },
  { id: 'gray', label: 'Gris Ceniza', brand: 'Bambu Gray / Sunlu Grey', hex: '#71717A', textColor: '#FFFFFF' },
  { id: 'silver', label: 'Plata / Silver', brand: 'Sunlu Silk Silver', hex: '#9CA3AF', textColor: '#18181B' },
  { id: 'gold', label: 'Oro Seda / Gold', brand: 'Sunlu Silk Gold', hex: '#D4AF37', textColor: '#18181B' },
  { id: 'copper', label: 'Cobre / Bronze', brand: 'Sunlu Silk Copper', hex: '#B87333', textColor: '#FFFFFF' },
  { id: 'beige', label: 'Beige / Hueso', brand: 'Bambu Desert / Sunlu Bone', hex: '#E4D5B7', textColor: '#18181B' },
  { id: 'brown', label: 'Café / Marrón', brand: 'Bambu Brown / Sunlu Brown', hex: '#5C3A21', textColor: '#FFFFFF' },
  // Colores Vivos
  { id: 'red', label: 'Rojo Carmesí', brand: 'Bambu Red / Sunlu Red', hex: '#DC2626', textColor: '#FFFFFF' },
  { id: 'orange', label: 'Naranja', brand: 'Bambu Orange / Sunlu Orange', hex: '#EA580C', textColor: '#FFFFFF' },
  { id: 'yellow', label: 'Amarillo', brand: 'Bambu Yellow / Sunlu Yellow', hex: '#EAB308', textColor: '#18181B' },
  { id: 'bambu_green', label: 'Verde Bambú', brand: 'Bambu Green / Sunlu Grass', hex: '#16A34A', textColor: '#FFFFFF' },
  { id: 'forest_green', label: 'Verde Bosque', brand: 'Sunlu Dark Green', hex: '#14532D', textColor: '#FFFFFF' },
  { id: 'cyan', label: 'Azul Cielo / Cian', brand: 'Bambu Cyan / Sunlu Cyan', hex: '#06B6D4', textColor: '#FFFFFF' },
  { id: 'blue', label: 'Azul Rey', brand: 'Bambu Blue / Sunlu Royal', hex: '#2563EB', textColor: '#FFFFFF' },
  { id: 'navy', label: 'Azul Marino', brand: 'Sunlu Dark Blue', hex: '#1E3A8A', textColor: '#FFFFFF' },
  { id: 'purple', label: 'Púrpura / Morado', brand: 'Bambu Purple / Sunlu Purple', hex: '#7C3AED', textColor: '#FFFFFF' },
  { id: 'pink', label: 'Rosa Sakura', brand: 'Bambu Magenta / Sunlu Pink', hex: '#F472B6', textColor: '#18181B' },
];
