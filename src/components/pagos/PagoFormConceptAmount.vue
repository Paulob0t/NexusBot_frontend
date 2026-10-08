<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  formData: {
    concepto: string
    monto: number
    currency?: string
  }
  selectedClientFacturacion?: number
}>()

const popularConcepts = [
  'Renovación Anual de Dominio',
  'Servicio Anual de Hosting',
  'Mensualidad de Hosting & Correo',
  'Desarrollo Web & Landing Page',
  'Mantenimiento Mensual & Soporte',
  'Certificado SSL & Seguridad Web',
]

function setConcept(c: string) {
  props.formData.concepto = c
}

const montoConIva = computed(() => {
  const base = Number(props.formData.monto) || 0
  if (props.selectedClientFacturacion === 1) {
    return (base * 1.16).toFixed(2)
  }
  return base.toFixed(2)
})
</script>

<template>
  <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 shadow-sm space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800/80">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-dollar text-xs"></i>
        </div>
        <div>
          <h2 class="text-sm font-semibold text-white">Concepto & Monto del Cobro</h2>
          <p class="text-[11px] text-neutral-400">Detalles del concepto facturable y desglose económico</p>
        </div>
      </div>
    </div>

    <!-- Concepto -->
    <div>
      <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
        Concepto / Descripción del Pago <span class="text-rose-400">*</span>
      </label>
      <input
        v-model="formData.concepto"
        type="text"
        required
        placeholder="ej. Renovación Anual de Dominio y Hosting"
        class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 mb-2.5"
      />
      <!-- Pills sugerencias -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="c in popularConcepts"
          :key="c"
          type="button"
          @click="setConcept(c)"
          class="px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors"
          :class="formData.concepto === c ? 'bg-neutral-800 text-white border border-neutral-600 shadow-sm' : 'bg-[#141417] border border-neutral-800/80 text-neutral-400 hover:text-white'"
        >
          {{ c }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
      <!-- Monto Base -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Monto <span class="text-rose-400">*</span>
        </label>
        <div class="relative flex items-center">
          <span class="px-3 py-2.5 rounded-l-xl bg-neutral-900 border border-r-0 border-neutral-800 text-xs text-neutral-400 font-mono select-none">
            {{ formData.currency === 'USD' ? 'US$' : '$' }}
          </span>
          <input
            v-model.number="formData.monto"
            type="number"
            step="0.01"
            min="1"
            required
            placeholder="0.00"
            class="w-full px-3.5 py-2.5 rounded-r-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
          />
        </div>
        <div v-if="selectedClientFacturacion === 1" class="mt-1.5 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 font-mono flex justify-between items-center">
          <span class="text-neutral-500">Total con IVA (16%):</span>
          <span class="font-bold text-white">${{ montoConIva }}</span>
        </div>
      </div>

      <!-- Moneda -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Moneda <span class="text-rose-400">*</span>
        </label>
        <select
          v-model="formData.currency"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
        >
          <option value="MXN">MXN (Pesos Mexicanos)</option>
          <option value="USD">USD (Dólares Americanos)</option>
        </select>
      </div>
    </div>
  </div>
</template>
