<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  formData: {
    usuario?: string | null
    contrasena?: string | null
    contrasena_normal?: string | null
    url_cpanel?: string | null
  }
}>()

const emit = defineEmits<{
  (e: 'generate-password'): void
}>()

const showPassword = ref(false)
</script>

<template>
  <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-key text-xs"></i>
        </div>
        <div>
          <h2 class="text-sm font-semibold text-white">Credenciales & Accesos</h2>
          <p class="text-[11px] text-neutral-400 font-sans">Accesos administrativos de WordPress y cPanel</p>
        </div>
      </div>
      <button
        type="button"
        @click="emit('generate-password')"
        class="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-medium flex items-center space-x-1.5 transition-colors"
      >
        <i class="pi pi-bolt text-xs"></i>
        <span>Generar Clave</span>
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Usuario Admin -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Usuario Administrador
        </label>
        <input
          v-model="formData.usuario"
          type="text"
          placeholder="admin / contacto@empresa.com"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
        />
      </div>

      <!-- Contraseña Admin -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Contraseña Administrador
        </label>
        <div class="relative">
          <input
            v-model="formData.contrasena_normal"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Clave de acceso"
            class="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
          >
            <i :class="showPassword ? 'pi pi-eye-slash text-xs' : 'pi pi-eye text-xs'"></i>
          </button>
        </div>
      </div>

      <!-- URL cPanel -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          URL cPanel
        </label>
        <input
          v-model="formData.url_cpanel"
          type="url"
          placeholder="https://cpanel.empresa.com:2083/"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono text-[11px]"
        />
      </div>
    </div>
  </div>
</template>
