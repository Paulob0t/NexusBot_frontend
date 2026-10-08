<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { HostingDetail } from '@/api/hostings'

const router = useRouter()

const props = defineProps<{
  isOpen: boolean
  hosting: HostingDetail | null
  rawPassword?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'reset-form'): void
}>()

function sendHostingWhatsApp() {
  if (!props.hosting) return
  const phone = props.hosting.cliente_telefono?.replace(/[^0-9]/g, '') || ''
  const pass = props.rawPassword || props.hosting.contrasena_normal || '••••••••'
  const nsList = [props.hosting.ns1, props.hosting.ns2].filter(Boolean).join(', ')

  let texto = `¡Hola ${props.hosting.cliente_nombre}! Tu servicio de Hosting ha quedado aprovisionado con éxito en Puvnex:\n\n`
  texto += `🖥️ Servidor / Host: ${props.hosting.nom_host}\n`
  if (props.hosting.dominio) {
    texto += `🌐 Dominio Principal: https://${props.hosting.dominio}\n`
  }
  if (props.hosting.url_acceso) {
    texto += `🔑 Panel cPanel: ${props.hosting.url_acceso}\n`
  }
  texto += `👤 Usuario: ${props.hosting.usuario || 'admin'}\n`
  texto += `🔒 Contraseña: ${pass}\n`
  if (nsList) {
    texto += `📡 Nameservers DNS: ${nsList}\n`
  }
  if (props.hosting.fecha_pago) {
    texto += `📅 Próximo vencimiento: ${props.hosting.fecha_pago}\n`
  }
  texto += `\n¡Quedamos a tu servicio!`

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(texto)}`, '_blank')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-smooth">
      <div
        v-if="isOpen && hosting"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div class="w-full max-w-lg bg-[#0c0c0e] border border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-5 relative">
          <button
            @click="emit('close')"
            class="absolute top-5 right-5 text-neutral-400 hover:text-white p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
            title="Cerrar"
          >
            <i class="pi pi-times text-xs"></i>
          </button>

          <div class="flex items-center space-x-3.5">
            <div class="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center text-lg font-bold">
              <i class="pi pi-server"></i>
            </div>
            <div>
              <h3 class="text-sm font-semibold tracking-tight text-white">Hosting Aprovisionado</h3>
              <p class="text-xs text-neutral-400 font-mono">{{ hosting.nom_host }} (#{{ hosting.id_orden }})</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#141417] border border-neutral-800 space-y-2 text-xs">
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Cliente:</span>
              <span class="font-medium text-white">{{ hosting.cliente_empresa }} ({{ hosting.cliente_nombre }})</span>
            </div>
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Plan / Servicio:</span>
              <span class="text-neutral-300">{{ hosting.tipo_producto || 'Hosting Compartido' }}</span>
            </div>
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Tarifa:</span>
              <span class="text-white font-mono font-semibold">${{ Number(hosting.costo_producto).toFixed(2) }} {{ hosting.moneda }} ({{ hosting.frecuencia_label }})</span>
            </div>
            <div v-if="hosting.fecha_pago" class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Vigencia / Renovación:</span>
              <span class="text-neutral-300 font-mono">{{ hosting.fecha_pago }}</span>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="space-y-2">
            <span class="text-[10px] uppercase font-medium text-neutral-500 tracking-wider">Acciones inmediatas</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                @click="sendHostingWhatsApp"
                class="p-3 rounded-xl bg-[#141417] hover:bg-neutral-800 text-emerald-400 border border-neutral-800 hover:border-emerald-500/40 font-medium flex items-center space-x-2 transition-colors"
              >
                <i class="pi pi-whatsapp text-sm"></i>
                <span>Enviar WhatsApp</span>
              </button>
              <button
                @click="router.push(`/pagos/nuevo?cliente_id=${hosting.cliente_id}&tipo_servicio=1&id_servicio=${hosting.id_orden}&monto=${hosting.costo_producto}&concepto=${encodeURIComponent('Servicio de Hosting: ' + hosting.nom_host)}`)"
                class="p-3 rounded-xl bg-[#141417] hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 font-medium flex items-center space-x-2 transition-colors"
              >
                <i class="pi pi-credit-card text-sm"></i>
                <span>Generar Cobro</span>
              </button>
              <button
                @click="router.push(`/dominios/nuevo?cliente_id=${hosting.cliente_id}`)"
                class="p-3 rounded-xl bg-[#141417] hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 font-medium flex items-center space-x-2 transition-colors"
              >
                <i class="pi pi-globe text-sm"></i>
                <span>Asignar Dominio</span>
              </button>
              <button
                @click="emit('reset-form')"
                class="p-3 rounded-xl bg-[#141417] hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 font-medium flex items-center space-x-2 transition-colors"
              >
                <i class="pi pi-plus text-sm"></i>
                <span>Registrar Otro</span>
              </button>
            </div>
          </div>

          <div class="pt-2 border-t border-neutral-800 flex justify-end">
            <button
              @click="router.push('/hostings')"
              class="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all"
            >
              Ir a Directorio de Hostings
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-smooth-enter-active,
.modal-smooth-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-smooth-enter-from,
.modal-smooth-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
