<script setup lang="ts">
import type { ClienteListItem } from '@/api/clientes'

defineProps<{
  clientes: ClienteListItem[]
  isSuperAdmin: boolean
  getInitials: (name: string) => string
  formatWhatsAppLink: (phone: string | null) => string
}>()

const emit = defineEmits<{
  (e: 'view-detail', id: number): void
  (e: 'edit', client: ClienteListItem): void
  (e: 'delete', client: ClienteListItem): void
}>()
</script>

<template>
  <div class="hidden md:block rounded-xl bg-[#0c0c0e] border border-neutral-800 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-mono border-b border-neutral-800 text-[10px]">
          <tr>
            <th class="py-3 px-4">Cliente / Razón Social</th>
            <th class="py-3 px-4">Contacto Principal</th>
            <th class="py-3 px-4 text-center">Infraestructura</th>
            <th class="py-3 px-4 text-center">Estado Cobranza</th>
            <th class="py-3 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-900">
          <tr
            v-for="item in clientes"
            :key="item.id"
            class="hover:bg-neutral-900/40 transition-colors duration-100 group"
          >
            <!-- Empresa & Avatar -->
            <td class="py-3.5 px-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-medium text-xs text-neutral-300 shrink-0 font-mono">
                  {{ getInitials(item.empresa) }}
                </div>
                <div class="min-w-0">
                  <div class="font-medium text-white text-xs truncate max-w-xs flex items-center space-x-2">
                    <span class="group-hover:text-neutral-200 transition-colors">{{ item.empresa }}</span>
                    <span v-if="item.transferido === 1" class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800 uppercase">Transferido</span>
                    <span v-if="item.eliminado === 1" class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-950/40 text-red-400 border border-red-900/50 uppercase">Baja</span>
                  </div>
                  <div class="text-[11px] text-neutral-500 flex items-center space-x-1.5 mt-0.5 font-mono">
                    <span>#{{ item.id }}</span>
                    <span v-if="item.rfc">• RFC: {{ item.rfc }}</span>
                  </div>
                </div>
              </div>
            </td>

            <!-- Contacto & Correo -->
            <td class="py-3.5 px-4">
              <div class="space-y-0.5">
                <div class="font-medium text-neutral-200 text-xs">{{ item.nombre_contacto }}</div>
                <div class="text-[11px] text-neutral-500 flex items-center space-x-1">
                  <i class="pi pi-envelope text-[9px]"></i>
                  <a :href="`mailto:${item.correo}`" class="hover:text-neutral-300 transition-colors truncate max-w-[190px]">
                    {{ item.correo || 'Sin correo' }}
                  </a>
                </div>
              </div>
            </td>

            <!-- Infraestructura (Dominios y Hosting) -->
            <td class="py-3.5 px-4 text-center">
              <div class="inline-flex items-center justify-center space-x-1.5 font-mono">
                <!-- Badge Dominios -->
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] flex items-center space-x-1 border transition-colors',
                    item.total_dominios > 0
                      ? 'bg-neutral-900 text-neutral-200 border-neutral-700'
                      : 'bg-neutral-950 text-neutral-600 border-neutral-900'
                  ]"
                  title="Dominios Web Activos"
                >
                  <i class="pi pi-globe text-[9px]"></i>
                  <span>{{ item.total_dominios }}</span>
                </span>

                <!-- Badge Hosting -->
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] flex items-center space-x-1 border transition-colors',
                    item.total_hostings > 0
                      ? 'bg-neutral-900 text-neutral-200 border-neutral-700'
                      : 'bg-neutral-950 text-neutral-600 border-neutral-900'
                  ]"
                  title="Planes de Hosting Activos"
                >
                  <i class="pi pi-server text-[9px]"></i>
                  <span>{{ item.total_hostings }}</span>
                </span>
              </div>
            </td>

            <!-- Estado Cobranza -->
            <td class="py-3.5 px-4 text-center">
              <span
                v-if="item.total_pagos_pendientes > 0"
                class="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/40 text-red-400 border border-red-900/50"
              >
                <i class="pi pi-exclamation-circle text-[9px]"></i>
                <span>{{ item.total_pagos_pendientes }} Pendiente{{ item.total_pagos_pendientes > 1 ? 's' : '' }}</span>
              </span>
              <span
                v-else-if="item.total_dominios === 0 && item.total_hostings === 0"
                class="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-950 text-neutral-500 border border-neutral-900"
              >
                Sin Servicios
              </span>
              <span
                v-else
                class="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-800"
              >
                <i class="pi pi-check text-[9px] text-emerald-400"></i>
                <span>Al Día</span>
              </span>
            </td>

            <!-- Acciones -->
            <td class="py-3.5 px-4 text-right">
              <div class="flex items-center justify-end space-x-1">
                <!-- WhatsApp Directo -->
                <a
                  v-if="item.telefono"
                  :href="formatWhatsAppLink(item.telefono)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                  title="WhatsApp"
                >
                  <i class="pi pi-whatsapp text-xs"></i>
                </a>

                <!-- Ver Detalle -->
                <button
                  @click="emit('view-detail', item.id)"
                  class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                  title="Ver Detalle"
                >
                  <i class="pi pi-eye text-xs"></i>
                </button>

                <!-- Editar -->
                <button
                  v-if="isSuperAdmin"
                  @click="emit('edit', item)"
                  class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                  title="Editar Cliente"
                >
                  <i class="pi pi-pencil text-xs"></i>
                </button>

                <!-- Eliminar -->
                <button
                  v-if="isSuperAdmin && item.eliminado === 0"
                  @click="emit('delete', item)"
                  class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 border border-neutral-800 transition-colors"
                  title="Dar de Baja"
                >
                  <i class="pi pi-trash text-xs"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
