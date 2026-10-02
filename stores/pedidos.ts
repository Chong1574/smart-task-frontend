import { defineStore } from 'pinia';
import api from '../utils/api';
import { toast } from 'vue-sonner';

export interface PedidoImpresion {
    id?: number | string;
    cliente: string;
    descripcion: string;
    archivos?: string;
    precio?: number;
    abono?: number;
    estado: 'pendiente' | 'imprimiendo' | 'terminados' | 'enviados' | 'entregados';
    estadoPago: 'pendiente' | 'parcial' | 'pagado';
    fechaCreacion?: string;
    fechaActualizacion?: string;
}

export const usePedidosStore = defineStore('pedidos', {
    state: () => ({
        pedidos: [] as PedidoImpresion[],
        loading: false,
        error: null as string | null,
        useLocalFallback: false // Se activa si el backend no está disponible
    }),
    actions: {
        async fetchPedidos() {
            this.loading = true;
            try {
                const res = await api.get('/pedidos');
                if (res.data.success) {
                    this.pedidos = res.data.data;
                    this.useLocalFallback = false;
                }
            } catch (err: any) {
                console.warn("Backend no disponible para pedidos, usando LocalStorage.");
                this.useLocalFallback = true;
                this.loadFromLocalStorage();
            } finally {
                this.loading = false;
            }
        },

        async addPedido(newPedido: PedidoImpresion) {
            const tempPedido = { ...newPedido, id: Date.now(), fechaCreacion: new Date().toISOString() };
            this.pedidos.push(tempPedido);

            if (this.useLocalFallback) {
                this.saveToLocalStorage();
                return true;
            }

            try {
                const res = await api.post('/pedidos', newPedido);
                if (res.data.success) {
                    await this.fetchPedidos();
                    return true;
                } else {
                    this.pedidos = this.pedidos.filter(p => p.id !== tempPedido.id);
                    return false;
                }
            } catch (err) {
                console.error("Error adding pedido:", err);
                this.useLocalFallback = true;
                this.saveToLocalStorage(); // fallback
                return true;
            }
        },

        async updatePedidoStatus(id: number | string, nuevoEstado: PedidoImpresion['estado']) {
            const pedido = this.pedidos.find(p => p.id === id);
            if (!pedido) return false;
            
            const estadoAnterior = pedido.estado;
            pedido.estado = nuevoEstado;
            pedido.fechaActualizacion = new Date().toISOString();

            if (this.useLocalFallback) {
                this.saveToLocalStorage();
                return true;
            }

            try {
                const res = await api.put(`/pedidos/${id}/status`, { estado: nuevoEstado });
                if (res.data.success) {
                    return true;
                }
                // revert
                pedido.estado = estadoAnterior;
                return false;
            } catch (err) {
                console.error("Error updating pedido:", err);
                this.useLocalFallback = true;
                this.saveToLocalStorage();
                return true;
            }
        },

        async updatePedidoPago(id: number | string, estadoPago: PedidoImpresion['estadoPago'], abono?: number) {
            const pedido = this.pedidos.find(p => p.id === id);
            if (!pedido) return false;
            
            const pagoAnterior = pedido.estadoPago;
            const abonoAnterior = pedido.abono;
            
            pedido.estadoPago = estadoPago;
            if (abono !== undefined) pedido.abono = abono;
            pedido.fechaActualizacion = new Date().toISOString();

            if (this.useLocalFallback) {
                this.saveToLocalStorage();
                return true;
            }

            try {
                const res = await api.put(`/pedidos/${id}/pago`, { estadoPago, abono });
                if (res.data.success) return true;
                
                pedido.estadoPago = pagoAnterior;
                pedido.abono = abonoAnterior;
                return false;
            } catch (err) {
                console.error("Error updating pedido pago:", err);
                this.useLocalFallback = true;
                this.saveToLocalStorage();
                return true;
            }
        },

        async deletePedido(id: number | string) {
            const index = this.pedidos.findIndex(p => p.id === id);
            if (index === -1) return;
            const pedidoBorrado = this.pedidos[index];
            
            this.pedidos.splice(index, 1);

            if (this.useLocalFallback) {
                this.saveToLocalStorage();
                return;
            }

            try {
                const res = await api.delete(`/pedidos/${id}`);
                if (!res.data.success) {
                    this.pedidos.splice(index, 0, pedidoBorrado); // revert
                }
            } catch (err) {
                console.error("Error deleting pedido:", err);
                this.useLocalFallback = true;
                this.saveToLocalStorage();
            }
        },

        // Métodos de LocalStorage para fallback
        loadFromLocalStorage() {
            if (typeof window !== 'undefined') {
                const data = localStorage.getItem('pedidos_brandy_fallback');
                if (data) {
                    try {
                        this.pedidos = JSON.parse(data);
                    } catch (e) {
                        this.pedidos = [];
                    }
                }
            }
        },
        saveToLocalStorage() {
            if (typeof window !== 'undefined') {
                localStorage.setItem('pedidos_brandy_fallback', JSON.stringify(this.pedidos));
            }
        }
    }
});
