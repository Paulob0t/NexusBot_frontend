<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  totalSitios: number
  totalPendientes: number
  totalTicketsAbiertos: number
}>()

const router = useRouter()
</script>

<template>
  <div class="space-y-3.5">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xs font-semibold text-white uppercase tracking-wider font-mono">Accesos Rápidos</h2>
        <p class="text-[11px] text-neutral-500">Herramientas y servicios para administración de cuenta</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
      <!-- 1. PAGOS -->
      <div
        @click="router.push('/pagos')"
        class="group cursor-pointer rounded-xl bg-[#0c0c0e] hover:bg-[#121215] border border-neutral-800 hover:border-neutral-700 p-4 flex flex-col justify-between transition-colors"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
              <i class="pi pi-credit-card text-sm"></i>
            </div>
            <span
              v-if="totalPendientes > 0"
              class="px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 text-[10px] font-mono border border-amber-900/50"
            >
              {{ totalPendientes }} por pagar
            </span>
          </div>
          <h3 class="text-xs font-semibold text-white group-hover:text-neutral-200 transition-colors">Pagos & Facturación</h3>
          <p class="text-[11px] text-neutral-400 mt-1 leading-relaxed">
            Consulta historial de pagos, recibos digitales y saldos por liquidar.
          </p>
        </div>
        <div class="mt-4 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition-colors">
          <span class="text-[11px]">Abrir módulo</span>
          <i class="pi pi-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
        </div>
      </div>

      <!-- 2. MIS SITIOS WEB -->
      <div
        @click="router.push('/dominios')"
        class="group cursor-pointer rounded-xl bg-[#0c0c0e] hover:bg-[#121215] border border-neutral-800 hover:border-neutral-700 p-4 flex flex-col justify-between transition-colors"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
              <i class="pi pi-desktop text-sm"></i>
            </div>
            <span class="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 text-[10px] font-mono border border-neutral-800">
              {{ totalSitios }} sitios
            </span>
          </div>
          <h3 class="text-xs font-semibold text-white group-hover:text-neutral-200 transition-colors">Mis Sitios Web</h3>
          <p class="text-[11px] text-neutral-400 mt-1 leading-relaxed">
            Acceso a paneles administrativos, cPanel/WHM y páginas publicadas.
          </p>
        </div>
        <div class="mt-4 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition-colors">
          <span class="text-[11px]">Explorar sitios</span>
          <i class="pi pi-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
        </div>
      </div>

      <!-- 3. GESTIÓN DE DOMINIOS -->
      <div
        @click="router.push('/dominios')"
        class="group cursor-pointer rounded-xl bg-[#0c0c0e] hover:bg-[#121215] border border-neutral-800 hover:border-neutral-700 p-4 flex flex-col justify-between transition-colors"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
              <i class="pi pi-globe text-sm"></i>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-white group-hover:text-neutral-200 transition-colors">Gestión de Dominios</h3>
          <p class="text-[11px] text-neutral-400 mt-1 leading-relaxed">
            Configuración de servidores DNS, transferencias y fechas de renovación.
          </p>
        </div>
        <div class="mt-4 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition-colors">
          <span class="text-[11px]">Administrar dominios</span>
          <i class="pi pi-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
        </div>
      </div>

      <!-- 4. HOSTING & SERVIDORES -->
      <div
        @click="router.push('/hostings')"
        class="group cursor-pointer rounded-xl bg-[#0c0c0e] hover:bg-[#121215] border border-neutral-800 hover:border-neutral-700 p-4 flex flex-col justify-between transition-colors"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
              <i class="pi pi-server text-sm"></i>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-white group-hover:text-neutral-200 transition-colors">Servicios de Hosting</h3>
          <p class="text-[11px] text-neutral-400 mt-1 leading-relaxed">
            Consulta detalles de tus paquetes de alojamiento y estado de servidores.
          </p>
        </div>
        <div class="mt-4 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition-colors">
          <span class="text-[11px]">Ver hosting</span>
          <i class="pi pi-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
        </div>
      </div>

      <!-- 5. SOPORTE TÉCNICO & TICKETS -->
      <div
        @click="router.push('/solicitudes')"
        class="group cursor-pointer rounded-xl bg-[#0c0c0e] hover:bg-[#121215] border border-neutral-800 hover:border-neutral-700 p-4 flex flex-col justify-between transition-colors"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
              <i class="pi pi-headphones text-sm"></i>
            </div>
            <span
              v-if="totalTicketsAbiertos > 0"
              class="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 text-[10px] font-mono border border-neutral-800"
            >
              {{ totalTicketsAbiertos }} activos
            </span>
          </div>
          <h3 class="text-xs font-semibold text-white group-hover:text-neutral-200 transition-colors">Soporte Técnico</h3>
          <p class="text-[11px] text-neutral-400 mt-1 leading-relaxed">
            Crea solicitudes de cambios en tu web, soporte de correo y seguimiento.
          </p>
        </div>
        <div class="mt-4 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition-colors">
          <span class="text-[11px]">Mis tickets</span>
          <i class="pi pi-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
        </div>
      </div>

      <!-- 6. MI CUENTA & PERFIL -->
      <div
        @click="router.push('/clientes')"
        class="group cursor-pointer rounded-xl bg-[#0c0c0e] hover:bg-[#121215] border border-neutral-800 hover:border-neutral-700 p-4 flex flex-col justify-between transition-colors"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
              <i class="pi pi-user text-sm"></i>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-white group-hover:text-neutral-200 transition-colors">Mi Cuenta</h3>
          <p class="text-[11px] text-neutral-400 mt-1 leading-relaxed">
            Actualiza datos de contacto, facturación fiscal y preferencias.
          </p>
        </div>
        <div class="mt-4 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition-colors">
          <span class="text-[11px]">Ver perfil</span>
          <i class="pi pi-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
        </div>
      </div>
    </div>
  </div>
</template>
