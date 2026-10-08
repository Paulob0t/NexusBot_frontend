<script setup lang="ts">
import type { DominioListItem } from '@/api/dominios'

defineProps<{
  dominios: DominioListItem[]
  viewMode: 'table' | 'cards'
  isSuperAdmin: boolean
  formatCurrency: (amount: number, currency?: string) => string
  formatWhatsAppRenewalLink: (phone: string | null, cliente: string, dominio: string, vencimiento: string | null) => string
}>()

const emit = defineEmits<{
  (e: 'view-detail', id: number): void
  (e: 'edit', dom: DominioListItem): void
}>()
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    :class="viewMode === 'table' ? 'md:hidden' : ''"
  >
    <div
      v-for="dom in dominios"
      :key="`card-dom-${dom.id_dominio}`"
      class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800/90 hover:border-neutral-700 transition-all space-y-3.5 shadow-lg flex flex-col justify-between"
    >
      <div>
        <!-- Header -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center space-x-2.5 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 shrink-0">
              <i class="pi pi-globe text-xs"></i>
            </div>
            <div class="min-w-0">
              <h4 class="font-semibold text-white text-xs truncate">{{ dom.url_dominio }}</h4>
              <p class="text-[11px] text-neutral-500 truncate">{{ dom.cliente_empresa }}</p>
            </div>
          </div>

          <span
            v-if="dom.estatus_pago === 1"
            class="px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-950/30 text-emerald-400 border border-emerald-800/40"
          >
            Pagado
          </span>
          <span
            v-else
            class="px-2 py-0.5 rounded-full text-[9px] font-medium bg-amber-950/30 text-amber-300 border border-amber-800/40"
          >
            Pendiente
          </span>
        </div>

        <!-- Info Grid -->
        <div class="mt-3 pt-2.5 border-t border-neutral-800/80 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-neutral-500 text-[11px]">Registrador:</span>
            <span class="text-neutral-300 text-[11px]">{{ dom.proveedor || 'Puvnex' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-neutral-500 text-[11px]">Costo:</span>
            <span class="font-mono font-semibold text-white text-[11px]">{{ formatCurrency(dom.costo_dominio) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-neutral-500 text-[11px]">Vencimiento:</span>
            <span
              :class="[
                'text-[11px] font-medium',
                dom.estado_vencimiento === 'vencido' ? 'text-rose-400' :
                dom.estado_vencimiento === 'prox7' ? 'text-amber-400' : 'text-emerald-400'
              ]"
            >
              {{ dom.fecha_pago || 'Activo' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Botones Táctiles Móvil -->
      <div class="pt-2.5 border-t border-neutral-800/80 flex items-center space-x-2">
        <a
          v-if="dom.cliente_telefono"
          :href="formatWhatsAppRenewalLink(dom.cliente_telefono, dom.cliente_nombre, dom.url_dominio, dom.fecha_pago)"
          target="_blank"
          rel="noopener"
          class="flex-1 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
        >
          <i class="pi pi-whatsapp text-xs text-neutral-400"></i>
          <span>WhatsApp</span>
        </a>

        <button
          @click="emit('view-detail', dom.id_dominio)"
          class="flex-1 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
        >
          <i class="pi pi-eye text-xs text-neutral-400"></i>
          <span>Detalle</span>
        </button>

        <button
          v-if="isSuperAdmin"
          @click="emit('edit', dom)"
          class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
          title="Editar"
        >
          <i class="pi pi-pencil text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>
