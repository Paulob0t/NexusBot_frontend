<script setup lang="ts">
import type { AgenteSimple } from '@/api/solicitudes'

defineProps<{
  search: string
  selectedEstado: string
  selectedPrioridad: string
  selectedAgenteId: number | null
  soloMias: boolean
  agentes: AgenteSimple[]
  isAgente?: boolean
  isCliente?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:search', val: string): void
  (e: 'update:selectedEstado', val: string): void
  (e: 'update:selectedPrioridad', val: string): void
  (e: 'update:selectedAgenteId', val: number | null): void
  (e: 'update:soloMias', val: boolean): void
  (e: 'new-solicitud'): void
  (e: 'refresh'): void
}>()

const estados = [
  { label: 'Todos', value: 'todos' },
  { label: 'Pendientes', value: 'Pendiente' },
  { label: 'En Proceso', value: 'En Proceso' },
  { label: 'Finalizadas', value: 'Finalizado' },
]

const prioridades = [
  { label: 'Todas', value: 'todos' },
  { label: 'Alta', value: 'Alta' },
  { label: 'Media', value: 'Media' },
  { label: 'Baja', value: 'Baja' },
]
</script>

<template>
  <div class="space-y-3">
    <!-- Barra Superior: Búsqueda, Filtros y Botón Nuevo -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
      <!-- Input de búsqueda -->
      <div class="relative flex-1 max-w-md">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
        <input
          :value="search"
          @input="emit('update:search', ($event.target as HTMLInputElement).value)"
          type="text"
          :placeholder="isCliente ? 'Buscar en mis requerimientos y tickets...' : 'Buscar por título, descripción, cliente...'"
          class="w-full bg-[#141417] border border-neutral-800 rounded-xl pl-8 pr-7 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
        />
        <button
          v-if="search"
          @click="emit('update:search', '')"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <!-- Controles y Botones -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Toggle Solo Mis Asignadas (Para Agentes) -->
        <button
          v-if="isAgente && !isCliente"
          @click="emit('update:soloMias', !soloMias)"
          :class="[
            'px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center space-x-1.5 transition-all',
            soloMias
              ? 'bg-neutral-800 border-neutral-700 text-white shadow-sm'
              : 'bg-[#141417] border-neutral-800 text-neutral-400 hover:text-white'
          ]"
        >
          <i :class="['pi', soloMias ? 'pi-check-circle text-neutral-200' : 'pi-circle text-neutral-600', 'text-xs']"></i>
          <span>Solo Mis Asignadas</span>
        </button>

        <!-- Selector de Agente (Solo Admins) -->
        <select
          v-if="!soloMias && !isCliente"
          :value="selectedAgenteId ?? ''"
          @change="emit('update:selectedAgenteId', ($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : null)"
          class="bg-[#141417] border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-neutral-600"
        >
          <option value="">Todos los Agentes</option>
          <option v-for="a in agentes" :key="a.id" :value="a.id">
            {{ a.nombre }}
          </option>
        </select>

        <!-- Recargar (Solo Staff) -->
        <button
          v-if="!isCliente"
          @click="emit('refresh')"
          class="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Actualizar lista"
        >
          <i class="pi pi-refresh text-xs"></i>
        </button>

        <!-- Botón Nueva Solicitud -->
        <button
          @click="emit('new-solicitud')"
          class="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>{{ isCliente ? 'Crear Solicitud' : 'Nueva Solicitud' }}</span>
        </button>
      </div>
    </div>

    <!-- Pestañas de Estado y Prioridad -->
    <div class="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-neutral-800/80">
      <!-- Tabs de Estado -->
      <div class="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#141417] border border-neutral-800">
        <button
          v-for="e in estados"
          :key="e.value"
          @click="emit('update:selectedEstado', e.value)"
          :class="[
            'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
            selectedEstado === e.value
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          ]"
        >
          {{ e.label }}
        </button>
      </div>

      <!-- Selector / Pills de Prioridad -->
      <div class="flex items-center space-x-1">
        <span class="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mr-1">Prioridad:</span>
        <button
          v-for="p in prioridades"
          :key="p.value"
          @click="emit('update:selectedPrioridad', p.value)"
          :class="[
            'px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-colors',
            selectedPrioridad === p.value
              ? 'bg-neutral-800 text-white border-neutral-600 font-medium shadow-sm'
              : 'bg-[#141417] text-neutral-400 border-neutral-800/80 hover:border-neutral-700 hover:text-white'
          ]"
        >
          {{ p.label }}
        </button>
      </div>
    </div>
  </div>
</template>
