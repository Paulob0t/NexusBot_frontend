<script setup lang="ts">
import type { ClienteStats } from '@/api/clientes'

defineProps<{
  stats: ClienteStats
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
        'p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none group',
        activeFilter === 'todos'
          ? 'bg-[#141417] border-neutral-600'
          : 'bg-[#0c0c0e] border-neutral-800 hover:border-neutral-700'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Total Clientes</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-users text-xs"></i>
        </div>
      </div>
      <div class="mt-2 text-xl font-semibold text-white tracking-tight font-mono">{{ stats.total }}</div>
      <div class="mt-1 text-[10px] font-mono text-neutral-500">Registrados en Suite</div>
    </div>

    <!-- Activos -->
    <div
      @click="emit('select-filter', 'activos')"
      :class="[
        'p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none group',
        activeFilter === 'activos'
          ? 'bg-[#141417] border-neutral-600'
          : 'bg-[#0c0c0e] border-neutral-800 hover:border-neutral-700'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Activos</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-check-circle text-xs"></i>
        </div>
      </div>
      <div class="mt-2 text-xl font-semibold text-white tracking-tight font-mono">{{ stats.activos }}</div>
      <div class="mt-1 text-[10px] font-mono text-neutral-500">Operación regular</div>
    </div>

    <!-- Pagos Pendientes -->
    <div
      @click="emit('select-filter', 'pendientes')"
      :class="[
        'p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none group',
        activeFilter === 'pendientes'
          ? 'bg-[#141417] border-neutral-600'
          : 'bg-[#0c0c0e] border-neutral-800 hover:border-neutral-700'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Con Pagos Pend.</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-clock text-xs"></i>
        </div>
      </div>
      <div class="mt-2 text-xl font-semibold text-neutral-200 tracking-tight font-mono">{{ stats.con_pagos_pendientes }}</div>
      <div class="mt-1 text-[10px] font-mono text-neutral-500">Cobranza activa</div>
    </div>

    <!-- Transferidos -->
    <div
      @click="emit('select-filter', 'transferidos')"
      :class="[
        'p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none group',
        activeFilter === 'transferidos'
          ? 'bg-[#141417] border-neutral-600'
          : 'bg-[#0c0c0e] border-neutral-800 hover:border-neutral-700'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Transferidos</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-sync text-xs"></i>
        </div>
      </div>
      <div class="mt-2 text-xl font-semibold text-neutral-200 tracking-tight font-mono">{{ stats.transferidos }}</div>
      <div class="mt-1 text-[10px] font-mono text-neutral-500">Entre sistemas</div>
    </div>

    <!-- Eliminados -->
    <div
      @click="emit('select-filter', 'eliminados')"
      :class="[
        'col-span-2 sm:col-span-1 p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none group',
        activeFilter === 'eliminados'
          ? 'bg-[#141417] border-neutral-600'
          : 'bg-[#0c0c0e] border-neutral-800 hover:border-neutral-700'
      ]"
    >
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Bajas</span>
        <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-trash text-xs"></i>
        </div>
      </div>
      <div class="mt-2 text-xl font-semibold text-neutral-200 tracking-tight font-mono">{{ stats.eliminados }}</div>
      <div class="mt-1 text-[10px] font-mono text-neutral-500">Inactivos</div>
    </div>
  </div>
</template>
