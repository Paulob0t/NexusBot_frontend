<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SolicitudDetail, AgenteSimple } from '@/api/solicitudes'

const props = defineProps<{
  visible: boolean
  solicitud: SolicitudDetail | null
  loading: boolean
  agentes: AgenteSimple[]
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
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <div class="w-full max-w-4xl max-h-[90vh] bg-[#0c0c0e] border border-neutral-800 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <!-- Cabecera -->
          <div class="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#09090b]">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
                <i class="pi pi-ticket text-xs"></i>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-mono text-neutral-500">#{{ solicitud?.id }}</span>
                  <h3 class="text-sm font-semibold text-white truncate max-w-md">{{ solicitud?.titulo }}</h3>
                </div>
                <p class="text-[11px] text-neutral-500">Detalles del requerimiento y notas internas</p>
              </div>
            </div>
            <button
              @click="emit('close')"
              class="w-7 h-7 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 flex items-center justify-center transition-colors"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <!-- Contenido Dividido en 2 Columnas -->
          <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-5 bg-[#09090b] custom-scrollbar">
            <!-- Columna Izquierda: Descripción y Notas (2/3) -->
            <div class="lg:col-span-2 space-y-5">
              <!-- Descripción -->
              <div class="p-4 rounded-lg bg-[#0c0c0e] border border-neutral-800 space-y-2">
                <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Descripción</span>
                <div class="text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed">
                  {{ solicitud?.descripcion_texto || 'Sin descripción adicional.' }}
                </div>
              </div>

              <!-- Sección de Notas / Timeline -->
              <div class="space-y-3">
                <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <i class="pi pi-comments text-[10px]"></i>
                  <span>Notas & Comentarios ({{ solicitud?.notas?.length || 0 }})</span>
                </span>

                <!-- Input para agregar nota -->
                <div class="flex items-start space-x-2">
                  <textarea
                    v-model="newNoteText"
                    rows="2"
                    placeholder="Escribir una actualización o comentario..."
                    class="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 resize-none"
                  ></textarea>
                  <button
                    @click="submitNote"
                    :disabled="!newNoteText.trim()"
                    class="px-3.5 py-2.5 rounded-lg bg-neutral-100 hover:bg-white disabled:opacity-40 text-neutral-950 text-xs font-medium transition-colors shrink-0"
                  >
                    <i class="pi pi-send text-xs"></i>
                  </button>
                </div>

                <!-- Lista de Notas -->
                <div v-if="solicitud?.notas && solicitud.notas.length > 0" class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  <div
                    v-for="nota in solicitud.notas"
                    :key="nota.id"
                    class="p-3 rounded-lg bg-[#0c0c0e] border border-neutral-800/80 space-y-1 text-xs"
                  >
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="font-medium text-white">{{ nota.autor }}</span>
                      <span class="text-[10px] font-mono text-neutral-500">{{ nota.fecha_creacion }}</span>
                    </div>
                    <p class="text-neutral-300 text-xs leading-relaxed">{{ nota.nota_texto }}</p>
                  </div>
                </div>
                <div v-else class="text-xs text-neutral-500 italic py-2 font-mono">
                  No hay notas registradas para esta solicitud.
                </div>
              </div>
            </div>

            <!-- Columna Derecha: Metadatos y Asignación (1/3) -->
            <div class="space-y-4">
              <!-- Estado -->
              <div class="p-3.5 rounded-lg bg-[#0c0c0e] border border-neutral-800 space-y-2 text-xs">
                <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Estado</span>
                <div class="grid grid-cols-3 gap-1">
                  <button
                    v-for="st in ['Pendiente', 'En Proceso', 'Finalizado']"
                    :key="st"
                    @click="emit('update-status', st)"
                    :class="[
                      'py-1.5 px-2 rounded text-[10px] font-mono transition-colors text-center',
                      solicitud?.estado === st
                        ? 'bg-neutral-800 text-white font-medium border border-neutral-700'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-900'
                    ]"
                  >
                    {{ st }}
                  </button>
                </div>
              </div>

              <!-- Metadatos Básicos -->
              <div class="p-3.5 rounded-lg bg-[#0c0c0e] border border-neutral-800 space-y-2.5 text-xs">
                <div>
                  <span class="text-neutral-500 text-[10px] font-mono uppercase">Cliente</span>
                  <div class="font-medium text-white text-xs mt-0.5">{{ solicitud?.cliente_nombre || 'General' }}</div>
                </div>
                <div>
                  <span class="text-neutral-500 text-[10px] font-mono uppercase">Prioridad</span>
                  <div class="font-medium text-white text-xs mt-0.5">{{ solicitud?.prioridad }}</div>
                </div>
                <div>
                  <span class="text-neutral-500 text-[10px] font-mono uppercase">Fecha Solicitud</span>
                  <div class="text-neutral-400 font-mono text-xs mt-0.5">{{ solicitud?.fecha_solicitud }}</div>
                </div>
                <div v-if="solicitud?.fecha_lim">
                  <span class="text-neutral-500 text-[10px] font-mono uppercase">Fecha Límite</span>
                  <div class="text-neutral-300 font-mono text-xs mt-0.5">{{ solicitud?.fecha_lim }}</div>
                </div>
              </div>

              <!-- Asignación de Agentes -->
              <div class="p-3.5 rounded-lg bg-[#0c0c0e] border border-neutral-800 space-y-2 text-xs">
                <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Agentes Asignados</span>
                <div class="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                  <label
                    v-for="ag in agentes"
                    :key="ag.id"
                    class="flex items-center space-x-2 p-1.5 rounded hover:bg-neutral-900 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="selectedAgentIds.includes(ag.id)"
                      @change="handleAgentToggle(ag.id)"
                      class="rounded border-neutral-800 bg-neutral-950 text-neutral-300 focus:ring-0"
                    />
                    <span class="text-neutral-300 text-xs">{{ ag.nombre }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Pie del Modal -->
          <div class="px-6 py-3 border-t border-neutral-800 bg-[#09090b] flex items-center justify-end">
            <button
              @click="emit('close')"
              class="px-4 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
