<script setup lang="ts">
import type { ServiceDistribution } from '@/api/dashboard'

defineProps<{
  distribution: ServiceDistribution
  formatCurrency: (amount: number, currency?: string) => string
}>()
</script>

<template>
  <div class="p-5 sm:p-6 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-4">
    <div>
      <h4 class="text-sm font-semibold text-white tracking-tight">Distribución de Ingresos</h4>
      <p class="text-xs text-neutral-500">Por tipo de infraestructura activa</p>
    </div>

    <div class="space-y-3 pt-2 text-xs">
      <div class="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="w-2 h-2 rounded-full bg-neutral-300"></div>
          <span class="text-neutral-300 font-medium">Dominios Web</span>
        </div>
        <span class="font-semibold text-white font-mono">{{ formatCurrency(distribution.dominios) }}</span>
      </div>

      <div class="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="w-2 h-2 rounded-full bg-neutral-500"></div>
          <span class="text-neutral-300 font-medium">Planes de Hosting</span>
        </div>
        <span class="font-semibold text-white font-mono">{{ formatCurrency(distribution.hosting) }}</span>
      </div>

      <div class="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="w-2 h-2 rounded-full bg-neutral-700"></div>
          <span class="text-neutral-300 font-medium">Servicios Manuales</span>
        </div>
        <span class="font-semibold text-white font-mono">{{ formatCurrency(distribution.servicios) }}</span>
      </div>
    </div>
  </div>
</template>
