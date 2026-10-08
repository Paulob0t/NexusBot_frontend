<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { PagoDetail } from '@/api/pagos'

const router = useRouter()

const props = defineProps<{
  isOpen: boolean
  pago: PagoDetail | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'reset-form'): void
}>()

function sendPagoWhatsApp() {
  if (!props.pago) return
  const phone = props.pago.cliente_telefono?.replace(/[^0-9]/g, '') || ''
  const isPaid = props.pago.estatus === 1

  let texto = `¡Hola ${props.pago.cliente_nombre}! Te compartimos los detalles de tu comprobante en Puvnex:\n\n`
  texto += `📄 Folio / Concepto: ${props.pago.concepto}\n`
  texto += `💵 Monto: $${Number(props.pago.monto).toFixed(2)} ${props.pago.currency}\n`
  texto += `💳 Método: ${props.pago.forma_pago_label}\n`
  texto += `📌 Estatus: ${isPaid ? '✅ Acreditado / Pagado' : '⏳ Pendiente de Pago'}\n`
  if (!isPaid && props.pago.fecha_limite_pago) {
    texto += `📅 Fecha límite de pago: ${props.pago.fecha_limite_pago}\n`
  }
  if (props.pago.id_pago) {
    texto += `🔖 Referencia: ${props.pago.id_pago}\n`
  }
  texto += `\n¡Gracias por tu preferencia!`

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(texto)}`, '_blank')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && pago"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <Transition name="modal-smooth" appear>
        <div class="w-full max-w-lg bg-[#0c0c0e] border border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-5 relative">
          <button
            @click="emit('close')"
            class="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors"
            title="Cerrar"
          >
            <i class="pi pi-times text-xs"></i>
          </button>

          <div class="flex items-center space-x-3.5">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 flex items-center justify-center text-lg font-bold">
              <i class="pi pi-check-circle"></i>
            </div>
            <div>
              <h3 class="text-base font-semibold text-white">¡Cobro Registrado con Éxito!</h3>
              <p class="text-xs text-neutral-400 font-mono">Folio #{{ pago.id }} • {{ pago.id_pago || 'Sin referencia' }}</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#141417] border border-neutral-800 space-y-2 text-xs">
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Cliente:</span>
              <span class="font-medium text-white">{{ pago.cliente_empresa }} ({{ pago.cliente_nombre }})</span>
            </div>
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Concepto:</span>
              <span class="text-neutral-200 font-medium truncate max-w-[240px]">{{ pago.concepto }}</span>
            </div>
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Monto:</span>
              <span class="text-white font-mono font-bold text-sm">${{ Number(pago.monto).toFixed(2) }} {{ pago.currency }}</span>
            </div>
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Estatus:</span>
              <span
                class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
                :class="pago.estatus === 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'"
              >
                <span class="w-1 h-1 rounded-full" :class="pago.estatus === 1 ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                <span>{{ pago.estatus_label }}</span>
              </span>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="space-y-2">
            <span class="text-[10px] uppercase font-medium text-neutral-400 tracking-wider">¿Qué deseas hacer ahora?</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                @click="sendPagoWhatsApp"
                class="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center space-x-2 transition-colors"
              >
                <i class="pi pi-whatsapp text-sm"></i>
                <span>Enviar WhatsApp</span>
              </button>
              <button
                @click="emit('reset-form')"
                class="p-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold flex items-center space-x-2 transition-all shadow-sm"
              >
                <i class="pi pi-plus text-sm"></i>
                <span>Registrar Otro Pago</span>
              </button>
              <button
                @click="router.push('/pagos')"
                class="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 font-semibold flex items-center space-x-2 transition-colors"
              >
                <i class="pi pi-receipt text-sm"></i>
                <span>Ver Directorio de Pagos</span>
              </button>
              <button
                @click="router.push('/clientes')"
                class="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 font-semibold flex items-center space-x-2 transition-colors"
              >
                <i class="pi pi-users text-sm"></i>
                <span>Ver Clientes</span>
              </button>
            </div>
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
