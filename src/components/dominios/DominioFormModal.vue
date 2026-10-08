<script setup lang="ts">
import type { DominioPayload } from '@/api/dominios'

defineProps<{
  isOpen: boolean
  isEditing: boolean
  isSaving: boolean
  formData: DominioPayload
  clientesList: Array<{ id: number; empresa: string; nombre_contacto: string }>
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-smooth">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div class="modal-dialog w-full max-w-2xl bg-[#0c0c0e] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="p-5 bg-neutral-950 border-b border-neutral-800/80 flex items-center justify-between shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-200 font-bold">
                <i :class="isEditing ? 'pi pi-pencil' : 'pi pi-plus'" class="text-xs"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white">
                  {{ isEditing ? 'Editar Dominio Web' : 'Registrar Nuevo Dominio' }}
                </h3>
                <p class="text-[11px] text-neutral-500">Configuración de DNS, registrador y fechas de vigencia</p>
              </div>
            </div>
            <button
              @click="emit('close')"
              class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="emit('submit')" class="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <!-- Cliente Asignado -->
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-medium text-neutral-400 mb-1">Cliente Titular *</label>
                <select
                  v-model="formData.cliente_id"
                  required
                  class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-neutral-500 transition-colors"
                >
                  <option disabled :value="0">-- Selecciona un Cliente --</option>
                  <option v-for="c in clientesList" :key="c.id" :value="c.id">
                    {{ c.empresa }} ({{ c.nombre_contacto }})
                  </option>
                </select>
              </div>

              <!-- Dominio URL -->
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 mb-1">Nombre del Dominio *</label>
                <input
                  v-model="formData.url_dominio"
                  type="text"
                  required
                  placeholder="ejemplo.com"
                  class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>

              <!-- Proveedor / Registrador -->
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 mb-1">Registrador / Proveedor</label>
                <input
                  v-model="formData.proveedor"
                  type="text"
                  placeholder="Puvnex, GoDaddy, Namecheap..."
                  class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>

              <!-- Costo Anual -->
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 mb-1">Costo Anual (MXN)</label>
                <input
                  v-model.number="formData.costo_dominio"
                  type="number"
                  step="0.01"
                  placeholder="550.00"
                  class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>

              <!-- Fecha de Vencimiento / Renovación -->
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 mb-1">Fecha de Renovación</label>
                <input
                  v-model="formData.fecha_pago"
                  type="date"
                  class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>

              <!-- Estado de Pago -->
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 mb-1">Estado de Cobro</label>
                <select
                  v-model.number="formData.estatus_pago"
                  class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-neutral-500 transition-colors"
                >
                  <option :value="1">Pagado / Al corriente</option>
                  <option :value="0">Pendiente de Pago</option>
                </select>
              </div>

              <!-- Gestión Registrado -->
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 mb-1">Tipo de Gestión</label>
                <select
                  v-model.number="formData.registrado"
                  class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-neutral-500 transition-colors"
                >
                  <option :value="1">Registrado por Nosotros (Puvnex)</option>
                  <option :value="0">Administrado Externo</option>
                </select>
              </div>
            </div>

            <!-- Servidores DNS -->
            <div class="pt-3 border-t border-neutral-800 space-y-2">
              <span class="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Servidores DNS (Nameservers)</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  v-model="formData.ns1"
                  type="text"
                  placeholder="ns1.puvnex.io"
                  class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-500 transition-colors"
                />
                <input
                  v-model="formData.ns2"
                  type="text"
                  placeholder="ns2.puvnex.io"
                  class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>
            </div>

            <!-- Botones -->
            <div class="pt-4 border-t border-neutral-800 flex items-center justify-end space-x-2.5 shrink-0">
              <button
                type="button"
                @click="emit('close')"
                class="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                <i v-if="isSaving" class="pi pi-spin pi-spinner text-xs"></i>
                <span>{{ isEditing ? 'Guardar Cambios' : 'Registrar Dominio' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-smooth-enter-active,
.modal-smooth-leave-active {
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-smooth-enter-active .modal-dialog,
.modal-smooth-leave-active .modal-dialog {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-smooth-enter-from,
.modal-smooth-leave-to {
  opacity: 0;
}

.modal-smooth-enter-from .modal-dialog,
.modal-smooth-leave-to .modal-dialog {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}
</style>
