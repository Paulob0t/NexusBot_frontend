<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SolicitudDetail, AgenteSimple } from '@/api/solicitudes'

const props = defineProps<{
  visible: boolean
  solicitud: SolicitudDetail | null
  loading: boolean
  agentes: AgenteSimple[]
  isCliente?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update-status', newStatus: string): void
  (e: 'assign-agents', agentIds: number[]): void
  (e: 'add-note', text: string): void
}>()

const newNoteText = ref('')
const selectedAgentIds = ref<number[]>([])

watch(
  () => props.solicitud,
  (sol) => {
    if (sol) {
      selectedAgentIds.value = sol.agentes.map(a => a.id)
      newNoteText.value = ''
    }
  },
  { immediate: true }
)

function submitNote() {
  if (!newNoteText.value.trim()) return
  emit('add-note', newNoteText.value.trim())
  newNoteText.value = ''
}

function handleAgentToggle(aid: number) {
  if (selectedAgentIds.value.includes(aid)) {
    selectedAgentIds.value = selectedAgentIds.value.filter(id => id !== aid)
  } else {
    selectedAgentIds.value.push(aid)
  }
  emit('assign-agents', selectedAgentIds.value)
}

function getEstadoBadge(estado?: string) {
  switch (estado) {
    case 'Pendiente':
      return { label: 'Pendiente', dotClass: 'bg-amber-500', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
    case 'En Proceso':
      return { label: 'En Proceso', dotClass: 'bg-neutral-300', classes: 'bg-neutral-800 text-neutral-200 border-neutral-700 font-medium' }
    case 'Finalizado':
      return { label: 'Finalizado / Resuelto', dotClass: 'bg-emerald-500', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
    default:
      return { label: estado || 'Pendiente', dotClass: 'bg-neutral-500', classes: 'bg-neutral-900 text-neutral-400 border-neutral-800' }
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <Transition name="modal-smooth" appear>
        <div class="w-full max-w-4xl max-h-[90vh] bg-[#0c0c0e] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <!-- Cabecera -->
          <div class="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#09090b]">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
                <i class="pi pi-ticket text-xs"></i>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-mono text-neutral-500">#{{ solicitud?.id }}</span>
                  <h3 class="text-sm font-semibold text-white truncate max-w-md">{{ solicitud?.titulo }}</h3>
                </div>
                <p class="text-[11px] text-neutral-400">
                  {{ isCliente ? 'Detalle de tu requerimiento y mensajes del equipo técnico' : 'Detalles del requerimiento y notas internas' }}
                </p>
              </div>
            </div>
            <button
              @click="emit('close')"
              class="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 flex items-center justify-center transition-colors"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <!-- Contenido Dividido en 2 Columnas -->
          <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-5 bg-[#09090b] custom-scrollbar">
            <!-- Columna Izquierda: Descripción y Notas (2/3) -->
            <div class="lg:col-span-2 space-y-5">
              <!-- Descripción -->
              <div class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-2">
                <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Descripción del Requerimiento</span>
                <div class="text-xs text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {{ solicitud?.descripcion_texto || 'Sin descripción adicional.' }}
                </div>
              </div>

              <!-- Sección de Notas / Timeline -->
              <div class="space-y-3">
                <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <i class="pi pi-comments text-[10px]"></i>
                  <span>{{ isCliente ? 'Mensajes y Seguimiento' : 'Notas & Comentarios' }} ({{ solicitud?.notas?.length || 0 }})</span>
                </span>

                <!-- Input para agregar nota -->
                <div class="flex items-start space-x-2">
                  <textarea
                    v-model="newNoteText"
                    rows="2"
                    :placeholder="isCliente ? 'Escribir un mensaje o consulta para el equipo...' : 'Escribir una actualización o comentario...'"
                    class="flex-1 bg-[#141417] border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 resize-none transition-colors"
                  ></textarea>
                  <button
                    @click="submitNote"
                    :disabled="!newNoteText.trim()"
                    class="px-4 py-3 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-semibold transition-all shrink-0 shadow-sm active:scale-95"
                  >
                    <i class="pi pi-send text-xs"></i>
                  </button>
                </div>

                <!-- Lista de Notas -->
                <div v-if="solicitud?.notas && solicitud.notas.length > 0" class="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  <div
                    v-for="nota in solicitud.notas"
                    :key="nota.id"
                    class="p-3.5 rounded-xl bg-[#0c0c0e] border border-neutral-800/80 space-y-1 text-xs"
                  >
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="font-semibold text-white">{{ nota.autor }}</span>
                      <span class="text-[10px] font-mono text-neutral-500">{{ nota.fecha_creacion }}</span>
                    </div>
                    <p class="text-neutral-300 text-xs leading-relaxed">{{ nota.nota_texto }}</p>
                  </div>
                </div>
                <div v-else class="text-xs text-neutral-500 italic py-2 font-mono">
                  {{ isCliente ? 'No hay mensajes registrados aún en este ticket.' : 'No hay notas registradas para esta solicitud.' }}
                </div>
              </div>
            </div>

            <!-- Columna Derecha: Metadatos y Asignación (1/3) -->
            <div class="space-y-4">
              <!-- Estado -->
              <div class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-2 text-xs">
                <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Estado Actual</span>

                <!-- Modo Cliente: Badge de Estado -->
                <div v-if="isCliente" class="pt-1">
                  <span
                    :class="[
                      'inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border',
                      getEstadoBadge(solicitud?.estado).classes
                    ]"
                  >
                    <span class="w-2 h-2 rounded-full" :class="getEstadoBadge(solicitud?.estado).dotClass"></span>
                    <span>{{ getEstadoBadge(solicitud?.estado).label }}</span>
                  </span>
                </div>

                <!-- Modo Staff: Botones para cambiar estado -->
                <div v-else class="grid grid-cols-3 gap-1">
                  <button
                    v-for="st in ['Pendiente', 'En Proceso', 'Finalizado']"
                    :key="st"
                    @click="emit('update-status', st)"
                    :class="[
                      'py-1.5 px-2 rounded-lg text-[10px] font-mono transition-colors text-center',
                      solicitud?.estado === st
                        ? 'bg-neutral-800 text-white font-medium border border-neutral-600 shadow-sm'
                        : 'bg-[#141417] text-neutral-400 hover:text-white border border-neutral-800'
                    ]"
                  >
                    {{ st }}
                  </button>
                </div>
              </div>

              <!-- Metadatos Básicos -->
              <div class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-2.5 text-xs">
                <div v-if="!isCliente">
                  <span class="text-neutral-500 text-[10px] font-mono uppercase">Cliente</span>
                  <div class="font-medium text-white text-xs mt-0.5">{{ solicitud?.cliente_nombre || 'General' }}</div>
                </div>
                <div>
                  <span class="text-neutral-500 text-[10px] font-mono uppercase">Prioridad</span>
                  <div class="font-medium text-white text-xs mt-0.5">{{ solicitud?.prioridad }}</div>
                </div>
                <div>
                  <span class="text-neutral-500 text-[10px] font-mono uppercase">Fecha Creación</span>
                  <div class="text-neutral-300 font-mono text-xs mt-0.5">{{ solicitud?.fecha_solicitud }}</div>
                </div>
                <div v-if="!isCliente && solicitud?.fecha_lim">
                  <span class="text-neutral-500 text-[10px] font-mono uppercase">Fecha Límite</span>
                  <div class="text-neutral-300 font-mono text-xs mt-0.5">{{ solicitud?.fecha_lim }}</div>
                </div>
              </div>

              <!-- Asignación de Agentes (Solo Staff) -->
              <div v-if="!isCliente" class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-2 text-xs">
                <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Agentes Asignados</span>
                <div class="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                  <label
                    v-for="ag in agentes"
                    :key="ag.id"
                    class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="selectedAgentIds.includes(ag.id)"
                      @change="handleAgentToggle(ag.id)"
                      class="rounded border-neutral-800 bg-[#141417] text-neutral-300 focus:ring-0"
                    />
                    <span class="text-neutral-300 text-xs">{{ ag.nombre }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Pie del Modal -->
          <div class="px-6 py-3.5 border-t border-neutral-800 bg-[#09090b] flex items-center justify-end">
            <button
              @click="emit('close')"
              class="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-smooth-enter-active,
.modal-smooth-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-smooth-enter-from,
.modal-smooth-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(6px);
}
</style>
