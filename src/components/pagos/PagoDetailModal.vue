<script setup lang="ts">
import type { PagoDetail, PagoListItem } from '@/api/pagos'

defineProps<{
  isOpen: boolean
  pago: PagoDetail | null
  isLoading: boolean
  isSuperAdmin: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', pago: PagoDetail): void
  (e: 'toggle-status', pago: PagoListItem): void
  (e: 'send-whatsapp', pago: PagoListItem): void
}>()

function formatCurrency(val?: number, moneda = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda || 'MXN',
  }).format(val || 0)
}

function printReceipt() {
  window.print()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      @click.self="emit('close')"
    >
      <Transition name="modal-smooth" appear>
        <div class="w-full max-w-xl bg-[#0c0c0e] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
          <!-- Cabecera del Modal / Recibo -->
          <div class="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
                <i :class="pago?.estatus === 1 ? 'pi pi-check-circle text-sm text-emerald-400' : 'pi pi-clock text-sm text-amber-400'"></i>
              </div>
              <div>
                <div class="text-sm font-semibold text-white flex items-center space-x-2">
                  <span>Comprobante de Cobro</span>
                  <span class="text-xs text-neutral-500 font-mono">#{{ pago?.id }}</span>
                </div>
                <div class="text-xs text-neutral-400 font-mono">{{ pago?.tipo_servicio_label }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-1.5">
              <button
                @click="printReceipt"
                class="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-neutral-800 flex items-center justify-center transition-colors"
                title="Imprimir comprobante"
              >
                <i class="pi pi-print text-xs"></i>
              </button>
              <button
                @click="emit('close')"
                class="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-neutral-800 flex items-center justify-center transition-colors"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Contenido del Modal -->
          <div v-if="isLoading" class="p-12 flex flex-col items-center justify-center space-y-3">
            <i class="pi pi-spin pi-spinner text-2xl text-neutral-400"></i>
            <span class="text-xs text-neutral-400 font-medium">Cargando datos del cobro...</span>
          </div>

          <div v-else-if="pago" class="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto custom-scrollbar">
            <!-- 1. Tarjeta de Estado & Monto -->
            <div class="p-4 rounded-xl bg-[#141417] border border-neutral-800 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase font-medium text-neutral-400 tracking-wider">Total del Recibo</span>
                <div class="text-2xl font-mono font-bold text-white tracking-tight mt-0.5">
                  {{ formatCurrency(pago.monto, pago.currency) }}
                  <span class="text-xs font-normal text-neutral-500">({{ pago.currency }})</span>
                </div>
              </div>
              <div class="text-right">
                <span
                  :class="[
                    'inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                    pago.estatus === 1
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="pago.estatus === 1 ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                  <span>{{ pago.estatus === 1 ? 'Pago Acreditado' : 'Pago Pendiente' }}</span>
                </span>
                <div v-if="pago.fecha_pago" class="text-[10px] text-neutral-500 font-mono mt-1">
                  Acreditado el {{ pago.fecha_pago }}
                </div>
              </div>
            </div>

            <!-- 2. Cliente Titular -->
            <div class="p-4 rounded-xl bg-[#141417] border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span class="text-[10px] uppercase font-medium text-neutral-500 tracking-wider">Cliente</span>
                <div class="text-sm font-semibold text-white mt-0.5">{{ pago.cliente_empresa || pago.cliente_nombre }}</div>
                <div class="text-neutral-400 text-xs">{{ pago.cliente_nombre }} (ID #{{ pago.id_clie }})</div>
                <div v-if="pago.cliente_correo" class="text-neutral-500 text-[11px] font-mono">{{ pago.cliente_correo }}</div>
              </div>
              <button
                v-if="pago.cliente_telefono"
                @click="emit('send-whatsapp', pago)"
                class="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-medium flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
              >
                <i class="pi pi-whatsapp text-xs"></i>
                <span>Enviar WhatsApp</span>
              </button>
            </div>

            <!-- 3. Desglose del Concepto -->
            <div class="space-y-1.5">
              <span class="text-[10px] uppercase font-medium text-neutral-500 tracking-wider">Detalle del Concepto</span>
              <div class="p-4 rounded-xl bg-[#141417] border border-neutral-800 space-y-2">
                <div class="font-medium text-neutral-200 text-sm">
                  {{ pago.concepto }}
                </div>
                <div v-if="pago.nombre_servicio" class="text-neutral-400 font-mono text-xs flex items-center space-x-1.5">
                  <i class="pi pi-link text-[10px]"></i>
                  <span>Servicio: {{ pago.nombre_servicio }}</span>
                </div>
              </div>
            </div>

            <!-- 4. Parámetros de Facturación y Método -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div class="p-3 rounded-xl bg-[#141417] border border-neutral-800">
                <span class="text-neutral-500 text-[10px] block font-medium">Método de Pago</span>
                <span class="font-medium text-neutral-200 text-xs">{{ pago.forma_pago_label }}</span>
              </div>
              <div class="p-3 rounded-xl bg-[#141417] border border-neutral-800">
                <span class="text-neutral-500 text-[10px] block font-medium">Referencia / Folio</span>
                <span class="font-mono text-neutral-300 font-medium text-xs truncate block">
                  {{ pago.id_pago || 'Sin referencia' }}
                </span>
              </div>
              <div class="p-3 rounded-xl bg-[#141417] border border-neutral-800">
                <span class="text-neutral-500 text-[10px] block font-medium">Fecha Emisión</span>
                <span class="font-mono text-neutral-200 text-xs">{{ pago.fecha }}</span>
              </div>
              <div class="p-3 rounded-xl bg-[#141417] border border-neutral-800">
                <span class="text-neutral-500 text-[10px] block font-medium">Fecha Límite</span>
                <span class="font-mono text-white text-xs">{{ pago.fecha_limite_pago || 'Sin límite' }}</span>
              </div>
              <div class="p-3 rounded-xl bg-[#141417] border border-neutral-800">
                <span class="text-neutral-500 text-[10px] block font-medium">Tipo Registro</span>
                <span class="font-medium text-neutral-200 text-xs">{{ pago.manual === 1 ? 'Manual' : 'Automático' }}</span>
              </div>
              <div class="p-3 rounded-xl bg-[#141417] border border-neutral-800">
                <span class="text-neutral-500 text-[10px] block font-medium">Frecuencia</span>
                <span class="font-medium text-neutral-200 text-xs">
                  {{ pago.frecuencia_pago === 1 ? 'Mensual' : pago.frecuencia_pago === 2 ? 'Anual' : 'Único' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Footer del Modal -->
          <div class="px-6 py-4 border-t border-neutral-800 bg-[#0c0c0e] flex items-center justify-between">
            <button
              @click="emit('close')"
              class="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Cerrar
            </button>
            <div class="flex items-center space-x-2">
              <button
                v-if="isSuperAdmin && pago"
                @click="emit('toggle-status', pago)"
                :class="[
                  'px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 border',
                  pago.estatus === 1
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                ]"
              >
                <i :class="pago.estatus === 1 ? 'pi pi-undo text-xs' : 'pi pi-check text-xs'"></i>
                <span>{{ pago.estatus === 1 ? 'Marcar Pendiente' : 'Acreditar Pago' }}</span>
              </button>
              <button
                v-if="isSuperAdmin && pago"
                @click="emit('edit', pago)"
                class="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <i class="pi pi-pencil text-xs"></i>
                <span>Editar</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-smooth-enter-active,
.modal-smooth-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-smooth-enter-from,
.modal-smooth-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(6px);
}
</style>
