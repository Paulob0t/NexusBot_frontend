<script setup lang="ts">
import type { PagoItem } from '@/api/dashboard'

defineProps<{
  pagos: PagoItem[]
  searchQuery: string
  activeFilter: string
  formatCurrency: (amount: number, currency?: string) => string
  formatWhatsAppLink: (phone: string | null, cliente: string, monto: number, concepto: string) => string
}>()

const emit = defineEmits<{
  (e: 'update:search-query', val: string): void
  (e: 'update:active-filter', val: string): void
  (e: 'copy-details', pago: PagoItem): void
}>()
</script>

<template>
  <div class="rounded-xl bg-[#0c0c0e] border border-neutral-800 p-5 sm:p-6 space-y-4">
    <!-- Header y Filtros -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      <div>
        <h3 class="text-sm font-semibold text-white tracking-tight flex items-center space-x-2">
          <span>Cobranza & Pagos Pendientes</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
            {{ pagos.length }}
          </span>
        </h3>
        <p class="text-xs text-neutral-500 mt-0.5">Seguimiento de facturas por cobrar y gestión de cobranza.</p>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <!-- Input de Búsqueda -->
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
          <input
            :value="searchQuery"
            @input="emit('update:search-query', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Buscar cliente, concepto..."
            class="w-full sm:w-56 pl-8 pr-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
          />
        </div>

        <!-- Filtros Rápidos -->
        <div class="flex items-center space-x-1 p-1 rounded-lg bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
          <button
            v-for="f in [
              { id: 'todos', label: 'Todos' },
              { id: 'vencidos', label: 'Vencidos' },
              { id: 'prox7', label: 'Próx. 7 días' },
              { id: 'dominios', label: 'Dominios' },
              { id: 'hosting', label: 'Hosting' },
            ]"
            :key="f.id"
            @click="emit('update:active-filter', f.id)"
            :class="[
              'px-2.5 py-1 rounded text-xs transition-colors shrink-0',
              activeFilter === f.id ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
            ]"
          >
            {{ f.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-mono text-[10px] border-b border-neutral-800">
          <tr>
            <th class="py-3 px-3.5">Cliente / Servicio</th>
            <th class="py-3 px-3.5">Concepto</th>
            <th class="py-3 px-3.5">Monto</th>
            <th class="py-3 px-3.5">Vencimiento</th>
            <th class="py-3 px-3.5 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-900">
          <tr
            v-for="pago in pagos"
            :key="pago.id"
            class="hover:bg-neutral-900/40 transition-colors duration-100 group"
          >
            <!-- Cliente / Dominio -->
            <td class="py-3 px-3.5">
              <div class="font-medium text-white text-xs">{{ pago.cliente_nombre }}</div>
              <div class="text-neutral-500 text-[11px] flex items-center space-x-1.5 mt-0.5">
                <span v-if="pago.nombre_servicio" class="text-neutral-400 font-mono">
                  {{ pago.nombre_servicio }}
                </span>
                <span v-else>{{ pago.cliente_correo || 'Sin correo' }}</span>
              </div>
            </td>

            <!-- Concepto y Tipo -->
            <td class="py-3 px-3.5">
              <div class="text-neutral-300 text-xs">{{ pago.concepto }}</div>
              <span class="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] font-mono uppercase rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                {{ pago.tipo_servicio_label }}
              </span>
            </td>

            <!-- Monto -->
            <td class="py-3 px-3.5 font-semibold text-white font-mono text-xs">
              {{ formatCurrency(pago.monto, pago.currency) }}
            </td>

            <!-- Estado Vencimiento -->
            <td class="py-3 px-3.5">
              <div class="flex items-center space-x-1.5">
                <span
                  v-if="pago.estado_vencimiento === 'vencido'"
                  class="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/40 text-red-400 border border-red-900/50"
                >
                  Vencido (hace {{ Math.abs(pago.dias_restantes ?? 0) }}d)
                </span>
                <span
                  v-else-if="pago.estado_vencimiento === 'prox7'"
                  class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/30 text-amber-400 border border-amber-900/40"
                >
                  Vence en {{ pago.dias_restantes }}d
                </span>
                <span
                  v-else
                  class="text-neutral-500 text-[11px] font-mono"
                >
                  {{ pago.fecha_limite || 'Pendiente' }}
                </span>
              </div>
            </td>

            <!-- Acciones -->
            <td class="py-3 px-3.5 text-center">
              <div class="flex items-center justify-center space-x-1">
                <!-- Copiar datos -->
                <button
                  @click="emit('copy-details', pago)"
                  class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                  title="Copiar datos de pago"
                >
                  <i class="pi pi-copy text-xs"></i>
                </button>

                <!-- WhatsApp -->
                <a
                  v-if="pago.cliente_telefono"
                  :href="formatWhatsAppLink(pago.cliente_telefono, pago.cliente_nombre, pago.monto, pago.concepto)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                  title="Enviar WhatsApp de cobranza"
                >
                  <i class="pi pi-whatsapp text-xs"></i>
                </a>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="pagos.length === 0">
            <td colspan="5" class="py-8 text-center text-neutral-500 text-xs font-mono">
              No se encontraron registros de cobros pendientes.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
