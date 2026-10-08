<script setup lang="ts">
import type { PagoStats } from '@/api/pagos'

defineProps<{
  stats: PagoStats
  activeFilter: string
}>()

const emit = defineEmits<{
  (e: 'select-filter', filter: string): void
}>()

function formatCurrency(val: number, moneda = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda,
  }).format(val || 0)
}
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    <!-- 1. Recaudación Total MXN -->
    <div
      @click="emit('select-filter', 'pagados')"
      :class="[
        'p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none group relative',
        activeFilter === 'pagados'
          ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#141417]'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Cobrado (MXN)</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 flex items-center justify-center">
          <i class="pi pi-check-circle text-xs"></i>
        </div>
      </div>
      <div class="mt-2.5 text-2xl font-mono font-bold text-white tracking-tight">
        {{ formatCurrency(stats.monto_cobrado_mxn, 'MXN') }}
      </div>
      <div class="mt-1 text-[10px] text-neutral-500 flex items-center space-x-1.5 font-mono">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>{{ stats.total_pagados }} pagos liquidados</span>
      </div>
    </div>

    <!-- 2. Recaudación Total USD -->
    <div
      @click="emit('select-filter', 'pagados')"
      :class="[
        'p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none group relative',
        activeFilter === 'pagados'
          ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#141417]'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Cobrado (USD)</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-dollar text-xs"></i>
        </div>
      </div>
      <div class="mt-2.5 text-2xl font-mono font-bold text-white tracking-tight">
        {{ formatCurrency(stats.monto_cobrado_usd, 'USD') }}
      </div>
      <div class="mt-1 text-[10px] text-neutral-500 font-mono">
        Cuentas internacionales
      </div>
    </div>

    <!-- 3. Pendiente de Cobro MXN -->
    <div
      @click="emit('select-filter', 'pendientes')"
      :class="[
        'p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none group relative',
        activeFilter === 'pendientes'
          ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#141417]'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Por Cobrar (MXN)</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 flex items-center justify-center">
          <i class="pi pi-clock text-xs"></i>
        </div>
      </div>
      <div class="mt-2.5 text-2xl font-mono font-bold text-amber-400 tracking-tight">
        {{ formatCurrency(stats.monto_pendiente_mxn, 'MXN') }}
      </div>
      <div class="mt-1 text-[10px] text-neutral-500 flex items-center space-x-1.5 font-mono">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        <span>{{ stats.total_pendientes }} por conciliar</span>
      </div>
    </div>

    <!-- 4. Pendiente de Cobro USD -->
    <div
      @click="emit('select-filter', 'pendientes')"
      :class="[
        'p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none group relative',
        activeFilter === 'pendientes'
          ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
          : 'bg-[#0c0c0e] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#141417]'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Por Cobrar (USD)</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center">
          <i class="pi pi-hourglass text-xs"></i>
        </div>
      </div>
      <div class="mt-2.5 text-2xl font-mono font-bold text-amber-400 tracking-tight">
        {{ formatCurrency(stats.monto_pendiente_usd, 'USD') }}
      </div>
      <div class="mt-1 text-[10px] text-neutral-500 font-mono">
        Moneda extranjera
      </div>
    </div>
  </div>
</template>
