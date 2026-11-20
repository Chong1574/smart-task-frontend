export type WardrobeStatus =
  | 'guardada'
  | 'puesta'
  | 'sucia'
  | 'lavandose'
  | 'secandose'
  | 'limpia_sin_guardar';

export type WardrobeCategory =
  | 'top'
  | 'bottom'
  | 'shoes'
  | 'jacket'
  | 'accessory'
  | 'underwear'
  | 'pajama';

export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  color: string;
  visual_features: string;
  formality: 'home' | 'casual' | 'smart-casual' | 'formal' | 'sport';
  season: 'all' | 'hot' | 'cold';
  status: WardrobeStatus;
  wears_since_wash: number;
  max_wears_before_wash: number;
  total_wears: number;
  batch_id: string | null;
  photoFile: string | null;
  referencePhotoFile: string | null;
  nickname: string | null;
  brand_style: string | null;
  fit_or_cut: string | null;
  distinguishing_details: string | null;
  last_worn_at: string | null;
  status_updated_at: string;
  created_at: string;
  notes: string | null;
}

export interface WardrobeOutfit {
  id: string;
  combo_key: string;
  occasion: string;
  weather: string;
  title: string;
  stylist_notes: string;
  garment_ids: string[];
  realPhotoFile: string | null;
  aiPreviewFile: string | null;
  lookbookFile: string | null;
  source: 'stylist' | 'pi_capture' | 'manual';
  created_at: string;
  updated_at: string;
}

export interface WardrobeBatch {
  id: string;
  label: string;
  status: 'lavandose' | 'secandose' | 'limpia_sin_guardar' | 'guardada';
  dry_method: string | null;
  started_at: string;
  status_updated_at: string;
  estimated_ready_at: string | null;
  itemCount: number;
}

export interface WardrobeSummary {
  total: number;
  counts: Record<WardrobeStatus, number>;
  cleanTops: number;
  activeBatches: WardrobeBatch[];
}

export interface WardrobeSettings {
  appearance_profile: string | null;
  baseBodyPhotoFile: string | null;
}

export const STATUS_LABELS: Record<WardrobeStatus, string> = {
  guardada: 'Guardada',
  puesta: 'Puesta',
  sucia: 'Sucia',
  lavandose: 'Lavándose',
  secandose: 'Secándose',
  limpia_sin_guardar: 'Sin guardar',
};

export const CATEGORY_LABELS: Record<WardrobeCategory, string> = {
  top: 'Playeras / Camisas',
  bottom: 'Jeans / Pantalones',
  shoes: 'Tenis / Calzado',
  jacket: 'Chamarras / Capas',
  pajama: 'Pijama / Casa',
  accessory: 'Accesorios',
  underwear: 'Ropa interior',
};
