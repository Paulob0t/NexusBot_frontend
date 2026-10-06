<script setup lang="ts">
defineProps<{
  formData: {
    rfc?: string | null
    rsocial?: string | null
    especificacion?: string | null
  }
}>()
</script>

<template>
  <div class="p-5 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800/80">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-receipt text-xs"></i>
        </div>
        <div>
          <h2 class="text-xs font-semibold text-neutral-200">Datos Fiscales y de Facturación</h2>
          <p class="text-[11px] text-neutral-500">Información para emisión de CFDI y timbrado fiscal</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">
          RFC <span class="text-red-400">*</span>
        </label>
        <input
          v-model="formData.rfc"
          type="text"
          required
          placeholder="XAXX010101000"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 uppercase placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 font-mono transition-colors"
        />
      </div>

      <div class="sm:col-span-2">
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">
          Razón Social / Nombre Fiscal <span class="text-red-400">*</span>
        </label>
        <input
          v-model="formData.rsocial"
          type="text"
          required
          placeholder="Innovaciones Digitales y Comercio S.A. de C.V."
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <div class="sm:col-span-3">
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">
          Régimen Fiscal / Especificaciones
        </label>
        <input
          v-model="formData.especificacion"
          type="text"
          placeholder="ej. 601 General de Ley Personas Morales / Uso CFDI: G03"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>
    </div>
  </div>
</template>
