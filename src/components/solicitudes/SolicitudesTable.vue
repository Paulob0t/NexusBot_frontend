<script setup lang="ts">
import type { SolicitudItem } from '@/api/solicitudes'

defineProps<{
  items: SolicitudItem[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'view-detail', item: SolicitudItem): void
  (e: 'edit', item: SolicitudItem): void
  (e: 'update-status', item: SolicitudItem, newStatus: string): void
  (e: 'delete', item: SolicitudItem): void
}>()

function getEstadoBadge(estado: string) {
  switch (estado) {
    case 'Pendiente':
      return { label: 'Pendiente', classes: 'bg-neutral-900 text-amber-400 border-neutral-800' }
    case 'En Proceso':
      return { label: 'En Proceso', classes: 'bg-neutral-900 text-neutral-200 border-neutral-700 font-medium' }
    case 'Finalizado':
      return { label: 'Finalizado', classes: 'bg-neutral-900 text-emerald-400 border-neutral-800' }
    default:
      return { label: estado, classes: 'bg-neutral-900 text-neutral-400 border-neutral-800' }
  }
}

function getPrioridadBadge(prioridad: string) {
  switch (prioridad) {
    case 'Alta':
      return { label: 'Alta', classes: 'bg-red-950/40 text-red-400 border-red-900/50' }
    case 'Media':
      return { label: 'Media', classes: 'bg-neutral-900 text-neutral-300 border-neutral-800' }
    case 'Baja':
      return { label: 'Baja', classes: 'bg-neutral-900 text-neutral-500 border-neutral-800' }
    default:
      return { label: prioridad, classes: 'bg-neutral-900 text-neutral-400 border-neutral-800' }
  }
}
</script>

<template>
  <div class="rounded-xl bg-[#0c0c0e] border border-neutral-800 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-neutral-800 bg-neutral-950 text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-wider select-none">
            <th class="p-3 w-14 text-center">ID</th>
            <th class="p-3">Título / Requerimiento</th>
            <th class="p-3">Cliente</th>
            <th class="p-3">Agente(s)</th>
            <th class="p-3">Prioridad</th>
            <th class="p-3">Estado</th>
            <th class="p-3">Fecha / Límite</th>
            <th class="p-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-900 text-xs text-neutral-300">
          <tr v-if="loading">
            <td colspan="8" class="p-8 text-center text-neutral-500">
              <i class="pi pi-spin pi-spinner text-xl text-neutral-400 mb-2"></i>
              <div class="text-xs font-mono">Cargando solicitudes...</div>
            </td>
          </tr>

          <tr v-else-if="items.length === 0">
            <td colspan="8" class="p-10 text-center text-neutral-500">
              <i class="pi pi-inbox text-2xl text-neutral-600 mb-2"></i>
              <div class="text-xs font-medium text-neutral-300">No se encontraron solicitudes</div>
              <p class="text-[11px] text-neutral-500 mt-0.5">Prueba cambiando los filtros o crea una nueva solicitud.</p>
            </td>
          </tr>

          <tr
            v-for="item in items"
            :key="item.id"
            class="hover:bg-neutral-900/40 transition-colors duration-100 group"
          >
            <!-- ID -->
            <td class="p-3 text-center font-mono text-[11px] text-neutral-500">
              #{{ item.id }}
            </td>

            <!-- Título y descripción -->
            <td class="p-3 max-w-xs">
              <div
                @click="emit('view-detail', item)"
                class="font-medium text-white group-hover:text-neutral-200 cursor-pointer transition-colors truncate text-xs"
                :title="item.titulo"
              >
                {{ item.titulo }}
              </div>
              <div class="text-[11px] text-neutral-500 truncate mt-0.5" :title="item.descripcion_texto">
                {{ item.descripcion_texto || 'Sin descripción adicional' }}
              </div>
              <!-- Indicador de notas adjuntas -->
              <div v-if="item.total_notas > 0" class="inline-flex items-center space-x-1 text-[10px] font-mono text-neutral-400 mt-1">
                <i class="pi pi-comments text-[9px]"></i>
                <span>{{ item.total_notas }} {{ item.total_notas === 1 ? 'nota' : 'notas' }}</span>
              </div>
            </td>

            <!-- Cliente -->
            <td class="p-3 whitespace-nowrap">
              <div class="font-medium text-neutral-200 text-xs">
                {{ item.cliente_nombre || item.cliente_empresa || 'Cliente General' }}
              </div>
              <div v-if="item.cliente_empresa && item.cliente_nombre" class="text-[10px] text-neutral-500">
                {{ item.cliente_empresa }}
              </div>
            </td>

            <!-- Agentes -->
            <td class="p-3">
              <div v-if="item.agentes && item.agentes.length > 0" class="flex flex-wrap gap-1">
                <span
                  v-for="ag in item.agentes"
                  :key="ag.id"
                  class="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-mono"
                >
                  {{ ag.nombre }}
                </span>
              </div>
              <span v-else class="text-[10px] font-mono text-neutral-600 italic">
                Sin asignar
              </span>
            </td>

            <!-- Prioridad -->
            <td class="p-3 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-0.5 rounded text-[10px] font-mono border inline-block',
                  getPrioridadBadge(item.prioridad).classes
                ]"
              >
                {{ item.prioridad }}
              </span>
            </td>

            <!-- Estado con Selector Rápido -->
            <td class="p-3 whitespace-nowrap">
              <select
                :value="item.estado"
                @change="emit('update-status', item, ($event.target as HTMLSelectElement).value)"
                :class="[
                  'px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer focus:outline-none transition-colors',
                  getEstadoBadge(item.estado).classes,
                  'bg-neutral-950'
                ]"
              >
                <option value="Pendiente" class="bg-neutral-950 text-amber-400">Pendiente</option>
                <option value="En Proceso" class="bg-neutral-950 text-white">En Proceso</option>
                <option value="Finalizado" class="bg-neutral-950 text-emerald-400">Finalizado</option>
              </select>
            </td>

            <!-- Fechas -->
            <td class="p-3 whitespace-nowrap font-mono">
              <div class="text-[11px] text-neutral-400">
                {{ item.fecha_solicitud || '---' }}
              </div>
              <div v-if="item.fecha_lim" class="text-[10px] text-neutral-500 mt-0.5 flex items-center space-x-1">
                <i class="pi pi-calendar text-[8px]"></i>
                <span>Límite: {{ item.fecha_lim }}</span>
              </div>
            </td>

            <!-- Acciones -->
            <td class="p-3 text-right whitespace-nowrap">
              <div class="flex items-center justify-end space-x-1">
                <!-- Ver Detalle / Notas -->
                <button
                  @click="emit('view-detail', item)"
                  class="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Ver detalle y comentarios"
                >
                  <i class="pi pi-eye text-xs"></i>
                </button>

                <!-- Editar -->
                <button
                  @click="emit('edit', item)"
                  class="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Editar solicitud"
                >
                  <i class="pi pi-pencil text-xs"></i>
                </button>

                <!-- Eliminar -->
                <button
                  @click="emit('delete', item)"
                  class="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                  title="Eliminar solicitud"
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
