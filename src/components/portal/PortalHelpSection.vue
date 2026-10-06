<script setup lang="ts">
defineProps<{
  docUrl: string
}>()

const emit = defineEmits<{
  (e: 'open-ticket'): void
}>()
</script>

<template>
  <div class="rounded-xl bg-[#0c0c0e] border border-neutral-800 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
    <div class="flex items-start gap-3.5">
      <div class="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
        <i class="pi pi-question-circle text-base"></i>
      </div>
      <div>
        <h3 class="text-xs font-semibold text-white">¿Requieres asistencia técnica o cambios en tu web?</h3>
        <p class="text-[11px] text-neutral-400 mt-0.5 max-w-xl leading-relaxed">
          Consulta nuestras guías y preguntas frecuentes para configurar tu correo, WordPress o cPanel, o levanta un ticket técnico con nuestro equipo.
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2.5 w-full md:w-auto shrink-0">
      <a
        :href="docUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-medium transition-colors"
      >
        <i class="pi pi-book text-xs text-neutral-400"></i>
        <span>Guías & Ayuda</span>
      </a>
      <button
        @click="emit('open-ticket')"
        class="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors"
      >
        <i class="pi pi-ticket text-xs"></i>
        <span>Abrir Ticket</span>
      </button>
    </div>
  </div>
</template>
