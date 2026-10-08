<script setup lang="ts">
defineProps<{
  formData: {
    fecha?: string
    fecha_limite_pago?: string
    fecha_pago?: string
    estatus?: number
    pago_recurrente?: number
    frecuencia_pago?: number
  }
}>()
</script>

<template>
  <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 shadow-sm space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800/80">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-calendar text-xs"></i>
        </div>
        <div>
          <h2 class="text-sm font-semibold text-white">Fechas & Recurrencia</h2>
          <p class="text-[11px] text-neutral-400">Plazos de vencimiento y programación de cobros</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Fecha Emisión -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Fecha de Emisión <span class="text-rose-400">*</span>
        </label>
        <input
          v-model="formData.fecha"
          type="date"
          required
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono [color-scheme:dark]"
        />
      </div>

      <!-- Fecha Límite de Pago -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Fecha Límite / Vencimiento
        </label>
        <input
          v-model="formData.fecha_limite_pago"
          type="date"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono [color-scheme:dark]"
        />
      </div>

      <!-- Fecha de Pago (si está pagado) -->
      <div v-if="formData.estatus === 1">
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Fecha de Acreditación
        </label>
        <input
          v-model="formData.fecha_pago"
          type="date"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono [color-scheme:dark]"
        />
      </div>

      <!-- Frecuencia / Recurrencia -->
      <div class="sm:col-span-2 lg:col-span-1">
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Periodicidad del Cobro
        </label>
        <select
          v-model="formData.frecuencia_pago"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600 font-medium"
        >
          <option :value="0">Cobro Único / No recurrente</option>
          <option :value="1">Mensual</option>
          <option :value="2">Anual</option>
        </select>
      </div>
    </div>
  </div>
</template>
