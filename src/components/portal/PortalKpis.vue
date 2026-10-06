<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  totalSitios: number
  totalPendientes: number
  totalTicketsAbiertos: number
  totalHostings: number
  totalDominios: number
}>()

const router = useRouter()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- 1. Sitios Web -->
    <div
      @click="router.push('/dominios')"
      class="group cursor-pointer rounded-xl bg-[#0c0c0e] hover:bg-[#121215] border border-neutral-800 hover:border-neutral-700 p-4 sm:p-5 transition-colors"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-neutral-400">Sitios Web</span>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-400 border border-neutral-800 flex items-center justify-center">
          <i class="pi pi-globe text-xs"></i>
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-xl sm:text-2xl font-bold text-white font-mono">{{ totalSitios }}</span>
        <span class="text-xs text-neutral-500 font-mono">activos</span>
      </div>
    </div>

    <!-- 2. Pagos Pendientes -->
    <div
      @click="router.push('/pagos')"
      class="group cursor-pointer rounded-xl bg-[#0c0c0e] hover:bg-[#121215] border p-4 sm:p-5 transition-colors"
      :class="totalPendientes > 0 ? 'border-amber-900/50 hover:border-amber-700/60' : 'border-neutral-800 hover:border-neutral-700'"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium" :class="totalPendientes > 0 ? 'text-amber-400' : 'text-neutral-400'">
          Pagos Pendientes
        </span>
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center border"
          :class="totalPendientes > 0 ? 'bg-amber-950/40 text-amber-400 border-amber-900/50' : 'bg-neutral-900 text-neutral-400 border-neutral-800'"
        >
          <i :class="['pi', totalPendientes > 0 ? 'pi-exclamation-circle' : 'pi-check', 'text-xs']"></i>
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span
          class="text-xl sm:text-2xl font-bold font-mono"
          :class="totalPendientes > 0 ? 'text-amber-400' : 'text-neutral-200'"
        >
          {{ totalPendientes }}
        </span>
        <span class="text-xs text-neutral-500 font-mono">por liquidar</span>
      </div>
    </div>

    <!-- 3. Soporte / Tickets -->
    <div
      @click="router.push('/solicitudes')"
      class="group cursor-pointer rounded-xl bg-[#0c0c0e] hover:bg-[#121215] border border-neutral-800 hover:border-neutral-700 p-4 sm:p-5 transition-colors"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-neutral-400">Tickets de Soporte</span>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-400 border border-neutral-800 flex items-center justify-center">
          <i class="pi pi-ticket text-xs"></i>
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-xl sm:text-2xl font-bold text-white font-mono">{{ totalTicketsAbiertos }}</span>
        <span class="text-xs text-neutral-500 font-mono">en atención</span>
      </div>
    </div>

    <!-- 4. Hosting y Dominios -->
    <div
      @click="router.push('/hostings')"
      class="group cursor-pointer rounded-xl bg-[#0c0c0e] hover:bg-[#121215] border border-neutral-800 hover:border-neutral-700 p-4 sm:p-5 transition-colors"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-neutral-400">Servicios Hosting</span>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-400 border border-neutral-800 flex items-center justify-center">
          <i class="pi pi-server text-xs"></i>
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-xl sm:text-2xl font-bold text-white font-mono">{{ totalHostings }}</span>
        <span class="text-xs text-neutral-500 font-mono">planes activos</span>
      </div>
    </div>
  </div>
</template>
