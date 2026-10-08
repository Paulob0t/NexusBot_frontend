<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-[#09090b] text-neutral-200 selection:bg-white selection:text-black flex flex-col font-sans">
    <!-- Navbar Pública -->
    <header class="sticky top-0 z-30 bg-[#09090b]/80 backdrop-blur-md border-b border-neutral-800/80 h-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
            <i class="pi pi-globe text-sm"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-semibold text-white tracking-tight">PUVNEXT</span>
              <span class="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400 uppercase">WEB</span>
            </div>
          </div>
        </div>

        <!-- Acciones públicas / Retorno al CRM si está logueado -->
        <div class="flex items-center space-x-3">
          <button
            v-if="authStore.isAuthenticated"
            @click="router.push('/dashboard')"
            class="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-semibold transition-all shadow-sm flex items-center space-x-1.5"
          >
            <i class="pi pi-arrow-left text-[10px]"></i>
            <span>Volver al CRM</span>
          </button>
          <button
            v-else
            @click="router.push('/login')"
            class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-sm"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido Modular / Placeholder para Desarrollo -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col justify-center items-center text-center space-y-6">
      <div class="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 text-2xl shadow-sm">
        <i class="pi pi-desktop"></i>
      </div>

      <div class="space-y-2 max-w-lg">
        <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Módulo Público: Puvnext_web</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Puvnext Web — Tienda Digital
        </h1>
        <p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Espacio modular reservado para el catálogo público de desarrollo web, sitios corporativos, landing pages y soluciones digitales.
        </p>
      </div>

      <!-- Tarjetas de estado / Scaffolding -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-6 text-left">
        <div class="p-5 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-2">
          <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
            <i class="pi pi-palette text-xs"></i>
          </div>
          <h3 class="text-xs font-semibold text-white">Diseño & Desarrollo</h3>
          <p class="text-[11px] text-neutral-500">Módulos de paquetes web listos para estructuración.</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-2">
          <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
            <i class="pi pi-shopping-cart text-xs"></i>
          </div>
          <h3 class="text-xs font-semibold text-white">Checkout & Contratación</h3>
          <p class="text-[11px] text-neutral-500">Flujo de pedido y alta automática de solicitudes.</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-2">
          <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
            <i class="pi pi-code text-xs"></i>
          </div>
          <h3 class="text-xs font-semibold text-white">Arquitectura Modular</h3>
          <p class="text-[11px] text-neutral-500">Ubicado en <span class="font-mono text-neutral-400">src/views/tienda/Puvnext_web</span>.</p>
        </div>
      </div>
    </main>
  </div>
</template>
