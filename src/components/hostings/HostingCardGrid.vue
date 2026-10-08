<script setup lang="ts">
import type { HostingListItem } from '@/api/hostings'

defineProps<{
  hostings: HostingListItem[]
  isSuperAdmin: boolean
}>()

const emit = defineEmits<{
  (e: 'open-detail', id: number): void
  (e: 'open-edit', hosting: HostingListItem): void
  (e: 'delete-hosting', id: number, nom_host: string): void
  (e: 'send-whatsapp', hosting: HostingListItem): void
}>()

function formatCurrency(val: number, moneda = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda,
  }).format(val)
}

function openPanel(url?: string) {
  if (!url) return
  let cleanUrl = url.trim()
  if (!cleanUrl.startsWith('http')) {
    cleanUrl = 'https://' + cleanUrl
  }
  window.open(cleanUrl, '_blank')
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="host in hostings"
      :key="host.id_orden"
      class="p-5 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 hover:border-neutral-700 transition-all duration-150 flex flex-col justify-between group relative"
    >
      <div>
        <!-- Cabecera de tarjeta -->
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-3">
            <div
              :class="[
                'w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs shrink-0 border',
                host.panel_type === 'whm'
                  ? 'bg-neutral-900 text-amber-400 border-neutral-700'
                  : 'bg-neutral-900 text-neutral-200 border-neutral-800'
              ]"
            >
              <i :class="host.panel_type === 'whm' ? 'pi pi-server text-sm' : 'pi pi-globe text-sm'"></i>
            </div>
            <div>
              <div class="font-semibold text-white group-hover:text-neutral-200 transition-colors text-sm truncate max-w-[190px]">
                {{ host.nom_host }}
              </div>
              <div class="text-[11px] text-neutral-500 font-mono flex items-center space-x-1.5">
                <span>#{{ host.id_orden }}</span>
                <span>•</span>
                <span class="text-neutral-400 truncate max-w-[120px]">{{ host.dominio || 'Sin dominio' }}</span>
              </div>
            </div>
          </div>

          <span
            :class="[
              'px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border',
              host.estado_producto === 1
                ? 'bg-neutral-900 text-emerald-400 border-neutral-700'
                : 'bg-neutral-900 text-rose-400 border-neutral-700'
            ]"
          >
            {{ host.estado_producto === 1 ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <!-- Información de Cliente y Plan -->
        <div class="mt-4 p-3 rounded-xl bg-[#141417] border border-neutral-800 space-y-1.5 text-xs">
          <div class="flex justify-between items-center text-neutral-300">
            <span class="text-neutral-500 text-[11px]">Cliente:</span>
            <span class="font-medium text-white truncate max-w-[170px]">{{ host.cliente_empresa || host.cliente_nombre }}</span>
          </div>
          <div class="flex justify-between items-center text-neutral-300">
            <span class="text-neutral-500 text-[11px]">Plan:</span>
            <span class="text-neutral-300 truncate max-w-[170px]">{{ host.tipo_producto || 'Alojamiento Web' }}</span>
          </div>
          <div v-if="host.usuario" class="flex justify-between items-center text-neutral-300">
            <span class="text-neutral-500 text-[11px]">Usuario cPanel:</span>
            <span class="font-mono text-neutral-400">{{ host.usuario }}</span>
          </div>
        </div>

        <!-- Vencimiento & Costo -->
        <div class="mt-3 flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
          <div>
            <div class="text-[10px] text-neutral-500 font-mono">Vencimiento</div>
            <div class="font-mono text-neutral-300 mt-0.5">
              {{ host.fecha_pago || 'Sin fecha' }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-neutral-500 font-mono">Costo / Periodo</div>
            <div class="font-mono font-semibold text-white text-sm">
              {{ formatCurrency(host.costo_producto, host.moneda) }}
              <span class="text-[10px] font-normal text-neutral-500">/ {{ host.frecuencia_label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
        <button
          v-if="host.url_acceso || host.nom_host"
          @click="openPanel(host.url_acceso || host.nom_host)"
          class="flex-1 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
        >
          <i class="pi pi-external-link text-xs"></i>
          <span>Entrar {{ host.panel_type.toUpperCase() }}</span>
        </button>

        <div class="flex items-center space-x-1 shrink-0">
          <button
            v-if="host.cliente_telefono"
            @click="emit('send-whatsapp', host)"
            class="p-2 rounded-xl bg-neutral-900 hover:bg-emerald-500/10 text-neutral-400 hover:text-emerald-400 border border-neutral-800 transition-colors"
            title="WhatsApp recordatorio"
          >
            <i class="pi pi-whatsapp text-xs"></i>
          </button>
          <button
            @click="emit('open-detail', host.id_orden)"
            class="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
            title="Ver detalle"
          >
            <i class="pi pi-eye text-xs"></i>
          </button>
          <button
            v-if="isSuperAdmin"
            @click="emit('open-edit', host)"
            class="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
            title="Editar"
          >
            <i class="pi pi-pencil text-xs"></i>
          </button>
          <button
            v-if="isSuperAdmin"
            @click="emit('delete-hosting', host.id_orden, host.nom_host)"
            class="p-2 rounded-xl bg-neutral-900 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors"
            title="Eliminar"
          >
            <i class="pi pi-trash text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
