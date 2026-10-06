<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { ClienteDetail } from '@/api/clientes'

const router = useRouter()

const props = defineProps<{
  isOpen: boolean
  client: ClienteDetail | null
  rawPassword?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function sendWelcomeWhatsApp() {
  if (!props.client) return
  const phone = props.client.telefono?.replace(/[^0-9]/g, '') || ''
  const pass = props.rawPassword || `Nexus${props.client.id}*`
  const texto = `¡Hola ${props.client.nombre_contacto}! Te damos la bienvenida a Nexus CRM. Tus credenciales de acceso al portal de clientes son:\n\n👤 Usuario: ${props.client.correo || 'Tu correo'}\n🔑 Contraseña: ${pass}\n🌐 Acceso: ${window.location.origin}/login\n\n¡Quedamos a tu servicio!`
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(texto)}`, '_blank')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-smooth">
      <div
        v-if="isOpen && client"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div class="modal-dialog w-full max-w-lg bg-[#0c0c0e] border border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-5 relative">
          <button
            @click="emit('close')"
            class="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 transition-colors"
            title="Cerrar"
          >
            <i class="pi pi-times text-xs"></i>
          </button>

          <div class="flex items-center space-x-3.5">
            <div class="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 flex items-center justify-center text-lg font-bold">
              <i class="pi pi-check"></i>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-white">Cliente Registrado con Éxito</h3>
              <p class="text-xs text-neutral-500">{{ client.empresa }} <span class="font-mono text-neutral-400">#{{ client.id }}</span></p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2 text-xs">
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Contacto:</span>
              <span class="font-medium text-neutral-200">{{ client.nombre_contacto }}</span>
            </div>
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Correo:</span>
              <span class="font-mono text-neutral-300">{{ client.correo || 'Sin correo' }}</span>
            </div>
            <div class="flex justify-between text-neutral-300">
              <span class="text-neutral-500">Teléfono:</span>
              <span class="text-neutral-300 font-mono">{{ client.telefono || 'Sin teléfono' }}</span>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="space-y-2">
            <span class="text-[10px] uppercase font-medium text-neutral-500 tracking-wider">Acciones Directas</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                @click="sendWelcomeWhatsApp"
                class="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-medium flex items-center space-x-2 transition-all duration-200"
              >
                <i class="pi pi-whatsapp text-xs text-neutral-400"></i>
                <span>Enviar WhatsApp</span>
              </button>
              <button
                @click="router.push(`/dominios/nuevo?cliente_id=${client.id}`)"
                class="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-medium flex items-center space-x-2 transition-all duration-200"
              >
                <i class="pi pi-globe text-xs text-neutral-400"></i>
                <span>Asignar Dominio</span>
              </button>
              <button
                @click="router.push(`/hostings/nuevo?cliente_id=${client.id}`)"
                class="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-medium flex items-center space-x-2 transition-all duration-200"
              >
                <i class="pi pi-server text-xs text-neutral-400"></i>
                <span>Asignar Hosting</span>
              </button>
              <button
                @click="router.push(`/pagos/nuevo?cliente_id=${client.id}`)"
                class="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-medium flex items-center space-x-2 transition-all duration-200"
              >
                <i class="pi pi-credit-card text-xs text-neutral-400"></i>
                <span>Generar Cobro</span>
              </button>
            </div>
          </div>

          <div class="pt-3 border-t border-neutral-800/80 flex justify-end">
            <button
              @click="router.push('/clientes')"
              class="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all duration-200"
            >
              Ir a Directorio de Clientes
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Transición suave para el Modal */
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
