<script setup lang="ts">
import type { PagoPayload } from '@/api/pagos'

defineProps<{
  isOpen: boolean
  isEditing: boolean
  isSaving: boolean
  formData: PagoPayload
  clientesList: Array<{ id: number; empresa: string; nombre_contacto: string }>
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      @click.self="emit('close')"
    >
      <Transition name="modal-smooth" appear>
        <div class="w-full max-w-xl bg-[#0c0c0e] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
          <!-- Header -->
          <div class="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
                <i class="pi pi-credit-card text-sm"></i>
              </div>
              <div>
                <div class="text-sm font-semibold text-white">
                  {{ isEditing ? 'Editar Cobro / Pago' : 'Registrar Nuevo Cobro' }}
                </div>
                <div class="text-xs text-neutral-400">Genera un recibo o registra un pago recibido</div>
              </div>
            </div>
            <button
              @click="emit('close')"
              class="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-neutral-800 flex items-center justify-center transition-colors"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="emit('save')" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
            <!-- 1. Cliente Titular -->
            <div>
              <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                Cliente <span class="text-rose-400">*</span>
              </label>
              <select
                v-model="formData.id_clie"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-white focus:outline-none focus:border-neutral-600 text-xs"
              >
                <option :value="0" disabled>Selecciona un cliente...</option>
                <option v-for="c in clientesList" :key="c.id" :value="c.id">
                  {{ c.empresa ? `${c.empresa} (${c.nombre_contacto})` : c.nombre_contacto }}
                </option>
              </select>
            </div>

            <!-- 2. Concepto -->
            <div>
              <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                Concepto / Descripción <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="formData.concepto"
                type="text"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 text-xs"
                placeholder="ej. Renovación anual de Hosting y Dominio"
              />
            </div>

            <!-- 3. Monto y Moneda -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Monto ($) <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model.number="formData.monto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-white focus:outline-none focus:border-neutral-600 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Moneda
                </label>
                <select
                  v-model="formData.currency"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-white focus:outline-none focus:border-neutral-600 text-xs font-mono"
                >
                  <option value="MXN">MXN (Pesos Mexicanos)</option>
                  <option value="USD">USD (Dólares)</option>
                </select>
              </div>
            </div>

            <!-- 4. Tipo de Servicio & Método de Pago -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Tipo de Servicio
                </label>
                <select
                  v-model="formData.tipo_servicio"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-white focus:outline-none focus:border-neutral-600 text-xs"
                >
                  <option :value="0">Manual / Otro servicio</option>
                  <option :value="1">Hosting / Servidor</option>
                  <option :value="2">Dominio</option>
                  <option :value="3">Desarrollo Web / Diseño</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Forma / Método de Pago
                </label>
                <select
                  v-model="formData.forma_pago"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-white focus:outline-none focus:border-neutral-600 text-xs"
                >
                  <option :value="1">Transferencia / Depósito</option>
                  <option :value="2">Efectivo / OXXO</option>
                  <option :value="3">Tarjeta / Stripe</option>
                  <option :value="4">PayPal</option>
                </select>
              </div>
            </div>

            <!-- 5. Fechas -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Fecha de Emisión
                </label>
                <input
                  v-model="formData.fecha"
                  type="date"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-white focus:outline-none focus:border-neutral-600 text-xs font-mono [color-scheme:dark]"
                />
              </div>
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Fecha Límite de Pago
                </label>
                <input
                  v-model="formData.fecha_limite_pago"
                  type="date"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-white focus:outline-none focus:border-neutral-600 text-xs font-mono [color-scheme:dark]"
                />
              </div>
            </div>

            <!-- 6. Estatus y Referencia -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Estatus del Pago
                </label>
                <select
                  v-model="formData.estatus"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-white focus:outline-none focus:border-neutral-600 text-xs font-medium"
                >
                  <option :value="0">Pendiente de Cobro</option>
                  <option :value="1">Acreditado / Pagado</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Referencia / Folio
                </label>
                <input
                  v-model="formData.id_pago"
                  type="text"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 text-xs font-mono"
                  placeholder="ej. TRANS-98234"
                />
              </div>
            </div>

            <!-- Botones -->
            <div class="pt-4 border-t border-neutral-800 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                @click="emit('close')"
                class="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center space-x-2 transition-all disabled:opacity-50 shadow-sm"
              >
                <i v-if="isSaving" class="pi pi-spin pi-spinner text-xs"></i>
                <i v-else class="pi pi-check text-xs"></i>
                <span>{{ isSaving ? 'Guardando...' : (isEditing ? 'Actualizar Cobro' : 'Registrar Cobro') }}</span>
              </button>
            </div>
          </form>
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
