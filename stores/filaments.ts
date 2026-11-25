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
            dbId: typeof item.id === 'number' ? item.id : undefined,
            colorId: item.colorId,
            colorName: item.colorName,
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
      const match = this.filaments.find(f => f.dbId === id || f.id === id || f.colorId === id);
      const targetId = match?.dbId ?? match?.colorId ?? id;
      const payload: Record<string, any> = { ...data };
      if (data.label && !payload.colorName) payload.colorName = data.label;

      try {
        await api.put(`/filaments/${targetId}`, payload);
        toast.success('Filamento actualizado');
        await this.fetchFilaments();
        return true;
      } catch (err: any) {
        console.error('Error updating filament:', err);
        toast.error(err?.response?.data?.error || err?.message || 'Error al actualizar filamento');
        return false;
      }
    },

    async bulkSave(list: FilamentColor[]) {
      const payload = list.map((f) => ({
        id: f.dbId,
        colorId: f.colorId || f.id,
        colorName: f.colorName || f.label || f.id,
        material: f.material || 'PLA',
        brand: f.brand,
        hex: f.hex,
        costPerKg: Number(f.costPerKg || 300),
        inStock: Boolean(f.inStock),
        stockGrams: f.stockGrams,
        supplierDeliveryDays: Number(f.supplierDeliveryDays || 2),
        supplierUrl: f.supplierUrl || undefined
      }));

      try {
        await api.post('/filaments/bulk', { filaments: payload });
        toast.success('Inventario de filamentos guardado con éxito');
        await this.fetchFilaments();
        return true;
      } catch (err: any) {
        console.error('Error in bulkSave filaments:', err);
        toast.error(err?.response?.data?.error || err?.message || 'No se pudo guardar el inventario en el servidor');
        return false;
      }
    },

    async createFilament(filamentData: Partial<FilamentColor>) {
      const resolvedName = (filamentData.colorName || filamentData.label || '').trim();
      const payload = {
        ...filamentData,
        colorName: resolvedName,
        colorId: filamentData.colorId || filamentData.id,
      };

      try {
        const res = await api.post('/filaments', payload);
        if (res.data?.success) {
          toast.success('Nuevo filamento agregado');
          await this.fetchFilaments();
          return res.data.filament;
        }
        toast.error(res.data?.error || 'No se pudo agregar el filamento');
        return null;
      } catch (err: any) {
        console.error('Error creating filament:', err);
        toast.error(err?.response?.data?.error || err?.message || 'Error al registrar nuevo filamento');
        return null;
      }
    },

    async removeFilament(id: string | number) {
      const match = this.filaments.find(f => f.dbId === id || f.id === id || f.colorId === id);
      const targetId = match?.dbId ?? match?.colorId ?? id;

      try {
        await api.delete(`/filaments/${targetId}`);
        toast.success('Filamento eliminado');
        await this.fetchFilaments();
        return true;
      } catch (err: any) {
        console.error('Error removing filament:', err);
        toast.error(err?.response?.data?.error || err?.message || 'Error al eliminar filamento');
        return false;
      }
    }
  }
});
