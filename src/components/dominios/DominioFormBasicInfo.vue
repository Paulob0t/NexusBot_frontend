<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  formData: {
    url_dominio: string
    proveedor?: string | null
    url_admin?: string | null
    url_cpanel?: string | null
  }
}>()

const emit = defineEmits<{
  (e: 'domain-changed', domain: string): void
}>()

const popularProviders = ['Puvnex', 'GoDaddy', 'Namecheap', 'Hostinger', 'Cloudflare', 'Google Domains']

function setProvider(p: string) {
  props.formData.proveedor = p
}

watch(
  () => props.formData.url_dominio,
  (val) => {
    if (val) {
      let clean = val.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
      props.formData.url_dominio = clean
      if (!props.formData.url_admin || props.formData.url_admin.includes('/wp-login.php')) {
        props.formData.url_admin = clean ? `https://${clean}/wp-login.php` : ''
      }
      if (!props.formData.url_cpanel || props.formData.url_cpanel.includes(':2083/')) {
        props.formData.url_cpanel = clean ? `https://cpanel.${clean}:2083/` : ''
      }
      emit('domain-changed', clean)
    }
  }
)
</script>

<template>
  <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-globe text-xs"></i>
        </div>
        <div>
          <h2 class="text-sm font-semibold text-white">Dominio & Proveedor</h2>
          <p class="text-[11px] text-neutral-400 font-sans">Identificador web y registrador del dominio</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Dominio URL -->
      <div class="sm:col-span-2 lg:col-span-1">
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Nombre de Dominio <span class="text-rose-400">*</span>
        </label>
        <div class="relative flex items-center">
          <span class="px-3 py-2.5 rounded-l-xl bg-neutral-900 border border-r-0 border-neutral-800 text-xs text-neutral-500 font-mono select-none">
            https://
          </span>
          <input
            v-model="formData.url_dominio"
            type="text"
            required
            placeholder="empresa.com"
            class="w-full px-3.5 py-2.5 rounded-r-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
          />
        </div>
      </div>

      <!-- Proveedor -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Proveedor Registrador <span class="text-rose-400">*</span>
        </label>
        <input
          v-model="formData.proveedor"
          type="text"
          required
          placeholder="ej. Puvnex / GoDaddy"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 mb-2"
        />
        <!-- Quick pills -->
        <div class="flex flex-wrap gap-1">
          <button
            v-for="prov in popularProviders"
            :key="prov"
            type="button"
            @click="setProvider(prov)"
            class="px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors border"
            :class="formData.proveedor === prov ? 'bg-neutral-800 text-white border-neutral-600 font-semibold' : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'"
          >
            {{ prov }}
          </button>
        </div>
      </div>

      <!-- URL Admin WordPress -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          URL Administrador (WP)
        </label>
        <input
          v-model="formData.url_admin"
          type="url"
          placeholder="https://empresa.com/wp-login.php"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono text-[11px]"
        />
        <span class="text-[10px] text-neutral-500 mt-1 block">Acceso al panel administrativo o WordPress</span>
      </div>
    </div>
  </div>
</template>
