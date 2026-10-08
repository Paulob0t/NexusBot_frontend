<script setup lang="ts">
import type { DominioListItem } from '@/api/dominios'

defineProps<{
  dominios: DominioListItem[]
  isSuperAdmin: boolean
  formatCurrency: (amount: number, currency?: string) => string
  formatWhatsAppRenewalLink: (phone: string | null, cliente: string, dominio: string, vencimiento: string | null) => string
}>()

const emit = defineEmits<{
  (e: 'view-detail', id: number): void
  (e: 'edit', dom: DominioListItem): void
  (e: 'delete', dom: DominioListItem): void
}>()
</script>

<template>
  <div class="hidden md:block rounded-2xl bg-[#0c0c0e] border border-neutral-800/90 overflow-hidden shadow-xl">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#09090b] text-neutral-400 uppercase tracking-wider font-medium border-b border-neutral-800 text-[10px]">
          <tr>
            <th class="py-3.5 px-4 font-mono">Dominio Web</th>
            <th class="py-3.5 px-4 font-mono">Cliente / Titular</th>
            <th class="py-3.5 px-4 font-mono">Registrador & Costo</th>
            <th class="py-3.5 px-4 text-center font-mono">Vencimiento</th>
            <th class="py-3.5 px-4 text-center font-mono">Cobro</th>
            <th class="py-3.5 px-4 text-right font-mono">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-800/60">
          <tr
            v-for="dom in dominios"
            :key="dom.id_dominio"
            class="hover:bg-neutral-900/40 transition-colors duration-150 group"
          >
            <!-- Dominio -->
            <td class="py-3.5 px-4">
              <div class="flex items-center space-x-3">
                <div class="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 shrink-0">
                  <i class="pi pi-globe text-xs"></i>
                </div>
                <div class="min-w-0">
                  <a
                    :href="`https://${dom.url_dominio}`"
                    target="_blank"
                    rel="noopener"
                    class="font-semibold text-white text-xs truncate hover:text-neutral-300 transition-colors inline-flex items-center space-x-1.5"
                  >
                    <span class="truncate max-w-[220px]">{{ dom.url_dominio }}</span>
                    <i class="pi pi-external-link text-[10px] text-neutral-500 group-hover:text-neutral-300"></i>
                  </a>
                  <div class="text-[11px] text-neutral-500 flex items-center space-x-2 mt-0.5 font-mono">
                    <span>#{{ dom.id_dominio }}</span>
                    <span class="text-neutral-700">•</span>
                    <span v-if="dom.registrado === 1" class="px-1.5 py-0.2 rounded text-[9px] bg-neutral-900 text-neutral-300 border border-neutral-800 font-medium">Puvnex</span>
                    <span v-else class="px-1.5 py-0.2 rounded text-[9px] bg-neutral-950 text-neutral-500 border border-neutral-850 font-medium">Externo</span>
                  </div>
                </div>
              </div>
            </td>

            <!-- Cliente -->
            <td class="py-3.5 px-4">
              <div class="space-y-0.5">
                <div class="font-medium text-neutral-200 text-xs truncate max-w-[200px]">{{ dom.cliente_empresa }}</div>
                <div class="text-[11px] text-neutral-500 truncate max-w-[200px]">
                  {{ dom.cliente_nombre }}
                </div>
              </div>
            </td>

            <!-- Proveedor y Costo -->
            <td class="py-3.5 px-4">
              <div class="space-y-0.5">
                <div class="font-mono font-semibold text-white text-xs">{{ formatCurrency(dom.costo_dominio) }}</div>
                <div class="text-[11px] text-neutral-500 flex items-center space-x-1">
                  <i class="pi pi-server text-[9px] text-neutral-600"></i>
                  <span class="truncate max-w-[120px]">{{ dom.proveedor || 'Puvnex' }}</span>
                </div>
              </div>
            </td>

            <!-- Vencimiento -->
            <td class="py-3.5 px-4 text-center">
              <div class="inline-flex flex-col items-center">
                <span
                  v-if="dom.estado_vencimiento === 'vencido'"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-950/40 text-rose-300 border border-rose-800/50 flex items-center space-x-1"
                >
                  <span class="w-1 h-1 rounded-full bg-rose-400"></span>
                  <span>Venció hace {{ Math.abs(dom.dias_restantes ?? 0) }}d</span>
                </span>
                <span
                  v-else-if="dom.estado_vencimiento === 'prox7'"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-950/40 text-amber-300 border border-amber-800/50 flex items-center space-x-1"
                >
                  <span class="w-1 h-1 rounded-full bg-amber-400 animate-ping"></span>
                  <span>Vence en {{ dom.dias_restantes }}d</span>
                </span>
                <span
                  v-else-if="dom.estado_vencimiento === 'prox30'"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-950/30 text-amber-300 border border-amber-800/40"
                >
                  En {{ dom.dias_restantes }} días
                </span>
                <span
                  v-else
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/30 text-emerald-400 border border-emerald-800/40"
                >
                  Al corriente
                </span>
                <span v-if="dom.fecha_pago" class="text-[10px] font-mono text-neutral-500 mt-0.5">{{ dom.fecha_pago }}</span>
              </div>
            </td>

            <!-- Estado Cobro -->
            <td class="py-3.5 px-4 text-center">
              <span
                v-if="dom.estatus_pago === 1"
                class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/30 text-emerald-400 border border-emerald-800/40"
              >
                <i class="pi pi-check text-[9px]"></i>
                <span>Pagado</span>
              </span>
              <span
                v-else
                class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-950/30 text-amber-300 border border-amber-800/40"
              >
                <i class="pi pi-clock text-[9px]"></i>
                <span>Pendiente</span>
              </span>
            </td>

            <!-- Acciones -->
            <td class="py-3.5 px-4 text-right">
              <div class="flex items-center justify-end space-x-1">
                <!-- WhatsApp -->
                <a
                  v-if="dom.cliente_telefono"
                  :href="formatWhatsAppRenewalLink(dom.cliente_telefono, dom.cliente_nombre, dom.url_dominio, dom.fecha_pago)"
                  target="_blank"
                  rel="noopener"
                  class="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-emerald-400 border border-neutral-800 flex items-center justify-center transition-colors"
                  title="Enviar WhatsApp"
                >
                  <i class="pi pi-whatsapp text-xs"></i>
                </a>

                <!-- Ver Detalle / DNS -->
                <button
                  @click="emit('view-detail', dom.id_dominio)"
                  class="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 flex items-center justify-center transition-colors"
                  title="Ver Detalle / DNS"
                >
                  <i class="pi pi-eye text-xs"></i>
                </button>

                <!-- Editar -->
                <button
                  v-if="isSuperAdmin"
                  @click="emit('edit', dom)"
                  class="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 flex items-center justify-center transition-colors"
                  title="Editar"
                >
                  <i class="pi pi-pencil text-xs"></i>
                </button>

                <!-- Eliminar -->
                <button
                  v-if="isSuperAdmin && dom.eliminado === 0"
                  @click="emit('delete', dom)"
                  class="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-rose-950/50 text-neutral-400 hover:text-rose-400 border border-neutral-800 flex items-center justify-center transition-colors"
                  title="Eliminar"
                >
                  <i class="pi pi-trash text-xs"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
