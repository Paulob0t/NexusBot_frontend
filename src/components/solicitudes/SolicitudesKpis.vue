<script setup lang="ts">
import type { SolicitudesKpis } from '@/api/solicitudes'

defineProps<{
  kpis: SolicitudesKpis
  loading: boolean
  isAgente?: boolean
  isCliente?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'grid gap-3',
      isCliente ? 'grid-cols-2 lg:grid-cols-4' : (isAgente ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4')
    ]"
  >
    <!-- Asignadas a Mí (Si es agente) -->
    <div
      v-if="isAgente && !isCliente"
      class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 transition-colors duration-150 hover:border-neutral-700"
    >
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Mis Asignadas</span>
          <div class="text-xl font-semibold text-white mt-1 font-mono">
            <span v-if="loading" class="animate-pulse text-neutral-600">---</span>
            <span v-else>{{ kpis.asignadas_a_mi }}</span>
          </div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center text-xs">
          <i class="pi pi-user-check"></i>
        </div>
      </div>
      <div class="mt-2 text-[10px] text-neutral-500 font-mono">
        En tu cola activa
      </div>
    </div>

    <!-- Total General -->
    <div class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 transition-colors duration-150 hover:border-neutral-700">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            {{ isCliente ? 'Mis Solicitudes' : 'Total Tickets' }}
          </span>
          <div class="text-xl font-semibold text-white mt-1 font-mono">
            <span v-if="loading" class="animate-pulse text-neutral-600">---</span>
            <span v-else>{{ kpis.total }}</span>
          </div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center text-xs">
          <i class="pi pi-ticket"></i>
        </div>
      </div>
      <div class="mt-2 text-[10px] text-neutral-500 font-mono">
        {{ isCliente ? 'Solicitudes enviadas' : 'Registros en sistema' }}
      </div>
    </div>

    <!-- Pendientes -->
    <div class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 transition-colors duration-150 hover:border-neutral-700">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Pendientes</span>
          <div class="text-xl font-semibold text-amber-400 mt-1 font-mono">
            <span v-if="loading" class="animate-pulse text-neutral-600">---</span>
            <span v-else>{{ kpis.pendientes }}</span>
          </div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 flex items-center justify-center text-xs">
          <i class="pi pi-clock"></i>
        </div>
      </div>
      <div class="mt-2 text-[10px] text-neutral-500 font-mono flex items-center space-x-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        <span>{{ isCliente ? 'En espera de revisión' : 'Por iniciar' }}</span>
      </div>
    </div>

    <!-- En Proceso -->
    <div class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 transition-colors duration-150 hover:border-neutral-700">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">En Proceso</span>
          <div class="text-xl font-semibold text-neutral-200 mt-1 font-mono">
            <span v-if="loading" class="animate-pulse text-neutral-600">---</span>
            <span v-else>{{ kpis.en_proceso }}</span>
          </div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center text-xs">
          <i class="pi pi-sync"></i>
        </div>
      </div>
      <div class="mt-2 text-[10px] text-neutral-500 font-mono flex items-center space-x-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
        <span>{{ isCliente ? 'En atención por soporte' : 'En desarrollo activo' }}</span>
      </div>
    </div>

    <!-- Finalizadas -->
    <div class="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800 transition-colors duration-150 hover:border-neutral-700">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            {{ isCliente ? 'Resueltas' : 'Finalizadas' }}
          </span>
          <div class="text-xl font-semibold text-emerald-400 mt-1 font-mono">
            <span v-if="loading" class="animate-pulse text-neutral-600">---</span>
            <span v-else>{{ kpis.finalizadas }}</span>
          </div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 flex items-center justify-center text-xs">
          <i class="pi pi-check-circle"></i>
        </div>
      </div>
      <div class="mt-2 text-[10px] text-neutral-500 font-mono flex items-center space-x-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>{{ isCliente ? 'Completadas con éxito' : 'Cerradas con éxito' }}</span>
      </div>
    </div>
  </div>
</template>
