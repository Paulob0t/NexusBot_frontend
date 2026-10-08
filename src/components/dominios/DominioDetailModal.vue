<script setup lang="ts">
import { ref } from 'vue'
import type { DominioDetail } from '@/api/dominios'
import { useToast } from '@/composables/useToast'

defineProps<{
  isOpen: boolean
  isLoading: boolean
  dominio: DominioDetail | null
  isSuperAdmin: boolean
  formatCurrency: (amount: number, currency?: string) => string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', dom: DominioDetail): void
}>()

const { showToast } = useToast()
const showPassword = ref(false)

function copyToClipboard(text: string, label: string) {
  if (!text) return
  navigator.clipboard.writeText(text)
  showToast(`${label} copiado al portapapeles`)
}
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
                <i class="pi pi-globe text-sm"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white">{{ dominio?.url_dominio || 'Detalle del Dominio' }}</h3>
                <p class="text-[11px] text-neutral-500 font-mono">{{ dominio?.cliente_empresa }} • ID: #{{ dominio?.id_dominio }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button
                v-if="dominio && isSuperAdmin"
                @click="emit('edit', dominio)"
                class="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium border border-neutral-800 flex items-center space-x-1.5 transition-colors"
              >
                <i class="pi pi-pencil text-xs text-neutral-400"></i>
                <span>Editar</span>
              </button>
              <button
                @click="emit('close')"
                class="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
            <div v-if="isLoading" class="py-12 text-center space-y-2">
              <i class="pi pi-spin pi-spinner text-2xl text-neutral-400"></i>
              <p class="text-neutral-500 text-[11px]">Cargando información del dominio...</p>
            </div>

            <template v-else-if="dominio">
              <!-- Datos Generales -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2.5">
                  <span class="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Infraestructura & Registro</span>
                  <div>
                    <span class="text-neutral-500 block text-[11px]">Registrador / Proveedor</span>
                    <strong class="text-neutral-200 text-xs">{{ dominio.proveedor || 'Puvnex' }}</strong>
                  </div>
                  <div>
                    <span class="text-neutral-500 block text-[11px]">Costo de Renovación</span>
                    <strong class="text-emerald-400 font-mono text-xs">{{ formatCurrency(dominio.costo_dominio) }}</strong>
                  </div>
                  <div>
                    <span class="text-neutral-500 block text-[11px]">Fecha de Vencimiento</span>
                    <span
                      :class="[
                        'font-mono font-semibold text-xs',
                        dominio.estado_vencimiento === 'vencido' ? 'text-rose-400' : 'text-neutral-200'
                      ]"
                    >
                      {{ dominio.fecha_pago || 'No especificada' }}
                    </span>
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2.5">
                  <span class="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Titular / Cliente</span>
                  <div>
                    <span class="text-neutral-500 block text-[11px]">Empresa</span>
                    <strong class="text-neutral-200 text-xs">{{ dominio.cliente_empresa }}</strong>
                  </div>
                  <div>
                    <span class="text-neutral-500 block text-[11px]">Contacto</span>
                    <span class="text-neutral-400 text-xs">{{ dominio.cliente_nombre }}</span>
                  </div>
                  <div v-if="dominio.cliente_correo">
                    <span class="text-neutral-500 block text-[11px]">Correo</span>
                    <a :href="`mailto:${dominio.cliente_correo}`" class="text-neutral-300 hover:underline font-mono text-xs">
                      {{ dominio.cliente_correo }}
                    </a>
                  </div>
                </div>
              </div>

              <!-- Servidores DNS (Nameservers) -->
              <div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Servidores DNS (Nameservers)</span>
                  <span class="text-[10px] text-neutral-600">Haz clic en copiar para usar</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between group">
                    <div class="flex items-center space-x-2 truncate pr-2">
                      <span class="text-neutral-500 text-[10px]">NS1:</span>
                      <span class="text-neutral-200 text-xs truncate">{{ dominio.ns1 || 'ns1.puvnex.io' }}</span>
                    </div>
                    <button
                      @click="copyToClipboard(dominio.ns1 || 'ns1.puvnex.io', 'NS1')"
                      class="text-neutral-500 hover:text-white p-1 rounded transition-colors"
                      title="Copiar NS1"
                    >
                      <i class="pi pi-copy text-xs"></i>
                    </button>
                  </div>

                  <div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between group">
                    <div class="flex items-center space-x-2 truncate pr-2">
                      <span class="text-neutral-500 text-[10px]">NS2:</span>
                      <span class="text-neutral-200 text-xs truncate">{{ dominio.ns2 || 'ns2.puvnex.io' }}</span>
                    </div>
                    <button
                      @click="copyToClipboard(dominio.ns2 || 'ns2.puvnex.io', 'NS2')"
                      class="text-neutral-500 hover:text-white p-1 rounded transition-colors"
                      title="Copiar NS2"
                    >
                      <i class="pi pi-copy text-xs"></i>
                    </button>
                  </div>

                  <div v-if="dominio.ns3" class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between group">
                    <div class="flex items-center space-x-2 truncate pr-2">
                      <span class="text-neutral-500 text-[10px]">NS3:</span>
                      <span class="text-neutral-200 text-xs truncate">{{ dominio.ns3 }}</span>
                    </div>
                    <button
                      @click="copyToClipboard(dominio.ns3, 'NS3')"
                      class="text-neutral-500 hover:text-white p-1 rounded transition-colors"
                      title="Copiar NS3"
                    >
                      <i class="pi pi-copy text-xs"></i>
                    </button>
                  </div>

                  <div v-if="dominio.ns4" class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between group">
                    <div class="flex items-center space-x-2 truncate pr-2">
                      <span class="text-neutral-500 text-[10px]">NS4:</span>
                      <span class="text-neutral-200 text-xs truncate">{{ dominio.ns4 }}</span>
                    </div>
                    <button
                      @click="copyToClipboard(dominio.ns4, 'NS4')"
                      class="text-neutral-500 hover:text-white p-1 rounded transition-colors"
                      title="Copiar NS4"
                    >
                      <i class="pi pi-copy text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Accesos / Credenciales (Admin) -->
              <div v-if="isSuperAdmin && (dominio.url_admin || dominio.usuario || dominio.contrasena_normal)" class="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
                <span class="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Panel de Administración & Credenciales</span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div v-if="dominio.url_admin" class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span class="text-neutral-500 block text-[10px] mb-0.5">URL Admin</span>
                    <a :href="dominio.url_admin" target="_blank" class="text-neutral-200 hover:underline truncate block font-mono text-xs">
                      {{ dominio.url_admin }}
                    </a>
                  </div>
                  <div v-if="dominio.usuario" class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span class="text-neutral-500 block text-[10px] mb-0.5">Usuario</span>
                      <span class="text-white font-mono font-semibold text-xs">{{ dominio.usuario }}</span>
                    </div>
                    <button
                      @click="copyToClipboard(dominio.usuario, 'Usuario')"
                      class="text-neutral-500 hover:text-white p-1 rounded"
                    >
                      <i class="pi pi-copy text-xs"></i>
                    </button>
                  </div>
                  <div v-if="dominio.contrasena_normal" class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span class="text-neutral-500 block text-[10px] mb-0.5">Contraseña</span>
                      <span class="text-neutral-100 font-mono text-xs">
                        {{ showPassword ? dominio.contrasena_normal : '••••••••••••' }}
                      </span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <button
                        @click="showPassword = !showPassword"
                        class="text-neutral-500 hover:text-white p-1 rounded"
                      >
                        <i :class="showPassword ? 'pi pi-eye-slash text-xs' : 'pi pi-eye text-xs'"></i>
                      </button>
                      <button
                        @click="copyToClipboard(dominio.contrasena_normal, 'Contraseña')"
                        class="text-neutral-500 hover:text-white p-1 rounded"
                      >
                        <i class="pi pi-copy text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
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
