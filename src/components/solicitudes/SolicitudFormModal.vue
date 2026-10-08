<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { SolicitudItem, AgenteSimple } from '@/api/solicitudes'

const props = defineProps<{
  visible: boolean
  solicitudToEdit: SolicitudItem | null
  agentes: AgenteSimple[]
  clients: Array<{ id: number; nombre_contacto?: string; empresa?: string }>
  saving: boolean
  isCliente?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: any): void
}>()

const form = reactive({
  id: null as number | null,
  titulo: '',
  descripcion: '',
  id_cliente: null as number | null,
  agentes_ids: [] as number[],
  prioridad: 'Media',
  fecha_lim: '',
  repetir: 0,
})

watch(
  () => props.solicitudToEdit,
  (sol) => {
    if (sol) {
      form.id = sol.id
      form.titulo = sol.titulo
      form.descripcion = sol.descripcion_texto
      form.id_cliente = sol.id_cliente ?? null
      form.agentes_ids = sol.agentes.map(a => a.id)
      form.prioridad = sol.prioridad || 'Media'
      form.fecha_lim = sol.fecha_lim || ''
      form.repetir = 0
    } else {
      form.id = null
      form.titulo = ''
      form.descripcion = ''
      form.id_cliente = null
      form.agentes_ids = []
      form.prioridad = 'Media'
      form.fecha_lim = ''
      form.repetir = 0
    }
  },
  { immediate: true }
)

function handleAgentToggle(aid: number) {
  if (form.agentes_ids.includes(aid)) {
    form.agentes_ids = form.agentes_ids.filter(id => id !== aid)
  } else {
    form.agentes_ids.push(aid)
  }
}

function handleSubmit() {
  if (!form.titulo.trim()) return
  emit('save', { ...form })
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
        <div class="w-full max-w-xl max-h-[90vh] bg-[#0c0c0e] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <!-- Cabecera -->
          <div class="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#09090b]">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
                <i :class="['pi text-xs', form.id ? 'pi-pencil' : 'pi-plus']"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white">
                  {{ isCliente ? (form.id ? 'Editar Solicitud #' + form.id : 'Nueva Solicitud de Soporte') : (form.id ? 'Editar Solicitud #' + form.id : 'Nueva Solicitud / Ticket') }}
                </h3>
                <p class="text-[11px] text-neutral-400">
                  {{ isCliente ? 'Envía un requerimiento o consulta a nuestro equipo técnico' : 'Detalles del requerimiento técnico o soporte' }}
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

          <!-- Formulario -->
          <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs bg-[#09090b] custom-scrollbar">
            <!-- Título -->
            <div class="space-y-1.5">
              <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Título del Requerimiento <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="form.titulo"
                type="text"
                required
                :placeholder="isCliente ? 'Ej: Modificación en página de inicio, soporte de correos...' : 'Ej: Ajuste de certificados SSL y renovación'"
                class="w-full bg-[#141417] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 text-xs transition-colors"
              />
            </div>

            <!-- Descripción -->
            <div class="space-y-1.5">
              <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Descripción Detallada <span class="text-rose-400">*</span>
              </label>
              <textarea
                v-model="form.descripcion"
                rows="4"
                required
                :placeholder="isCliente ? 'Describe con detalle lo que necesitas o el inconveniente que presentas...' : 'Instrucciones, requerimientos técnicos, enlaces...'"
                class="w-full bg-[#141417] border border-neutral-800 rounded-xl p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 resize-none text-xs transition-colors"
              ></textarea>
            </div>

            <!-- Fila: Cliente y Prioridad (O solo Prioridad si es Cliente) -->
            <div :class="['grid gap-3.5', isCliente ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2']">
              <!-- Cliente (Solo Staff) -->
              <div v-if="!isCliente" class="space-y-1.5">
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Cliente Asociado</label>
                <select
                  v-model="form.id_cliente"
                  class="w-full bg-[#141417] border border-neutral-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-neutral-600 text-xs"
                >
                  <option :value="null">Sin cliente específico / General</option>
                  <option v-for="c in clients" :key="c.id" :value="c.id">
                    {{ c.nombre_contacto || c.empresa || ('Cliente #' + c.id) }}
                  </option>
                </select>
              </div>

              <!-- Prioridad -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Prioridad</label>
                <select
                  v-model="form.prioridad"
                  class="w-full bg-[#141417] border border-neutral-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-neutral-600 text-xs"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media (Estándar)</option>
                  <option value="Alta">Alta (Urgente)</option>
                </select>
              </div>
            </div>

            <!-- Fila de Fechas y Repetición (Solo Staff) -->
            <div v-if="!isCliente" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <!-- Fecha Límite -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Fecha Límite</label>
                <input
                  v-model="form.fecha_lim"
                  type="date"
                  class="w-full bg-[#141417] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neutral-600 text-xs font-mono [color-scheme:dark]"
                />
              </div>

              <!-- Repetición (Si es nueva) -->
              <div v-if="!form.id" class="space-y-1.5">
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Programar Repetición</label>
                <select
                  v-model="form.repetir"
                  class="w-full bg-[#141417] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neutral-600 text-xs"
                >
                  <option :value="0">No repetir (Única vez)</option>
                  <option :value="1">Diario</option>
                  <option :value="2">Semanal</option>
                  <option :value="3">Mensual</option>
                </select>
              </div>
            </div>

            <!-- Asignar Agentes (Solo Staff) -->
            <div v-if="!isCliente" class="space-y-1.5 pt-2 border-t border-neutral-800">
              <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Asignar Agentes / Desarrolladores</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto custom-scrollbar p-0.5">
                <label
                  v-for="ag in agentes"
                  :key="ag.id"
                  class="flex items-center space-x-2 p-2 rounded-xl bg-[#0c0c0e] border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    :checked="form.agentes_ids.includes(ag.id)"
                    @change="handleAgentToggle(ag.id)"
                    class="rounded border-neutral-800 bg-[#141417] text-neutral-300 focus:ring-0"
                  />
                  <span class="text-neutral-300 truncate text-[11px]">{{ ag.nombre }}</span>
                </label>
              </div>
            </div>
          </form>

          <!-- Pie del Modal -->
          <div class="px-6 py-3.5 border-t border-neutral-800 bg-[#09090b] flex items-center justify-between">
            <button
              @click="emit('close')"
              type="button"
              class="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              @click="handleSubmit"
              :disabled="saving || !form.titulo.trim()"
              class="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
              <i v-else class="pi pi-check text-xs"></i>
              <span>{{ saving ? 'Enviando...' : (form.id ? 'Guardar Cambios' : (isCliente ? 'Enviar Solicitud' : 'Crear Solicitud')) }}</span>
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
