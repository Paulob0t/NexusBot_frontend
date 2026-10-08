<script setup lang="ts">
import type { SolicitudItem } from '@/api/solicitudes'

defineProps<{
  items: SolicitudItem[]
  loading: boolean
  isCliente?: boolean
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
      return { label: 'Pendiente', dotClass: 'bg-amber-500', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
    case 'En Proceso':
      return { label: 'En Proceso', dotClass: 'bg-neutral-300', classes: 'bg-neutral-800 text-neutral-200 border-neutral-700 font-medium' }
    case 'Finalizado':
      return { label: 'Finalizado', dotClass: 'bg-emerald-500', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
    default:
      return { label: estado, dotClass: 'bg-neutral-500', classes: 'bg-neutral-900 text-neutral-400 border-neutral-800' }
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
  <div class="rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 overflow-hidden shadow-sm">
    <div class="overflow-x-auto custom-scrollbar">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-neutral-800/80 bg-neutral-900/40 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider select-none">
            <th class="py-3.5 px-4 w-14 text-center">ID</th>
            <th class="py-3.5 px-4">Título / Requerimiento</th>
            <th v-if="!isCliente" class="py-3.5 px-4">Cliente</th>
            <th v-if="!isCliente" class="py-3.5 px-4">Agente(s)</th>
            <th class="py-3.5 px-4">Prioridad</th>
            <th class="py-3.5 px-4">Estado</th>
            <th class="py-3.5 px-4">Fecha Solicitud</th>
            <th class="py-3.5 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-800/50 text-xs text-neutral-300">
          <tr v-if="loading">
            <td :colspan="isCliente ? 6 : 8" class="p-12 text-center text-neutral-500">
              <i class="pi pi-spin pi-spinner text-2xl text-neutral-400 mb-2"></i>
              <div class="text-xs font-medium text-neutral-400">Cargando solicitudes...</div>
            </td>
          </tr>

          <tr v-else-if="items.length === 0">
            <td :colspan="isCliente ? 6 : 8" class="p-12 text-center text-neutral-500 space-y-2">
              <div class="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center mx-auto text-lg">
                <i class="pi pi-inbox"></i>
              </div>
              <div class="text-sm font-semibold text-white">
                {{ isCliente ? 'No tienes solicitudes registradas' : 'No se encontraron solicitudes' }}
              </div>
              <p class="text-xs text-neutral-400 max-w-sm mx-auto">
                {{ isCliente ? 'Si necesitas asistencia técnica o soporte, haz clic en "Crear Solicitud".' : 'Prueba cambiando los filtros o crea una nueva solicitud.' }}
              </p>
            </td>
          </tr>

          <tr
            v-for="item in items"
            :key="item.id"
            class="hover:bg-neutral-900/40 transition-colors duration-100 group"
          >
            <!-- ID -->
            <td class="py-3.5 px-4 text-center font-mono text-xs text-neutral-400 font-semibold">
              #{{ item.id }}
            </td>

            <!-- Título y descripción -->
            <td class="py-3.5 px-4 max-w-xs sm:max-w-md">
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
                <span>{{ item.total_notas }} {{ item.total_notas === 1 ? 'comentario' : 'comentarios' }}</span>
              </div>
            </td>

            <!-- Cliente (Solo Admin/Agente) -->
            <td v-if="!isCliente" class="py-3.5 px-4 whitespace-nowrap">
              <div class="font-medium text-white text-xs">
                {{ item.cliente_nombre || item.cliente_empresa || 'Cliente General' }}
              </div>
              <div v-if="item.cliente_empresa && item.cliente_nombre" class="text-[11px] text-neutral-400">
                {{ item.cliente_empresa }}
              </div>
            </td>

            <!-- Agentes (Solo Admin/Agente) -->
            <td v-if="!isCliente" class="py-3.5 px-4">
              <div v-if="item.agentes && item.agentes.length > 0" class="flex flex-wrap gap-1">
                <span
                  v-for="ag in item.agentes"
                  :key="ag.id"
                  class="px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-mono"
                >
                  {{ ag.nombre }}
                </span>
              </div>
              <span v-else class="text-[10px] font-mono text-neutral-600 italic">
                Sin asignar
              </span>
            </td>

            <!-- Prioridad -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-0.5 rounded-md text-[10px] font-mono border inline-block',
                  getPrioridadBadge(item.prioridad).classes
                ]"
              >
                {{ item.prioridad }}
              </span>
            </td>

            <!-- Estado -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <!-- Modo Cliente: Solo lectura con status dot -->
              <span
                v-if="isCliente"
                :class="[
                  'inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border',
                  getEstadoBadge(item.estado).classes
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="getEstadoBadge(item.estado).dotClass"></span>
                <span>{{ item.estado }}</span>
              </span>

              <!-- Modo Staff: Selector de estado -->
              <select
                v-else
                :value="item.estado"
                @change="emit('update-status', item, ($event.target as HTMLSelectElement).value)"
                :class="[
                  'px-2 py-0.5 rounded-lg text-[10px] font-mono border cursor-pointer focus:outline-none transition-colors',
                  getEstadoBadge(item.estado).classes,
                  'bg-[#141417]'
                ]"
              >
                <option value="Pendiente" class="bg-[#141417] text-amber-400">Pendiente</option>
                <option value="En Proceso" class="bg-[#141417] text-white">En Proceso</option>
                <option value="Finalizado" class="bg-[#141417] text-emerald-400">Finalizado</option>
              </select>
            </td>

            <!-- Fechas -->
            <td class="py-3.5 px-4 whitespace-nowrap font-mono">
              <div class="text-[11px] text-neutral-300">
                {{ item.fecha_solicitud || '---' }}
              </div>
              <div v-if="!isCliente && item.fecha_lim" class="text-[10px] text-neutral-500 mt-0.5 flex items-center space-x-1">
                <i class="pi pi-calendar text-[8px]"></i>
                <span>Límite: {{ item.fecha_lim }}</span>
              </div>
            </td>

            <!-- Acciones -->
            <td class="py-3.5 px-4 text-right whitespace-nowrap">
              <div class="flex items-center justify-end space-x-1">
                <!-- Ver Detalle / Comentarios -->
                <button
                  @click="emit('view-detail', item)"
                  class="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  :title="isCliente ? 'Ver conversación y respuestas' : 'Ver detalle y notas'"
                >
                  <i class="pi pi-eye text-xs"></i>
                </button>

                <!-- Editar (Solo Staff) -->
                <button
                  v-if="!isCliente"
                  @click="emit('edit', item)"
                  class="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Editar solicitud"
                >
                  <i class="pi pi-pencil text-xs"></i>
                </button>

                <!-- Eliminar (Solo Staff) -->
                <button
                  v-if="!isCliente"
                  @click="emit('delete', item)"
                  class="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
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
