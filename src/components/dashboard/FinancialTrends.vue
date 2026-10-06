<script setup lang="ts">
import type { MonthlyTrendItem } from '@/api/dashboard'

defineProps<{
  trends: MonthlyTrendItem[]
  maxTrendAmount: number
  formatCurrency: (amount: number, currency?: string) => string
}>()
</script>

<template>
  <div class="lg:col-span-2 p-5 sm:p-6 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-sm font-semibold text-white tracking-tight">Historial Financiero</h4>
        <p class="text-xs text-neutral-500">Facturación real cobrada en los últimos 6 meses</p>
      </div>
      <span class="text-xs text-neutral-400 font-mono flex items-center">
        <i class="pi pi-chart-bar mr-1 text-[11px]"></i> Mensual
      </span>
    </div>

    <!-- Gráfica de Barras Monocromática -->
    <div class="grid grid-cols-6 gap-2 sm:gap-4 items-end h-40 pt-4 pb-2 border-b border-neutral-800">
      <div
        v-for="item in trends"
        :key="item.mes"
        class="flex flex-col items-center h-full justify-end group cursor-pointer"
      >
        <div class="text-[10px] text-neutral-300 font-mono mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {{ formatCurrency(item.pagados) }}
        </div>
        <div
          class="w-full max-w-[32px] rounded-t bg-neutral-600 group-hover:bg-neutral-200 transition-all duration-150 min-h-[4px]"
          :style="{ height: `${Math.max(6, (item.pagados / maxTrendAmount) * 100)}%` }"
        ></div>
        <span class="text-[10px] font-mono text-neutral-500 mt-2 uppercase tracking-wider">{{ item.mes }}</span>
      </div>
    </div>
  </div>
</template>
