<script setup lang="ts">
import type { DashboardKPIs } from '@/api/dashboard'

defineProps<{
  kpis: DashboardKPIs
  formatCurrency: (val: number, cur?: string) => string
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Facturación Mensual -->
    <div class="p-5 rounded-xl bg-[#0c0c0e] border border-neutral-800 transition-colors duration-150 hover:border-neutral-700">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Facturado este Mes</span>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-wallet text-xs"></i>
        </div>
      </div>
      <div class="mt-3">
        <div class="text-2xl font-semibold text-white tracking-tight font-mono">
          {{ formatCurrency(kpis.total_pagados_mes_monto) }}
        </div>
        <div class="mt-1 text-[11px] text-neutral-500 font-medium">
          {{ kpis.total_pagados_mes_count }} cobros conciliados
        </div>
      </div>
    </div>

    <!-- Por Cobrar / Pendiente -->
    <div class="p-5 rounded-xl bg-[#0c0c0e] border border-neutral-800 transition-colors duration-150 hover:border-neutral-700">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Por Cobrar (Pendiente)</span>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-clock text-xs"></i>
        </div>
      </div>
      <div class="mt-3">
        <div class="text-2xl font-semibold text-neutral-200 tracking-tight font-mono">
          {{ formatCurrency(kpis.total_pendientes_monto) }}
        </div>
        <div class="mt-1 text-[11px] text-neutral-500 font-medium">
          {{ kpis.total_pendientes_count }} facturas pendientes
        </div>
      </div>
    </div>

    <!-- Clientes Totales -->
    <div class="p-5 rounded-xl bg-[#0c0c0e] border border-neutral-800 transition-colors duration-150 hover:border-neutral-700">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Clientes Totales</span>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-users text-xs"></i>
        </div>
      </div>
      <div class="mt-3">
        <div class="text-2xl font-semibold text-white tracking-tight font-mono">
          {{ kpis.total_clientes }}
        </div>
        <div class="mt-1 text-[11px] text-neutral-500 font-medium">
          Cartera de clientes activa
        </div>
      </div>
    </div>

    <!-- Vencimientos Próximos -->
    <div class="p-5 rounded-xl bg-[#0c0c0e] border border-neutral-800 transition-colors duration-150 hover:border-neutral-700">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Vencimientos (7 días)</span>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
          <i class="pi pi-calendar text-xs"></i>
        </div>
      </div>
      <div class="mt-3">
        <div class="text-2xl font-semibold text-white tracking-tight font-mono">
          {{ kpis.prox_7_dias_count }}
        </div>
        <div class="mt-1 text-[11px] text-neutral-500 font-medium">
          Servicios por renovar
        </div>
      </div>
    </div>
  </div>
</template>
