<script setup lang="ts">
import type { DominioStats } from '@/api/dominios'

defineProps<{
  stats: DominioStats
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
        'p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group',
        activeFilter === 'todos'
          ? 'bg-neutral-900 border-neutral-600 shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900/60'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium">Total Dominios</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-globe text-xs"></i>
        </div>
      </div>
      <div class="mt-2 text-2xl font-semibold text-white tracking-tight font-mono">{{ stats.total }}</div>
      <div class="mt-1 text-[10px] text-neutral-500">Registrados en suite</div>
    </div>

    <!-- Activos -->
    <div
      @click="emit('select-filter', 'activos')"
      :class="[
        'p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group',
        activeFilter === 'activos'
          ? 'bg-neutral-900 border-neutral-600 shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900/60'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium">Activos</span>
        <div class="w-7 h-7 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 flex items-center justify-center">
          <i class="pi pi-check text-xs"></i>
        </div>
      </div>
      <div class="mt-2 text-2xl font-semibold text-white tracking-tight font-mono">{{ stats.activos }}</div>
      <div class="mt-1 text-[10px] text-emerald-500/80 flex items-center space-x-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>En línea & resolviendo</span>
      </div>
    </div>

    <!-- Por Vencer (30 días) -->
    <div
      @click="emit('select-filter', 'por_vencer')"
      :class="[
        'p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group',
        activeFilter === 'por_vencer'
          ? 'bg-neutral-900 border-neutral-600 shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900/60'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium">Próx. 30 Días</span>
        <div class="w-7 h-7 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-400 flex items-center justify-center">
          <i class="pi pi-calendar text-xs"></i>
        </div>
      </div>
      <div class="mt-2 text-2xl font-semibold text-white tracking-tight font-mono">{{ stats.por_vencer_30d }}</div>
      <div class="mt-1 text-[10px] text-amber-500/80">Por renovar</div>
    </div>

    <!-- Vencidos -->
    <div
      @click="emit('select-filter', 'vencidos')"
      :class="[
        'p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group',
        activeFilter === 'vencidos'
          ? 'bg-neutral-900 border-neutral-600 shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900/60'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium">Expirados</span>
        <div class="w-7 h-7 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-400 flex items-center justify-center">
          <i class="pi pi-exclamation-triangle text-xs"></i>
        </div>
      </div>
      <div class="mt-2 text-2xl font-semibold text-rose-400 tracking-tight font-mono">{{ stats.vencidos }}</div>
      <div class="mt-1 text-[10px] text-rose-500/80">Requieren renovación</div>
    </div>

    <!-- Pendientes de Pago -->
    <div
      @click="emit('select-filter', 'pendientes_pago')"
      :class="[
        'col-span-2 sm:col-span-1 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group',
        activeFilter === 'pendientes_pago'
          ? 'bg-neutral-900 border-neutral-600 shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900/60'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium">Cobro Pendiente</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center">
          <i class="pi pi-clock text-xs"></i>
        </div>
      </div>
      <div class="mt-2 text-2xl font-semibold text-white tracking-tight font-mono">{{ stats.pendientes_pago }}</div>
      <div class="mt-1 text-[10px] text-neutral-500">Por conciliar</div>
    </div>
  </div>
</template>
