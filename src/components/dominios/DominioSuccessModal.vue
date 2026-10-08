<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { DominioDetail } from '@/api/dominios'

const router = useRouter()

const props = defineProps<{
  isOpen: boolean
  domain: DominioDetail | null
  rawPassword?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'reset-form'): void
}>()

function sendDomainWhatsApp() {
  if (!props.domain) return
  const phone = props.domain.cliente_telefono?.replace(/[^0-9]/g, '') || ''
  const pass = props.rawPassword || props.domain.contrasena_normal || '••••••••'
  const nsList = [props.domain.ns1, props.domain.ns2].filter(Boolean).join(', ')

  let texto = `¡Hola ${props.domain.cliente_nombre}! Tu dominio ha quedado registrado y configurado con éxito:\n\n`
  texto += `🌐 Dominio: https://${props.domain.url_dominio}\n`
  if (props.domain.url_admin) {
    texto += `🔑 Panel de Administración: ${props.domain.url_admin}\n`
    texto += `👤 Usuario: ${props.domain.usuario || 'admin'}\n`
    texto += `🔒 Contraseña: ${pass}\n`
  }
  if (nsList) {
    texto += `📡 Nameservers DNS: ${nsList}\n`
  }
  if (props.domain.fecha_pago) {
    texto += `📅 Próximo vencimiento: ${props.domain.fecha_pago}\n`
  }
  texto += `\n¡Quedamos a tu servicio en Puvnex!`

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(texto)}`, '_blank')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-smooth">
      <div
        v-if="isOpen && domain"
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
              <i class="pi pi-globe"></i>
            </div>
            <div>
              <h3 class="text-sm font-semibold tracking-tight text-white">Dominio Registrado</h3>
              <p class="text-xs text-neutral-400 font-mono">https://{{ domain.url_dominio }}</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#141417] border border-neutral-800 space-y-2 text-xs">
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Cliente / Empresa:</span>
              <span class="font-medium text-white">{{ domain.cliente_empresa }} ({{ domain.cliente_nombre }})</span>
            </div>
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Proveedor:</span>
              <span class="text-neutral-300">{{ domain.proveedor || 'Puvnex' }}</span>
            </div>
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Costo Base:</span>
              <span class="text-white font-mono font-semibold">${{ Number(domain.costo_dominio).toFixed(2) }}</span>
            </div>
            <div v-if="domain.fecha_pago" class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Vigencia / Renovación:</span>
              <span class="text-neutral-300 font-mono">{{ domain.fecha_pago }}</span>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="space-y-2">
            <span class="text-[10px] uppercase font-medium text-neutral-500 tracking-wider">Acciones inmediatas</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                @click="sendDomainWhatsApp"
                class="p-3 rounded-xl bg-[#141417] hover:bg-neutral-800 text-emerald-400 border border-neutral-800 hover:border-emerald-500/40 font-medium flex items-center space-x-2 transition-colors"
              >
                <i class="pi pi-whatsapp text-sm"></i>
                <span>Enviar WhatsApp</span>
              </button>
              <button
                @click="router.push(`/hostings/nuevo?cliente_id=${domain.cliente_id}&dominio=${encodeURIComponent(domain.url_dominio)}`)"
                class="p-3 rounded-xl bg-[#141417] hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 font-medium flex items-center space-x-2 transition-colors"
              >
                <i class="pi pi-server text-sm"></i>
                <span>Asignar Hosting</span>
              </button>
              <button
                @click="router.push(`/pagos/nuevo?cliente_id=${domain.cliente_id}&tipo_servicio=2&id_servicio=${domain.id_dominio}&monto=${domain.costo_dominio}&concepto=${encodeURIComponent('Renovación de Dominio: ' + domain.url_dominio)}`)"
                class="p-3 rounded-xl bg-[#141417] hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 font-medium flex items-center space-x-2 transition-colors"
              >
                <i class="pi pi-credit-card text-sm"></i>
                <span>Generar Cobro</span>
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
              @click="router.push('/dominios')"
              class="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all"
            >
              Ir a Directorio de Dominios
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
