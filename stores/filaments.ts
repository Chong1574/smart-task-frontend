import { defineStore } from 'pinia';
import api from '../utils/api';
import { SUNLU_BAMBU_COLORS, type FilamentColor, getMaxCostForMaterial } from '../data/filament-colors';
import { toast } from 'vue-sonner';

export interface MaterialPricing {
  material: string;
  maxCostPerKg: number;
  avgCostPerKg: number;
  inStockCount: number;
  totalCount: number;
  maxCostColorName: string;
  defaultSupplierDays: number;
}

export const useFilamentsStore = defineStore('filaments', {
  state: () => ({
    filaments: [...SUNLU_BAMBU_COLORS] as FilamentColor[],
    pricing: {} as Record<string, MaterialPricing>,
    loading: false,
    error: null as string | null,
    useLocalFallback: false
  }),

  getters: {
    inStockColors: (state) => state.filaments.filter(f => f.inStock),
    
    getMaxCostByMaterial: (state) => (material: string) => {
      const mat = (material || 'PLA').toUpperCase();
      if (state.pricing[mat]?.maxCostPerKg) {
        return state.pricing[mat].maxCostPerKg;
      }
      return getMaxCostForMaterial(mat, state.filaments);
    },

    getColorStatus: (state) => (colorIdOrLabel: string) => {
      if (!colorIdOrLabel || colorIdOrLabel === 'original') {
        return { inStock: true, deliveryDays: 0, label: 'En taller (Inmediato)' };
      }
      const clean = colorIdOrLabel.toLowerCase().trim();
      const found = state.filaments.find(f => 
        f.id.toLowerCase() === clean || 
        f.label.toLowerCase() === clean ||
        clean.includes(f.label.toLowerCase())
      );
      if (found) {
        return {
          inStock: Boolean(found.inStock),
          deliveryDays: found.inStock ? 0 : (found.supplierDeliveryDays || 2),
          label: found.inStock ? 'En taller' : `Sobre pedido (+${found.supplierDeliveryDays || 2} días)`,
          costPerKg: found.costPerKg || 300
        };
      }
      return { inStock: false, deliveryDays: 2, label: 'Sobre pedido (+2 días)', costPerKg: 320 };
    }
  },

  actions: {
    async fetchFilaments() {
      this.loading = true;
      try {
        const [resFilaments, resPricing] = await Promise.allSettled([
          api.get('/filaments'),
          api.get('/filaments/pricing')
        ]);

        if (resFilaments.status === 'fulfilled' && Array.isArray(resFilaments.value.data)) {
          this.filaments = resFilaments.value.data.map((item: any) => ({
            id: item.colorId || String(item.id),
            label: item.colorName,
            brand: item.brand,
            hex: item.hex,
            textColor: item.textColor || (item.hex === '#FFFFFF' ? '#18181B' : '#FFFFFF'),
            material: item.material,
            costPerKg: item.costPerKg,
            inStock: Boolean(item.inStock),
            stockGrams: item.stockGrams,
            supplierDeliveryDays: item.supplierDeliveryDays,
            supplierUrl: item.supplierUrl
          }));
          this.useLocalFallback = false;
        } else {
          this.useLocalFallback = true;
        }

        if (resPricing.status === 'fulfilled' && resPricing.value.data) {
          this.pricing = resPricing.value.data;
        }
      } catch (err: any) {
        this.useLocalFallback = true;
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async updateFilament(id: number | string, data: Partial<FilamentColor>) {
      try {
        await api.put(`/filaments/${id}`, data);
        toast.success('Filamento actualizado');
        await this.fetchFilaments();
      } catch (err: any) {
        // Fallback local
        const idx = this.filaments.findIndex(f => f.id === id);
        if (idx !== -1) {
          this.filaments[idx] = { ...this.filaments[idx], ...data };
          toast.success('Filamento actualizado (local)');
        }
      }
    },

    async bulkSave(list: FilamentColor[]) {
      try {
        await api.post('/filaments/bulk', { filaments: list });
        toast.success('Inventario guardado con éxito');
        await this.fetchFilaments();
      } catch (err: any) {
        this.filaments = [...list];
        toast.success('Cambios aplicados localmente');
      }
    },

    async createFilament(filamentData: Partial<FilamentColor>) {
      try {
        const res = await api.post('/filaments', filamentData);
        if (res.data?.success) {
          toast.success('Nuevo filamento agregado');
          await this.fetchFilaments();
          return res.data.filament;
        }
      } catch (err: any) {
        // Fallback local
        const newFilament: FilamentColor = {
          id: filamentData.id || filamentData.label?.toLowerCase().replace(/[^a-z0-9]+/g, '_') || `custom_${Date.now()}`,
          label: filamentData.label || 'Color Personalizado',
          brand: filamentData.brand || 'Personalizado',
          hex: filamentData.hex || '#18181B',
          textColor: filamentData.hex === '#FFFFFF' ? '#18181B' : '#FFFFFF',
          material: filamentData.material || 'PLA',
          costPerKg: filamentData.costPerKg || 300,
          inStock: Boolean(filamentData.inStock),
          supplierDeliveryDays: filamentData.supplierDeliveryDays || 2,
          supplierUrl: filamentData.supplierUrl
        };
        this.filaments.push(newFilament);
        toast.success('Filamento añadido');
        return newFilament;
      }
    },

    async removeFilament(id: string | number) {
      try {
        await api.delete(`/filaments/${id}`);
        toast.success('Filamento eliminado');
        await this.fetchFilaments();
      } catch (err: any) {
        this.filaments = this.filaments.filter(f => f.id !== id);
        toast.success('Filamento eliminado');
      }
    }
  }
});
