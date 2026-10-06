<script setup lang="ts">
import type { ClienteListItem } from '@/api/clientes'

defineProps<{
  clientes: ClienteListItem[]
  viewMode: 'table' | 'cards'
  isSuperAdmin: boolean
  getInitials: (name: string) => string
  formatWhatsAppLink: (phone: string | null) => string
}>()

const emit = defineEmits<{
  (e: 'view-detail', id: number): void
  (e: 'edit', client: ClienteListItem): void
}>()
</script>

<template>
  <div
    :class="[
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5',
      viewMode === 'table' ? 'md:hidden' : ''
    ]"
  >
    <div
      v-for="item in clientes"
      :key="item.id"
      class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-3.5 flex flex-col justify-between transition-colors hover:border-neutral-700"
    >
      <div>
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-medium text-xs text-neutral-300 font-mono">
              {{ getInitials(item.empresa) }}
            </div>
            <div class="min-w-0">
              <h4 class="font-medium text-white text-xs truncate max-w-[170px]">{{ item.empresa }}</h4>
              <span class="text-[10px] text-neutral-500 font-mono">#{{ item.id }}</span>
            </div>
          </div>
          <span
            v-if="item.total_pagos_pendientes > 0"
            class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-950/40 text-red-400 border border-red-900/50"
          >
            {{ item.total_pagos_pendientes }} Pend.
          </span>
          <span
            v-else
            class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800"
          >
            Al día
          </span>
        </div>

        <div class="mt-3 pt-3 border-t border-neutral-900 space-y-1.5 text-xs text-neutral-400">
          <div class="flex items-center justify-between">
            <span class="text-neutral-500 text-[11px]">Contacto:</span>
            <span class="text-neutral-200 font-medium truncate max-w-[140px] text-[11px]">{{ item.nombre_contacto }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-neutral-500 text-[11px]">Servicios:</span>
            <span class="font-mono text-neutral-300 text-[11px]">
              {{ item.total_dominios }} dom • {{ item.total_hostings }} host
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-1.5 pt-2 border-t border-neutral-900">
        <button
          @click="emit('view-detail', item.id)"
          class="flex-1 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-colors text-center"
        >
          Detalle
        </button>
        <button
          v-if="isSuperAdmin"
          @click="emit('edit', item)"
          class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title="Editar"
        >
          <i class="pi pi-pencil text-xs"></i>
        </button>
        <a
          v-if="item.telefono"
          :href="formatWhatsAppLink(item.telefono)"
          target="_blank"
          rel="noopener noreferrer"
          class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <i class="pi pi-whatsapp text-xs"></i>
        </a>
      </div>
    </div>
  </div>
</template>
