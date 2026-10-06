<script setup lang="ts">
import type { ClientePayload } from '@/api/clientes'

defineProps<{
  isOpen: boolean
  isEditing: boolean
  isSaving: boolean
  formData: ClientePayload
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
  >
    <div class="w-full max-w-2xl bg-[#0c0c0e] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header Form -->
      <div class="px-6 py-4 bg-[#09090b] border-b border-neutral-800 flex items-center justify-between shrink-0">
        <div>
          <h3 class="text-sm font-semibold text-neutral-100">
            {{ isEditing ? 'Editar Cliente' : 'Registrar Nuevo Cliente' }}
          </h3>
          <p class="text-xs text-neutral-500 mt-0.5">Complete la información del cliente</p>
        </div>
        <button
          @click="emit('close')"
          class="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <!-- Form Fields -->
      <form @submit.prevent="emit('submit')" class="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Empresa -->
          <div>
            <label class="block text-neutral-400 font-medium mb-1">Nombre de la Empresa / Negocio *</label>
            <input
              v-model="formData.empresa"
              type="text"
              required
              placeholder="Ej. Acme Corp"
              class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
            />
          </div>

          <!-- Contacto -->
          <div>
            <label class="block text-neutral-400 font-medium mb-1">Persona de Contacto *</label>
            <input
              v-model="formData.nombre_contacto"
              type="text"
              required
              placeholder="Ej. Juan Pérez"
              class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
            />
          </div>

          <!-- Correo -->
          <div>
            <label class="block text-neutral-400 font-medium mb-1">Correo Electrónico</label>
            <input
              v-model="formData.correo"
              type="email"
              placeholder="contacto@empresa.com"
              class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 font-mono"
            />
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-neutral-400 font-medium mb-1">Teléfono / WhatsApp</label>
            <input
              v-model="formData.telefono"
              type="text"
              placeholder="+52 477 123 4567"
              class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
            />
          </div>

          <!-- RFC -->
          <div>
            <label class="block text-neutral-400 font-medium mb-1">RFC</label>
            <input
              v-model="formData.rfc"
              type="text"
              placeholder="XAXX010101000"
              class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 uppercase font-mono placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
            />
          </div>

          <!-- Razón Social -->
          <div>
            <label class="block text-neutral-400 font-medium mb-1">Razón Social</label>
            <input
              v-model="formData.rsocial"
              type="text"
              placeholder="Razón Social SA de CV"
              class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
            />
          </div>
        </div>

        <!-- Dirección -->
        <div class="pt-3 border-t border-neutral-800/80 space-y-3">
          <h5 class="font-medium text-neutral-300">Dirección y Ubicación</h5>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <input
                v-model="formData.calle"
                type="text"
                placeholder="Calle y Número"
                class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <input
                v-model="formData.col"
                type="text"
                placeholder="Colonia"
                class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <input
                v-model="formData.cp"
                type="text"
                placeholder="Código Postal"
                class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <input
                v-model="formData.ciudad"
                type="text"
                placeholder="Ciudad"
                class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <input
                v-model="formData.estado"
                type="text"
                placeholder="Estado"
                class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>
        </div>

        <!-- Especificaciones -->
        <div class="pt-3 border-t border-neutral-800/80">
          <label class="block text-neutral-400 font-medium mb-1">Notas o Requerimientos</label>
          <textarea
            v-model="formData.especificacion"
            rows="3"
            placeholder="Detalles sobre los servicios contratados, notas internas, etc."
            class="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 resize-none"
          ></textarea>
        </div>

        <!-- Botones de Acción -->
        <div class="pt-4 border-t border-neutral-800/80 flex items-center justify-end space-x-3 shrink-0">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <i v-if="isSaving" class="pi pi-spin pi-spinner text-xs"></i>
            <span>{{ isEditing ? 'Guardar Cambios' : 'Registrar Cliente' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
