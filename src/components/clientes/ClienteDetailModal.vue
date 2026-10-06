<script setup lang="ts">
import { ref } from 'vue'
import type { ClienteDetail } from '@/api/clientes'

defineProps<{
  isOpen: boolean
  isLoading: boolean
  cliente: ClienteDetail | null
  isSuperAdmin: boolean
  getInitials: (name: string) => string
  formatWhatsAppLink: (phone: string | null) => string
  formatCurrency: (amount: number, currency?: string) => string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', cliente: ClienteDetail): void
}>()

const activeTab = ref<'info' | 'dominios' | 'hosting' | 'pagos'>('info')
</script>

<template>
  <Transition name="modal-smooth">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="modal-dialog w-full max-w-4xl bg-[#0c0c0e] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header Modal -->
        <div class="p-5 bg-[#09090b] border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-medium text-white text-xs font-mono">
              {{ getInitials(cliente?.empresa || '') }}
            </div>
            <div>
              <h3 class="text-sm font-semibold text-white">{{ cliente?.empresa || 'Cargando...' }}</h3>
              <p class="text-[11px] text-neutral-500 font-mono">{{ cliente?.nombre_contacto }} • ID: #{{ cliente?.id }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              v-if="cliente && isSuperAdmin"
              @click="emit('edit', cliente)"
              class="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium border border-neutral-800 flex items-center space-x-1.5 transition-all duration-200"
            >
              <i class="pi pi-pencil text-xs"></i>
              <span>Editar</span>
            </button>
            <button
              @click="emit('close')"
              class="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Pestañas del Detalle -->
        <div class="flex items-center px-5 pt-2.5 border-b border-neutral-900 bg-[#0c0c0e] gap-4 text-xs font-medium shrink-0">
          <button
            @click="activeTab = 'info'"
            :class="[
              'pb-2.5 transition-all duration-200 border-b-2',
              activeTab === 'info' ? 'border-neutral-200 text-white font-semibold' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            ]"
          >
            Información General
          </button>
          <button
            @click="activeTab = 'dominios'"
            :class="[
              'pb-2.5 transition-all duration-200 border-b-2 flex items-center space-x-1.5',
              activeTab === 'dominios' ? 'border-neutral-200 text-white font-semibold' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            ]"
          >
            <span>Dominios</span>
            <span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-800">
              {{ cliente?.total_dominios ?? 0 }}
            </span>
          </button>
          <button
            @click="activeTab = 'hosting'"
            :class="[
              'pb-2.5 transition-all duration-200 border-b-2 flex items-center space-x-1.5',
              activeTab === 'hosting' ? 'border-neutral-200 text-white font-semibold' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            ]"
          >
            <span>Hosting</span>
            <span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-800">
              {{ cliente?.total_hostings ?? 0 }}
            </span>
          </button>
          <button
            @click="activeTab = 'pagos'"
            :class="[
              'pb-2.5 transition-all duration-200 border-b-2 flex items-center space-x-1.5',
              activeTab === 'pagos' ? 'border-neutral-200 text-white font-semibold' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            ]"
          >
            <span>Historial Pagos</span>
            <span v-if="(cliente?.total_pagos_pendientes ?? 0) > 0" class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-red-950/40 text-red-400 border border-red-900/50">
              {{ cliente?.total_pagos_pendientes }}
            </span>
          </button>
        </div>

        <!-- Cuerpo del Modal -->
        <div class="p-6 overflow-y-auto flex-1 space-y-5 bg-[#09090b] custom-scrollbar">
          <div v-if="isLoading" class="py-12 text-center">
            <i class="pi pi-spin pi-spinner text-2xl text-neutral-400"></i>
          </div>

          <template v-else-if="cliente">
            <Transition name="tab-slide" mode="out-in">
              <!-- TAB 1: INFORMACIÓN GENERAL -->
              <div v-if="activeTab === 'info'" key="tab-info" class="space-y-4 text-xs">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-3">
                    <h4 class="font-medium text-white text-xs uppercase tracking-wider font-mono">Datos de Contacto</h4>
                    <div class="space-y-2 text-neutral-300">
                      <div>
                        <span class="text-neutral-500 block text-[10px] font-mono">Nombre de Contacto</span>
                        <strong class="text-white text-xs">{{ cliente.nombre_contacto || 'N/D' }}</strong>
                      </div>
                      <div>
                        <span class="text-neutral-500 block text-[10px] font-mono">Correo Electrónico</span>
                        <a :href="`mailto:${cliente.correo}`" class="text-neutral-300 hover:underline">
                          {{ cliente.correo || 'N/D' }}
                        </a>
                      </div>
                      <div>
                        <span class="text-neutral-500 block text-[10px] font-mono">Teléfono / WhatsApp</span>
                        <div class="flex items-center space-x-2 mt-0.5 font-mono">
                          <span class="text-neutral-200">{{ cliente.telefono || 'N/D' }}</span>
                          <a
                            v-if="cliente.telefono"
                            :href="formatWhatsAppLink(cliente.telefono)"
                            target="_blank"
                            class="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 text-[10px] hover:text-white transition-colors"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-3">
                    <h4 class="font-medium text-white text-xs uppercase tracking-wider font-mono">Datos Fiscales</h4>
                    <div class="space-y-2 text-neutral-300">
                      <div>
                        <span class="text-neutral-500 block text-[10px] font-mono">Razón Social</span>
                        <strong class="text-white text-xs">{{ cliente.rsocial || 'N/D' }}</strong>
                      </div>
                      <div>
                        <span class="text-neutral-500 block text-[10px] font-mono">RFC</span>
                        <span class="px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 font-mono text-[11px]">
                          {{ cliente.rfc || 'XAXX010101000' }}
                        </span>
                      </div>
                      <div>
                        <span class="text-neutral-500 block text-[10px] font-mono">Dirección Registrada</span>
                        <span class="text-neutral-400 text-xs">
                          {{ [cliente.calle, cliente.next, cliente.col, cliente.ciudad, cliente.estado].filter(Boolean).join(', ') || 'Sin dirección fiscal registrada' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Especificaciones -->
                <div v-if="cliente.especificacion" class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-1.5">
                  <h4 class="font-medium text-white text-xs font-mono uppercase">Requerimientos / Notas</h4>
                  <p class="text-neutral-300 leading-relaxed whitespace-pre-wrap text-xs">{{ cliente.especificacion }}</p>
                </div>
              </div>

              <!-- TAB 2: DOMINIOS -->
              <div v-else-if="activeTab === 'dominios'" key="tab-dominios" class="space-y-3 text-xs">
                <div v-if="cliente.dominios.length === 0" class="py-8 text-center text-neutral-500 font-mono">
                  <i class="pi pi-globe text-2xl mb-2 block text-neutral-600"></i>
                  <span>No hay dominios web asociados a este cliente.</span>
                </div>

                <div v-else class="space-y-2">
                  <div
                    v-for="dom in cliente.dominios"
                    :key="dom.id"
                    class="p-3.5 rounded-lg bg-[#0c0c0e] border border-neutral-800 flex items-center justify-between hover:border-neutral-700 transition-colors"
                  >
                    <div class="flex items-center space-x-3">
                      <div class="w-7 h-7 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 flex items-center justify-center">
                        <i class="pi pi-globe text-xs"></i>
                      </div>
                      <div>
                        <a :href="`https://${dom.dominio}`" target="_blank" class="font-medium text-white hover:underline text-xs">
                          {{ dom.dominio }}
                        </a>
                        <div class="text-[11px] text-neutral-500 font-mono">
                          Vencimiento: {{ dom.fecha_vencimiento || 'Sin fecha' }}
                        </div>
                      </div>
                    </div>

                    <div class="text-right">
                      <span
                        v-if="dom.dias_restantes !== null && dom.dias_restantes < 0"
                        class="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/40 text-red-400 border border-red-900/50"
                      >
                        Venció hace {{ Math.abs(dom.dias_restantes) }}d
                      </span>
                      <span
                        v-else-if="dom.dias_restantes !== null && dom.dias_restantes <= 30"
                        class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/30 text-amber-400 border border-amber-900/40"
                      >
                        Vence en {{ dom.dias_restantes }}d
                      </span>
                      <span
                        v-else
                        class="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-800"
                      >
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TAB 3: HOSTING -->
              <div v-else-if="activeTab === 'hosting'" key="tab-hosting" class="space-y-3 text-xs">
                <div v-if="cliente.hostings.length === 0" class="py-8 text-center text-neutral-500 font-mono">
                  <i class="pi pi-server text-2xl mb-2 block text-neutral-600"></i>
                  <span>No hay planes de hosting asignados a este cliente.</span>
                </div>

                <div v-else class="space-y-2">
                  <div
                    v-for="h in cliente.hostings"
                    :key="h.id"
                    class="p-3.5 rounded-lg bg-[#0c0c0e] border border-neutral-800 flex items-center justify-between hover:border-neutral-700 transition-colors"
                  >
                    <div class="flex items-center space-x-3">
                      <div class="w-7 h-7 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 flex items-center justify-center">
                        <i class="pi pi-server text-xs"></i>
                      </div>
                      <div>
                        <h5 class="font-medium text-white text-xs">{{ h.nombre_plan }}</h5>
                        <p class="text-[11px] text-neutral-500 font-mono">{{ h.dominio }}</p>
                      </div>
                    </div>

                    <div class="text-right">
                      <span class="text-xs font-semibold text-white font-mono block">{{ formatCurrency(h.precio) }}</span>
                      <span class="text-[10px] text-neutral-500 font-mono">Renovación: {{ h.fecha_vencimiento || 'N/D' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TAB 4: HISTORIAL DE PAGOS -->
              <div v-else-if="activeTab === 'pagos'" key="tab-pagos" class="space-y-3 text-xs">
                <div v-if="cliente.pagos.length === 0" class="py-8 text-center text-neutral-500 font-mono">
                  <i class="pi pi-credit-card text-2xl mb-2 block text-neutral-600"></i>
                  <span>No hay registros de pago para este cliente.</span>
                </div>

                <div v-else class="space-y-2">
                  <div
                    v-for="pago in cliente.pagos"
                    :key="pago.id"
                    class="p-3.5 rounded-lg bg-[#0c0c0e] border border-neutral-800 flex items-center justify-between hover:border-neutral-700 transition-colors"
                  >
                    <div>
                      <h5 class="font-medium text-white text-xs">{{ pago.concepto }}</h5>
                      <p class="text-[11px] text-neutral-500 font-mono">Vencimiento: {{ pago.fecha_vencimiento || 'N/D' }}</p>
                    </div>

                    <div class="text-right space-y-1">
                      <div class="font-semibold text-white font-mono text-xs">{{ formatCurrency(pago.monto, pago.moneda) }}</div>
                      <span
                        :class="[
                          'px-2 py-0.5 rounded text-[10px] font-mono',
                          pago.estatus === 1
                            ? 'bg-neutral-900 text-emerald-400 border border-neutral-800'
                            : 'bg-red-950/40 text-red-400 border border-red-900/50'
                        ]"
                      >
                        {{ pago.estatus_texto }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </template>
        </div>
      </div>
    </div>
  </Transition>
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

/* Transición suave para cambio de pestañas */
.tab-slide-enter-active,
.tab-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.tab-slide-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.tab-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
