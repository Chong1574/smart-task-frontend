import { defineStore } from 'pinia'

interface ConfirmOptions {
    title: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    destructive?: boolean
}

export const useConfirmStore = defineStore('confirm', {
    state: () => ({
        open: false,
        title: '',
        message: '',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        destructive: false,
        resolver: null as ((value: boolean) => void) | null
    }),
    actions: {
        ask(opts: ConfirmOptions): Promise<boolean> {
            // Resolver cualquier diálogo pendiente previo como cancelado para evitar promesas huérfanas
            if (this.resolver) {
                this.resolver(false)
                this.resolver = null
            }
            this.title = opts.title
            this.message = opts.message || ''
            this.confirmLabel = opts.confirmLabel || 'Confirmar'
            this.cancelLabel = opts.cancelLabel || 'Cancelar'
            this.destructive = opts.destructive ?? false
            this.open = true
            return new Promise((resolve) => {
                this.resolver = resolve
            })
        },
        confirm() {
            this.open = false
            this.resolver?.(true)
            this.resolver = null
        },
        cancel() {
            this.open = false
            this.resolver?.(false)
            this.resolver = null
        }
    }
})
