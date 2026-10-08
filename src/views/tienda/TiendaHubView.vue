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
            <i class="pi pi-shopping-bag text-sm"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-semibold text-white tracking-tight">PUVNEX</span>
              <span class="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400 uppercase">TIENDA</span>
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
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

    <!-- Contenido Hub / Selector Modular -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8 flex flex-col justify-center">
      <div class="text-center space-y-2 max-w-xl mx-auto">
        <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
          <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>Catálogo Público & Tiendas</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Módulos de Tienda Puvnex
        </h1>
        <p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Selecciona el módulo que deseas visualizar o desarrollar. Cada sección cuenta con su estructura de código aislada y modular.
        </p>
      </div>

      <!-- Tarjetas de Acceso a Módulos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        <!-- 1. Puvnext Web -->
        <div
          @click="router.push('/tienda/web')"
          class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 hover:border-neutral-600 transition-all duration-150 cursor-pointer flex flex-col justify-between group relative"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400 text-xl group-hover:scale-105 transition-transform">
                <i class="pi pi-globe"></i>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400">
                Puvnext_web
              </span>
            </div>

            <div class="space-y-1.5">
              <h2 class="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Puvnext Web
              </h2>
              <p class="text-xs text-neutral-400 leading-relaxed">
                Tienda pública de soluciones web, diseño de páginas, landing pages, desarrollo a la medida y servicios de soporte.
              </p>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs">
            <span class="text-[11px] font-mono text-neutral-500">Ruta: /tienda/web</span>
            <div class="flex items-center space-x-1 font-semibold text-white group-hover:translate-x-1 transition-transform">
              <span>Ver Tienda</span>
              <i class="pi pi-arrow-right text-[10px]"></i>
            </div>
          </div>
        </div>

        <!-- 2. Puvnext Bot -->
        <div
          @click="router.push('/tienda/bot')"
          class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 hover:border-neutral-600 transition-all duration-150 cursor-pointer flex flex-col justify-between group relative"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 text-xl group-hover:scale-105 transition-transform">
                <i class="pi pi-server"></i>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400">
                Puvnext_bot
              </span>
            </div>

            <div class="space-y-1.5">
              <h2 class="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                Puvnext Bot
              </h2>
              <p class="text-xs text-neutral-400 leading-relaxed">
                Tienda pública de servidores e infraestructura, planes de hosting web, servidores VPS y bots automatizados.
              </p>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs">
            <span class="text-[11px] font-mono text-neutral-500">Ruta: /tienda/bot</span>
            <div class="flex items-center space-x-1 font-semibold text-white group-hover:translate-x-1 transition-transform">
              <span>Ver Tienda</span>
              <i class="pi pi-arrow-right text-[10px]"></i>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
