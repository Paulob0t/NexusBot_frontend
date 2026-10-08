<script setup lang="ts">
import type { HostingStats } from '@/api/hostings'

defineProps<{
  stats: HostingStats
  activeFilter: string
}>()

const emit = defineEmits<{
  (e: 'select-filter', filter: string): void
}>()
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
    <!-- Total -->
    <div
      @click="emit('select-filter', 'todos')"
      :class="[
        'p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none group relative',
        activeFilter === 'todos'
          ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#141417]'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Total Servidores</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-server text-xs"></i>
        </div>
      </div>
      <div class="mt-2.5 text-2xl font-mono font-bold text-white tracking-tight">{{ stats.total }}</div>
      <div class="mt-1 text-[10px] text-neutral-500 flex items-center space-x-1 font-mono">
        <span>Instancias en Cloud</span>
      </div>
    </div>

    <!-- Activos -->
    <div
      @click="emit('select-filter', 'activos')"
      :class="[
        'p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none group relative',
        activeFilter === 'activos'
          ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#141417]'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Activos</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 flex items-center justify-center">
          <i class="pi pi-check-circle text-xs"></i>
        </div>
      </div>
      <div class="mt-2.5 text-2xl font-mono font-bold text-emerald-400 tracking-tight">{{ stats.activos }}</div>
      <div class="mt-1 text-[10px] text-neutral-500 flex items-center space-x-1.5 font-mono">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>Operativo</span>
      </div>
    </div>

    <!-- Por Vencer (30 días) -->
    <div
      @click="emit('select-filter', 'por_vencer_30')"
      :class="[
        'p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none group relative',
        activeFilter === 'por_vencer_30'
          ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#141417]'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Próx. 30 Días</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 flex items-center justify-center">
          <i class="pi pi-calendar-plus text-xs"></i>
        </div>
      </div>
      <div class="mt-2.5 text-2xl font-mono font-bold text-amber-400 tracking-tight">{{ stats.por_vencer_30d }}</div>
      <div class="mt-1 text-[10px] text-neutral-500 flex items-center space-x-1.5 font-mono">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        <span>Por renovar</span>
      </div>
    </div>

    <!-- Por Vencer (7 días crítico) -->
    <div
      @click="emit('select-filter', 'por_vencer_7')"
      :class="[
        'p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none group relative',
        activeFilter === 'por_vencer_7'
          ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#141417]'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Crítico (≤7 Días)</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-orange-400 flex items-center justify-center">
          <i class="pi pi-clock text-xs"></i>
        </div>
      </div>
      <div class="mt-2.5 text-2xl font-mono font-bold text-orange-400 tracking-tight">{{ stats.por_vencer_7d }}</div>
      <div class="mt-1 text-[10px] text-neutral-500 flex items-center space-x-1.5 font-mono">
        <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
        <span>Urgente aviso</span>
      </div>
    </div>

    <!-- Vencidos -->
    <div
      @click="emit('select-filter', 'vencidos')"
      :class="[
        'col-span-2 sm:col-span-1 p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none group relative',
        activeFilter === 'vencidos'
          ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#141417]'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Vencidos</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-rose-400 flex items-center justify-center">
          <i class="pi pi-exclamation-triangle text-xs"></i>
        </div>
      </div>
      <div class="mt-2.5 text-2xl font-mono font-bold text-rose-400 tracking-tight">{{ stats.vencidos }}</div>
      <div class="mt-1 text-[10px] text-neutral-500 flex items-center space-x-1.5 font-mono">
        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        <span>Suspendidos</span>
      </div>
    </div>
  </div>
</template>
