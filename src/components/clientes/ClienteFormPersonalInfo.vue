<script setup lang="ts">
defineProps<{
  formData: {
    empresa: string
    nombre: string
    apellido: string
    correo?: string | null
    telefono?: string | null
    requiereFacturacion: boolean
  }
}>()

const emit = defineEmits<{
  (e: 'toggle-facturacion'): void
}>()
</script>

<template>
  <div class="p-5 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800/80">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-user text-xs"></i>
        </div>
        <div>
          <h2 class="text-xs font-semibold text-neutral-200">Información del Titular & Empresa</h2>
          <p class="text-[11px] text-neutral-500">Datos principales para identificación y contacto</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Empresa -->
      <div class="sm:col-span-2 lg:col-span-1">
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">
          Nombre de la Empresa <span class="text-red-400">*</span>
        </label>
        <input
          v-model="formData.empresa"
          type="text"
          required
          placeholder="ej. Innovaciones Digitales S.A."
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <!-- Nombre -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">
          Nombre(s) <span class="text-red-400">*</span>
        </label>
        <input
          v-model="formData.nombre"
          type="text"
          required
          placeholder="Juan Carlos"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <!-- Apellido -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">
          Apellidos
        </label>
        <input
          v-model="formData.apellido"
          type="text"
          placeholder="Pérez García"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <!-- Correo -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">
          Correo Electrónico <span class="text-red-400">*</span>
        </label>
        <input
          v-model="formData.correo"
          type="email"
          required
          placeholder="cliente@empresa.com"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 font-mono placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <!-- Teléfono -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 mb-1">
          Teléfono / WhatsApp <span class="text-red-400">*</span>
        </label>
        <input
          v-model="formData.telefono"
          type="tel"
          required
          placeholder="55 1234 5678"
          class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <!-- Switch Facturación -->
      <div class="sm:col-span-2 lg:col-span-1 flex items-end">
        <div
          @click="emit('toggle-facturacion')"
          :class="[
            'w-full p-2.5 rounded-lg border flex items-center justify-between cursor-pointer select-none transition-colors',
            formData.requiereFacturacion
              ? 'bg-neutral-900 border-neutral-700 text-white'
              : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-300'
          ]"
        >
          <div class="flex items-center space-x-2">
            <i class="pi pi-file-o text-neutral-400"></i>
            <div>
              <span class="text-xs font-medium block">Requiere Facturación</span>
              <span class="text-[10px] text-neutral-500">Activa campos de RFC y Razón Social</span>
            </div>
          </div>
          <div
            :class="[
              'w-8 h-4.5 rounded-full p-0.5 transition-colors relative flex items-center',
              formData.requiereFacturacion ? 'bg-white' : 'bg-neutral-800'
            ]"
          >
            <div
              :class="[
                'w-3.5 h-3.5 rounded-full transition-transform',
                formData.requiereFacturacion ? 'translate-x-3.5 bg-neutral-950' : 'translate-x-0 bg-neutral-500'
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
