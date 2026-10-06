<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { PortalSitioItem, PortalTicketItem } from '@/api/portal'

defineProps<{
  sitios: PortalSitioItem[]
  tickets: PortalTicketItem[]
}>()

const emit = defineEmits<{
  (e: 'open-ticket'): void
}>()

const router = useRouter()

function getStatusBadge(estado: string) {
  if (estado === 'Finalizado') {
    return 'bg-neutral-900 text-emerald-400 border-neutral-800'
  } else if (estado === 'En Proceso') {
    return 'bg-neutral-900 text-neutral-200 border-neutral-700'
  }
  return 'bg-amber-950/40 text-amber-400 border-amber-900/50'
}

function getPriorityBadge(prioridad: string) {
  if (prioridad === 'Alta') {
    return 'text-red-400'
  } else if (prioridad === 'Media') {
    return 'text-amber-400'
  }
  return 'text-neutral-400'
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
    <!-- PANEL IZQUIERDO: MIS SITIOS WEB -->
    <div class="rounded-xl bg-[#0c0c0e] border border-neutral-800 p-5 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800 flex items-center justify-center">
              <i class="pi pi-desktop text-xs"></i>
            </div>
            <div>
              <h3 class="text-xs font-semibold text-white">Mis Sitios Web Activos</h3>
              <p class="text-[10px] text-neutral-500">Accede rápidamente a tus páginas publicadas</p>
            </div>
          </div>
          <button
            @click="router.push('/dominios')"
            class="text-xs font-medium text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>Ver todos</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </button>
        </div>

        <!-- Lista de sitios -->
        <div v-if="sitios.length > 0" class="space-y-2">
          <div
            v-for="s in sitios"
            :key="s.id"
            class="group rounded-lg bg-neutral-950 border border-neutral-800/80 p-3 flex items-center justify-between hover:border-neutral-700 transition-colors"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-7 h-7 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                <i class="pi pi-globe text-xs"></i>
              </div>
              <div class="min-w-0">
                <a
                  :href="s.url_dominio.startsWith('http') ? s.url_dominio : 'https://' + s.url_dominio"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs font-medium text-neutral-200 group-hover:text-white transition-colors truncate block"
                >
                  {{ s.url_dominio }}
                </a>
                <div class="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500 font-mono">
                  <span v-if="s.proveedor">{{ s.proveedor }}</span>
                  <span v-if="s.fecha_pago">· Vence: {{ s.fecha_pago }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <a
                :href="s.url_dominio.startsWith('http') ? s.url_dominio : 'https://' + s.url_dominio"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors text-xs"
                title="Visitar sitio web"
              >
                <i class="pi pi-external-link text-[10px]"></i>
              </a>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-6 border border-dashed border-neutral-800 rounded-lg">
          <i class="pi pi-globe text-2xl text-neutral-600 mb-1.5 block"></i>
          <p class="text-xs text-neutral-500">No hay sitios registrados en este momento</p>
        </div>
      </div>
    </div>

    <!-- PANEL DERECHO: TICKETS RECIENTES -->
    <div class="rounded-xl bg-[#0c0c0e] border border-neutral-800 p-5 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800 flex items-center justify-center">
              <i class="pi pi-headphones text-xs"></i>
            </div>
            <div>
              <h3 class="text-xs font-semibold text-white">Tickets de Soporte</h3>
              <p class="text-[10px] text-neutral-500">Estado de tus requerimientos técnicos</p>
            </div>
          </div>
          <button
            @click="emit('open-ticket')"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors"
          >
            <i class="pi pi-plus text-[10px]"></i>
            <span>Nuevo</span>
          </button>
        </div>

        <!-- Lista de tickets -->
        <div v-if="tickets.length > 0" class="space-y-2">
          <div
            v-for="t in tickets"
            :key="t.id"
            @click="router.push('/solicitudes')"
            class="group cursor-pointer rounded-lg bg-neutral-950 border border-neutral-800/80 p-3 flex items-center justify-between hover:border-neutral-700 transition-colors"
          >
            <div class="min-w-0 pr-3">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="px-2 py-0.2 text-[10px] font-mono rounded border"
                  :class="getStatusBadge(t.estado)"
                >
                  {{ t.estado }}
                </span>
                <span
                  class="text-[10px] font-mono"
                  :class="getPriorityBadge(t.prioridad)"
                >
                  {{ t.prioridad }}
                </span>
                <span v-if="t.fecha_solicitud" class="text-[10px] text-neutral-500 font-mono">
                  {{ t.fecha_solicitud }}
                </span>
              </div>
              <h4 class="text-xs font-medium text-neutral-200 group-hover:text-white transition-colors truncate">
                #{{ t.id }} - {{ t.titulo }}
              </h4>
            </div>

            <div class="flex items-center gap-2 text-neutral-500 text-xs shrink-0">
              <span v-if="t.total_notas > 0" class="inline-flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
                <i class="pi pi-comments text-[9px]"></i>
                {{ t.total_notas }}
              </span>
              <i class="pi pi-chevron-right text-[10px] group-hover:translate-x-0.5 text-neutral-500 transition-transform"></i>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-6 border border-dashed border-neutral-800 rounded-lg">
          <i class="pi pi-inbox text-2xl text-neutral-600 mb-1.5 block"></i>
          <p class="text-xs text-neutral-500">No tienes tickets abiertos actualmente</p>
          <button
            @click="emit('open-ticket')"
            class="mt-2 text-xs font-medium text-neutral-300 hover:text-white hover:underline inline-flex items-center gap-1"
          >
            <span>Crear primer ticket</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
