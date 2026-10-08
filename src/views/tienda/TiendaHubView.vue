<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen w-full bg-[#060608] text-neutral-200 selection:bg-white selection:text-black flex flex-col font-sans relative">
    <!-- Luces Ambientales de Fondo -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div class="absolute -top-40 left-1/4 w-[600px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full"></div>
      <div class="absolute -top-40 right-1/4 w-[600px] h-[500px] bg-emerald-600/10 blur-[130px] rounded-full"></div>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>

    <!-- Navbar Pública -->
    <header class="sticky top-0 z-30 bg-[#060608]/80 backdrop-blur-xl border-b border-neutral-800/80 h-16 shrink-0">
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
            class="px-4 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-sm"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido Hub / Selector Modular -->
    <main class="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-12 flex flex-col justify-center">
      <div class="text-center space-y-4 max-w-2xl mx-auto">
        <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs font-mono text-neutral-300 shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>Ecosistema Digital Puvnex</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Explora nuestros Catálogos Digitales
        </h1>
        <p class="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl mx-auto">
          Selecciona la solución que deseas consultar. Diseñamos páginas web de alto impacto y proveemos infraestructura cloud de ultra velocidad.
        </p>
      </div>

      <!-- Tarjetas de Acceso a Módulos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        <!-- 1. Puvnext Web -->
        <div
          @click="router.push('/tienda/web')"
          class="p-8 rounded-3xl bg-gradient-to-b from-[#111116] to-[#07070a] border border-cyan-500/30 hover:border-cyan-400/80 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative hover:-translate-y-1.5"
        >
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl group-hover:scale-110 transition-transform shadow-lg shadow-cyan-950/50">
                <i class="pi pi-globe"></i>
              </div>
              <span class="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold uppercase">
                Puvnext Web
              </span>
            </div>

            <div class="space-y-2">
              <h2 class="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Desarrollo Web & Tiendas
              </h2>
              <p class="text-xs text-neutral-400 leading-relaxed">
                Sitios corporativos, landing pages de alta conversión, e-commerce, pasarelas de pago y diseño UI/UX a la medida.
              </p>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 pt-2">
              <span class="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">⚡ Carga &lt;0.8s</span>
              <span class="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">📱 Mobile-First</span>
              <span class="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">🛡️ SSL + SEO</span>
            </div>
          </div>

          <div class="mt-8 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs">
            <span class="text-[11px] font-mono text-neutral-500">Ruta: /tienda/web</span>
            <div class="flex items-center space-x-1.5 font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Ingresar a Puvnext Web</span>
              <i class="pi pi-arrow-right text-[10px]"></i>
            </div>
          </div>
        </div>

        <!-- 2. Puvnext Bot -->
        <div
          @click="router.push('/tienda/bot')"
          class="p-8 rounded-3xl bg-gradient-to-b from-[#111116] to-[#07070a] border border-emerald-500/30 hover:border-emerald-400/80 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative hover:-translate-y-1.5"
        >
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl group-hover:scale-110 transition-transform shadow-lg shadow-emerald-950/50">
                <i class="pi pi-server"></i>
              </div>
              <span class="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-semibold uppercase">
                Puvnext Bot
              </span>
            </div>

            <div class="space-y-2">
              <h2 class="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Hosting Cloud & Servidores
              </h2>
              <p class="text-xs text-neutral-400 leading-relaxed">
                Alojamiento web con discos NVMe, servidores VPS dedicados, automatizaciones y bots con disponibilidad 99.98%.
              </p>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 pt-2">
              <span class="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">🚀 NVMe Gen4</span>
              <span class="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">🔒 Anti-DDoS</span>
              <span class="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">💬 Bots WhatsApp</span>
            </div>
          </div>

          <div class="mt-8 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs">
            <span class="text-[11px] font-mono text-neutral-500">Ruta: /tienda/bot</span>
            <div class="flex items-center space-x-1.5 font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Ingresar a Puvnext Bot</span>
              <i class="pi pi-arrow-right text-[10px]"></i>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-neutral-900 py-8 bg-[#060608] text-center text-xs text-neutral-500">
      <p>© {{ new Date().getFullYear() }} Puvnex Enterprise. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>
