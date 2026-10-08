<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  formData: {
    tipo_producto?: string
    producto?: number
    costo_producto?: number
    id_forma_pago?: number
    frecuencia_pago?: number
  }
  selectedClientFacturacion?: number
}>()

const planPresets = [
  { id: 1, name: 'Plan Básico', cat: 'Hosting Compartido', price: 699, freq: 2 },
  { id: 2, name: 'Plan Emprendedor', cat: 'Hosting Compartido', price: 1299, freq: 2 },
  { id: 3, name: 'Plan Empresarial', cat: 'Hosting Cloud', price: 2499, freq: 2 },
  { id: 4, name: 'Plan VPS Pro', cat: 'VPS Administrado', price: 4899, freq: 2 },
  { id: 5, name: 'Plan Pro Mensual', cat: 'Plan Pro', price: 450, freq: 1 },
]

function applyPlan(plan: typeof planPresets[0]) {
  props.formData.producto = plan.id
  props.formData.tipo_producto = plan.cat
  props.formData.costo_producto = plan.price
  props.formData.frecuencia_pago = plan.freq
}

const costoConIva = computed(() => {
  const base = Number(props.formData.costo_producto) || 0
  if (props.selectedClientFacturacion === 1) {
    return (base * 1.16).toFixed(2)
  }
  return base.toFixed(2)
})
</script>

<template>
  <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-box text-xs"></i>
        </div>
        <div>
          <h2 class="text-sm font-semibold text-white">Plan & Tarifas del Servicio</h2>
          <p class="text-[11px] text-neutral-400 font-sans">Selecciona el paquete de hosting y condiciones de facturación</p>
        </div>
      </div>
    </div>

    <!-- Presets de Planes Rápidos -->
    <div>
      <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
        Planes Populares Preconfigurados
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <button
          v-for="plan in planPresets"
          :key="plan.id"
          type="button"
          @click="applyPlan(plan)"
          class="p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between"
          :class="formData.costo_producto === plan.price && formData.tipo_producto === plan.cat
            ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
            : 'bg-[#141417] border-neutral-800/80 hover:border-neutral-700'"
        >
          <div>
            <span class="text-[10px] text-neutral-400 font-mono block uppercase tracking-wider">{{ plan.cat }}</span>
            <span class="text-xs font-semibold text-white block mt-0.5">{{ plan.name }}</span>
          </div>
          <div class="mt-2 text-xs font-mono font-semibold text-neutral-200">
            ${{ plan.price }} <span class="text-[10px] text-neutral-500 font-normal">/ {{ plan.freq === 1 ? 'mes' : 'año' }}</span>
          </div>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
      <!-- Tipo de Servicio / Categoría -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Categoría / Tipo de Servicio
        </label>
        <input
          v-model="formData.tipo_producto"
          type="text"
          placeholder="ej. Hosting Compartido, VPS"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
        />
      </div>

      <!-- Costo Base -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Precio Base <span class="text-rose-400">*</span>
        </label>
        <div class="relative flex items-center">
          <span class="px-3 py-2.5 rounded-l-xl bg-neutral-900 border border-r-0 border-neutral-800 text-xs text-neutral-500 font-mono select-none">
            {{ formData.id_forma_pago === 2 ? 'US$' : '$' }}
          </span>
          <input
            v-model.number="formData.costo_producto"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            class="w-full px-3.5 py-2.5 rounded-r-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
          />
        </div>
        <div v-if="selectedClientFacturacion === 1" class="mt-1.5 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 flex justify-between items-center font-mono">
          <span class="text-neutral-500 text-[10px]">Total + IVA:</span>
          <span class="font-bold text-white">${{ costoConIva }}</span>
        </div>
      </div>

      <!-- Moneda -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Moneda <span class="text-rose-400">*</span>
        </label>
        <select
          v-model="formData.id_forma_pago"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600"
        >
          <option :value="1">MXN (Pesos Mexicanos)</option>
          <option :value="2">USD (Dólares Americanos)</option>
        </select>
      </div>

      <!-- Frecuencia de Pago -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Frecuencia de Cobro
        </label>
        <select
          v-model="formData.frecuencia_pago"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600"
        >
          <option :value="2">Anual (1 año)</option>
          <option :value="1">Mensual (1 mes)</option>
          <option :value="3">Trimestral (3 meses)</option>
          <option :value="4">Semestral (6 meses)</option>
        </select>
      </div>
    </div>
  </div>
</template>
