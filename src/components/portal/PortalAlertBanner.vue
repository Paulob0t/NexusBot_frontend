<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  totalPendientes: number
  montoPendiente: number
}>()

const router = useRouter()

function goToPagos() {
  router.push('/pagos')
}
</script>

<template>
  <div>
    <!-- ALERTA URGENTE: Pagos Pendientes -->
    <div
      v-if="totalPendientes > 0"
      @click="goToPagos"
      class="group cursor-pointer rounded-xl bg-[#0c0c0e] border border-amber-900/50 hover:border-amber-700/60 p-4 md:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
    >
      <div class="flex items-start sm:items-center gap-3.5">
        <div class="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-900/60 text-amber-400 flex items-center justify-center shrink-0">
          <i class="pi pi-exclamation-triangle text-sm"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xs font-semibold text-amber-300">
              {{ totalPendientes }} {{ totalPendientes === 1 ? 'pago pendiente' : 'pagos pendientes' }}
            </h3>
            <span v-if="montoPendiente > 0" class="px-2 py-0.2 rounded bg-amber-950/50 text-amber-300 text-[11px] font-mono border border-amber-900/50">
              ${{ montoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }} MXN
            </span>
          </div>
          <p class="text-[11px] text-neutral-400 mt-0.5">
            Liquídalo{{ totalPendientes === 1 ? '' : 's' }} a tiempo para mantener tus servicios, hosting y dominios activos sin interrupciones.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1.5 text-xs font-medium text-amber-400 group-hover:text-amber-300 transition-colors shrink-0 self-end sm:self-center">
        <span>Pagar ahora</span>
        <i class="pi pi-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
      </div>
    </div>

    <!-- ALERTA OK: Cuenta al corriente -->
    <div
      v-else
      class="rounded-xl bg-[#0c0c0e] border border-neutral-800 p-4 md:p-4.5 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3.5">
        <div class="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
          <i class="pi pi-check text-sm"></i>
        </div>
        <div>
          <h3 class="text-xs font-semibold text-white">Tu cuenta está al corriente</h3>
          <p class="text-[11px] text-neutral-400 mt-0.5">
            No tienes pagos pendientes. Te notificaremos con anticipación antes de cada fecha de renovación.
          </p>
        </div>
      </div>
      <span class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-neutral-900 text-neutral-300 text-xs font-mono border border-neutral-800">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Al día
      </span>
    </div>
  </div>
</template>
