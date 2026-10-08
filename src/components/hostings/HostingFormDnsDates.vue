<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  formData: {
    ns1?: string
    ns2?: string
    ns3?: string
    ns4?: string
    ns5?: string
    ns6?: string
    estado_producto?: number
    fecha_contratacion?: string
    fecha_pago?: string
  }
}>()

const showAdvancedNs = ref(false)

function applyPuvnexDns() {
  props.formData.ns1 = 'ns1.puvnex.io'
  props.formData.ns2 = 'ns2.puvnex.io'
}

function applyCloudflareDns() {
  props.formData.ns1 = 'ns1.cloudflare.com'
  props.formData.ns2 = 'ns2.cloudflare.com'
}

function clearDns() {
  props.formData.ns1 = ''
  props.formData.ns2 = ''
  props.formData.ns3 = ''
  props.formData.ns4 = ''
  props.formData.ns5 = ''
  props.formData.ns6 = ''
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-server text-xs"></i>
        </div>
        <div>
          <h2 class="text-sm font-semibold text-white">DNS & Fechas de Vigencia</h2>
          <p class="text-[11px] text-neutral-400 font-sans">Servidores de nombres y calendario de renovación</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          type="button"
          @click="applyPuvnexDns"
          class="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] font-medium transition-colors"
        >
          Preset Puvnex
        </button>
        <button
          type="button"
          @click="applyCloudflareDns"
          class="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] font-medium transition-colors"
        >
          Preset Cloudflare
        </button>
        <button
          type="button"
          @click="clearDns"
          class="px-2.5 py-1 rounded-lg bg-[#141417] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-[10px] font-medium transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Nameservers Primarios -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Nameserver 1 (NS1)
        </label>
        <input
          v-model="formData.ns1"
          type="text"
          placeholder="ns1.dns.com"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono text-[11px]"
        />
      </div>

      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Nameserver 2 (NS2)
        </label>
        <input
          v-model="formData.ns2"
          type="text"
          placeholder="ns2.dns.com"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono text-[11px]"
        />
      </div>
    </div>

    <!-- Toggle Advanced NS -->
    <div class="pt-0.5">
      <button
        type="button"
        @click="showAdvancedNs = !showAdvancedNs"
        class="text-xs text-neutral-400 hover:text-white font-medium flex items-center space-x-1.5 transition-colors"
      >
        <i class="pi" :class="showAdvancedNs ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
        <span>{{ showAdvancedNs ? 'Ocultar NS3 - NS6 adicionales' : 'Mostrar Nameservers adicionales (NS3, NS4, NS5, NS6)' }}</span>
      </button>

      <div v-if="showAdvancedNs" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3 animate-fadeIn">
        <div>
          <label class="block text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-1">NS3</label>
          <input
            v-model="formData.ns3"
            type="text"
            placeholder="ns3.dns.com"
            class="w-full px-3 py-2 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white font-mono text-[11px] focus:outline-none focus:border-neutral-600"
          />
        </div>
        <div>
          <label class="block text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-1">NS4</label>
          <input
            v-model="formData.ns4"
            type="text"
            placeholder="ns4.dns.com"
            class="w-full px-3 py-2 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white font-mono text-[11px] focus:outline-none focus:border-neutral-600"
          />
        </div>
        <div>
          <label class="block text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-1">NS5</label>
          <input
            v-model="formData.ns5"
            type="text"
            placeholder="ns5.dns.com"
            class="w-full px-3 py-2 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white font-mono text-[11px] focus:outline-none focus:border-neutral-600"
          />
        </div>
        <div>
          <label class="block text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-1">NS6</label>
          <input
            v-model="formData.ns6"
            type="text"
            placeholder="ns6.dns.com"
            class="w-full px-3 py-2 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white font-mono text-[11px] focus:outline-none focus:border-neutral-600"
          />
        </div>
      </div>
    </div>

    <!-- Fechas y Estado -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-neutral-800/80">
      <!-- Fecha Contratación -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Fecha de Contratación <span class="text-rose-400">*</span>
        </label>
        <input
          v-model="formData.fecha_contratacion"
          type="date"
          required
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600 [color-scheme:dark]"
        />
      </div>

      <!-- Fecha Pago / Renovación -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Fecha de Renovación / Pago <span class="text-rose-400">*</span>
        </label>
        <input
          v-model="formData.fecha_pago"
          type="date"
          required
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600 [color-scheme:dark]"
        />
      </div>

      <!-- Estado -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Estado del Servicio
        </label>
        <select
          v-model="formData.estado_producto"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600"
        >
          <option :value="1">Activo</option>
          <option :value="0">Inactivo / Suspendido</option>
        </select>
      </div>
    </div>
  </div>
</template>
