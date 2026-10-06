<script setup lang="ts">
defineProps<{
  saludo: string
  nombre: string
  empresa?: string
  totalPendientes: number
}>()

const emit = defineEmits<{
  (e: 'open-ticket'): void
}>()
</script>

<template>
  <div class="relative overflow-hidden rounded-xl bg-[#0c0c0e] border border-neutral-800 p-6 md:p-7">
    <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shrink-0">
          <i class="pi pi-home text-lg"></i>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-lg md:text-xl font-semibold text-white tracking-tight">
              {{ saludo }}, <span>{{ nombre }}</span>
            </h1>
            <span
              v-if="empresa"
              class="px-2 py-0.5 text-xs font-medium rounded bg-neutral-900 text-neutral-300 border border-neutral-800 font-mono"
            >
              {{ empresa }}
            </span>
          </div>
          <p class="text-xs text-neutral-400 mt-1">
            Resumen general y estado en tiempo real de tus servicios contratados.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto shrink-0">
        <button
          @click="emit('open-ticket')"
          class="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold transition-colors"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>Nuevo Ticket</span>
        </button>
        <a
          href="https://wa.me/521"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-medium transition-colors"
          title="Contacto directo WhatsApp"
        >
          <i class="pi pi-whatsapp text-xs text-neutral-400"></i>
          <span class="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  </div>
</template>
