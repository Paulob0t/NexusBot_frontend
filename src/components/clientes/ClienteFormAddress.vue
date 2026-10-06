<script setup lang="ts">
defineProps<{
  formData: {
    calle?: string | null
    next?: string | null
    nint?: string | null
    col?: string | null
    cp?: string | null
    estado?: string | null
    ciudad?: string | null
    pais?: string | null
  }
}>()
</script>

<template>
  <div class="p-5 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800/80">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-map-marker text-xs"></i>
        </div>
        <div>
          <h2 class="text-xs font-semibold text-neutral-200">Domicilio & Ubicación</h2>
          <p class="text-[11px] text-neutral-500">Dirección para registro y facturación</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="sm:col-span-2">
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">Calle</label>
        <input
          v-model="formData.calle"
          type="text"
          placeholder="Av. Insurgentes Sur"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">N° Exterior</label>
        <input
          v-model="formData.next"
          type="text"
          placeholder="123"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">N° Interior</label>
        <input
          v-model="formData.nint"
          type="text"
          placeholder="Piso 4"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">Colonia</label>
        <input
          v-model="formData.col"
          type="text"
          placeholder="Del Valle"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">Código Postal</label>
        <input
          v-model="formData.cp"
          type="text"
          placeholder="03100"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors font-mono"
        />
      </div>
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">Estado</label>
        <input
          v-model="formData.estado"
          type="text"
          placeholder="Ciudad de México"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">Ciudad / Municipio</label>
        <input
          v-model="formData.ciudad"
          type="text"
          placeholder="Benito Juárez"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>
    </div>
  </div>
</template>
