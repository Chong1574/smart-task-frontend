import { defineStore } from 'pinia';
import api from '../utils/api';
import { toast } from 'vue-sonner';

export interface PedidoImpresion {
    id?: number | string;
    cliente: string;
    descripcion: string;
    archivos?: string;
    precio?: number;
    direccion?: string;
    piezas?: string;
    items?: any[];
    estado: 'pendiente' | 'imprimiendo' | 'terminados' | 'enviados' | 'entregados';
    fechaCreacion?: string;
    fechaActualizacion?: string;
    paymentStatus?: string;
}

export const usePedidosStore = defineStore('pedidos', {
    state: () => ({
        pedidos: [] as PedidoImpresion[],
        loading: false,
        error: null as string | null,
        useLocalFallback: false
    }),
    actions: {
        async fetchPedidos() {
            this.loading = true;
            try {
                const res = await api.get('/pedidos');
                if (res.data.success) {
                    this.pedidos = res.data.data;
                    this.useLocalFallback = false;
                    this.saveToLocalStorage();
                }
            } catch (err: any) {
                console.warn("Backend no disponible para pedidos, usando LocalStorage.");
                this.useLocalFallback = true;
                this.loadFromLocalStorage();
                toast.warning('Sin conexión con el servidor. Mostrando datos locales en caché.');
            } finally {
                this.loading = false;
            }
        },

        async addPedido(newPedido: PedidoImpresion) {
            this.loading = true;
            try {
                const res = await api.post('/pedidos', newPedido);
                if (res.data.success) {
                    await this.fetchPedidos();
                    toast.success('Pedido creado correctamente');
                    return true;
                } else {
                    toast.error(res.data.message || 'Error al crear el pedido');
                    return false;
                }
            } catch (err) {
                console.error("Error adding pedido:", err);
                toast.error('Error de conexión con el servidor al registrar el pedido');
                return false;
            } finally {
                this.loading = false;
            }
        },

        async updatePedidoStatus(id: number | string, nuevoEstado: PedidoImpresion['estado']) {
            const pedido = this.pedidos.find(p => p.id === id);
            if (!pedido) return false;
            
            const estadoAnterior = pedido.estado;
            pedido.estado = nuevoEstado;
            pedido.fechaActualizacion = new Date().toISOString();

            try {
                const res = await api.put(`/pedidos/${id}/status`, { estado: nuevoEstado });
                if (res.data.success) {
                    this.saveToLocalStorage();
                    return true;
                }
                pedido.estado = estadoAnterior;
                toast.error(res.data.message || 'Error al actualizar estado');
                return false;
            } catch (err) {
                console.error("Error updating pedido:", err);
                pedido.estado = estadoAnterior;
                toast.error('Error de conexión al actualizar estado del pedido');
                return false;
            }
        },

        async validatePayment(id: number | string) {
            const pedido = this.pedidos.find(p => p.id === id);
            if (!pedido) return false;

            const previousStatus = pedido.paymentStatus;
            pedido.paymentStatus = 'PAID';

            try {
                const res = await api.put(`/pedidos/${id}/payment`);
                if (res.data.success) {
                    this.saveToLocalStorage();
                    toast.success('Pago validado y correo enviado');
                    return true;
                } else {
                    pedido.paymentStatus = previousStatus;
                    toast.error('Error al validar pago');
                    return false;
                }
            } catch (err) {
                console.error("Error validating payment:", err);
                pedido.paymentStatus = previousStatus;
                toast.error('Error de conexión al validar pago');
                return false;
            }
        },

        async deletePedido(id: number | string) {
            const index = this.pedidos.findIndex(p => p.id === id);
            if (index === -1) return;
            const pedidoBorrado = this.pedidos[index];
            
            this.pedidos.splice(index, 1);

            try {
                const res = await api.delete(`/pedidos/${id}`);
                if (res.data.success) {
                    this.saveToLocalStorage();
                    toast.success('Pedido eliminado correctamente');
                } else {
                    this.pedidos.splice(index, 0, pedidoBorrado);
                    toast.error(res.data.message || 'Error al eliminar pedido');
                }
            } catch (err) {
                console.error("Error deleting pedido:", err);
                this.pedidos.splice(index, 0, pedidoBorrado);
                toast.error('Error de conexión al eliminar el pedido');
            }
        },

        // Métodos de LocalStorage para caché de lectura
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
