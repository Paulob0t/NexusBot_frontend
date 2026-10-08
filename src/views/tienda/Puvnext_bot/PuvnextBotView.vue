<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { tiendaApi, type TiendaConfig, type TiendaItem, type TiendaFaq } from '@/api/tienda'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(true)
const config = ref<TiendaConfig | null>(null)
const items = ref<TiendaItem[]>([])
const faqs = ref<TiendaFaq[]>([])
const activeFaqId = ref<number | null>(null)

async function loadStorefrontData() {
  isLoading.value = true
  try {
    const [cfg, itms, fqs] = await Promise.all([
      tiendaApi.getConfig('hostingpro'),
      tiendaApi.getItems('hostingpro', true),
      tiendaApi.getFaqs('hostingpro', true)
    ])
    config.value = cfg
    items.value = itms
    faqs.value = fqs
    if (fqs.length > 0) {
      activeFaqId.value = fqs[0].id
    }
  } catch (err) {
    console.error('Error cargando tienda Puvnext Bot:', err)
  } finally {
    isLoading.value = false
  }
}

function toggleFaq(id: number) {
  activeFaqId.value = activeFaqId.value === id ? null : id
}

function handleContractWhatsApp(item?: TiendaItem) {
  const phone = config.value?.whatsapp_contacto || '5215500000000'
  let msg = config.value?.whatsapp_mensaje || 'Hola, me interesa información sobre sus planes de hosting y servidores.'
  if (item) {
    msg = `Hola, me interesa contratar o cotizar el plan *${item.nombre}* (${formatCurrency(item.precio, item.moneda)} ${item.periodo}). ¿Podrían darme más detalles?`
  }
  const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}

function formatCurrency(amount: number, currency: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount)
}

onMounted(() => {
  loadStorefrontData()
})
</script>

<template>
  <div class="min-h-screen bg-[#060608] text-neutral-100 selection:bg-emerald-500 selection:text-black flex flex-col font-sans relative overflow-x-hidden">
    <!-- Luces Ambientales de Fondo (Mesh Glows) -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-emerald-600/15 via-teal-600/5 to-transparent blur-3xl rounded-full"></div>
      <div class="absolute top-[40%] -left-40 w-[600px] h-[600px] bg-emerald-900/10 blur-[140px] rounded-full"></div>
      <div class="absolute top-[70%] -right-40 w-[600px] h-[600px] bg-teal-900/10 blur-[140px] rounded-full"></div>
      <!-- Grid de Líneas Sutil -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>

    <!-- Banner de Anuncio Superior -->
    <div
      v-if="config && config.anuncio_activo === 1 && config.anuncio_texto"
      class="relative z-40 bg-gradient-to-r from-emerald-950/90 via-neutral-900 to-emerald-950/90 border-b border-emerald-500/30 py-2.5 px-4 text-center text-xs text-emerald-200 font-medium flex items-center justify-center space-x-2 shrink-0 backdrop-blur-md"
    >
      <span class="flex h-2 w-2 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span class="tracking-wide">{{ config.anuncio_texto }}</span>
      <button
        @click="handleContractWhatsApp()"
        class="hidden sm:inline-flex items-center ml-2 text-[11px] underline text-emerald-300 hover:text-white font-semibold cursor-pointer"
      >
        Aprovechar promoción &rarr;
      </button>
    </div>

    <!-- Header Navbar -->
    <header class="sticky top-0 z-40 bg-[#060608]/80 backdrop-blur-xl border-b border-neutral-800/80 h-16 shrink-0 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div class="flex items-center space-x-3 cursor-pointer" @click="router.push('/tienda/bot')">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div class="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <i class="pi pi-server text-emerald-400 text-sm"></i>
            </div>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-base font-extrabold text-white tracking-tight">PUVNEXT</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider shadow-sm">
                BOT & CLOUD
              </span>
            </div>
          </div>
        </div>

        <!-- Links Rápidos de Navegación -->
        <nav class="hidden md:flex items-center space-x-6 text-xs text-neutral-400 font-medium">
          <a href="#infraestructura" class="hover:text-white transition-colors">Infraestructura</a>
          <a href="#catalogo" class="hover:text-white transition-colors">Planes & Servidores</a>
          <a href="#tecnologia" class="hover:text-white transition-colors">Tecnología</a>
          <a href="#faqs" class="hover:text-white transition-colors">Preguntas</a>
        </nav>

        <!-- Botones de Acción -->
        <div class="flex items-center space-x-3">
          <button
            @click="handleContractWhatsApp()"
            class="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-neutral-200 hover:text-white transition-all shadow-sm"
          >
            <i class="pi pi-whatsapp text-emerald-400 text-xs"></i>
            <span>Soporte Cloud</span>
          </button>
          
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
            class="px-4 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-md shadow-white/5 active:scale-95"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-24">
      <!-- HERO SECTION -->
      <section class="text-center max-w-4xl mx-auto space-y-8 pt-4 sm:pt-10">
        <!-- Badge animado -->
        <div class="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-emerald-500/30 text-xs font-mono text-emerald-300 shadow-xl shadow-emerald-950/40 backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="font-medium">{{ config?.hero_badge || 'Infraestructura Cloud & Servidores 2026' }}</span>
        </div>

        <!-- Título H1 con Gradiente Espectacular -->
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] sm:leading-[1.1] text-white">
          {{ config?.hero_titulo || 'Servidores de Alto Rendimiento y Bots Inteligentes' }}
        </h1>

        <!-- Subtítulo -->
        <p class="text-base sm:text-xl text-neutral-300 leading-relaxed max-w-2xl mx-auto font-normal">
          {{ config?.hero_subtitulo || 'Alojamiento web ultra rápido con almacenamiento NVMe, discos de alta velocidad, respaldos automáticos y soporte 24/7.' }}
        </p>

        <!-- Botones CTA -->
        <div class="pt-4 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#catalogo"
            class="px-7 py-3.5 rounded-xl bg-gradient-to-r from-white via-neutral-100 to-neutral-200 hover:to-white text-black text-sm font-bold transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 flex items-center space-x-2"
          >
            <span>{{ config?.hero_cta_texto || 'Ver Planes de Hosting' }}</span>
            <i class="pi pi-arrow-down text-xs"></i>
          </a>
          <button
            @click="handleContractWhatsApp()"
            class="px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-emerald-500/40 text-neutral-200 hover:text-white text-sm font-semibold transition-all shadow-lg backdrop-blur-md flex items-center space-x-2 active:scale-95"
          >
            <i class="pi pi-whatsapp text-emerald-400 text-sm"></i>
            <span>Cotizar Servidor a Medida</span>
          </button>
        </div>

        <!-- Barra de Confianza & Métricas Infra -->
        <div class="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-neutral-800/80">
          <div class="p-3 text-center">
            <div class="text-xl sm:text-2xl font-black text-emerald-400 font-mono">99.98%</div>
            <div class="text-[11px] text-neutral-400 mt-0.5">Uptime Garantizado</div>
          </div>
          <div class="p-3 text-center">
            <div class="text-xl sm:text-2xl font-black text-white font-mono">NVMe Gen4</div>
            <div class="text-[11px] text-neutral-400 mt-0.5">Discos de Alta Velocidad</div>
          </div>
          <div class="p-3 text-center">
            <div class="text-xl sm:text-2xl font-black text-white font-mono">Anti-DDoS</div>
            <div class="text-[11px] text-neutral-400 mt-0.5">Protección Avanzada</div>
          </div>
          <div class="p-3 text-center">
            <div class="text-xl sm:text-2xl font-black text-emerald-400 font-mono">24/7/365</div>
            <div class="text-[11px] text-neutral-400 mt-0.5">Monitoreo en Tiempo Real</div>
          </div>
        </div>
      </section>

      <!-- SECCIÓN VENTAJAS / CARACTERÍSTICAS DESTACADAS -->
      <section id="infraestructura" class="space-y-10">
        <div class="text-center space-y-2 max-w-xl mx-auto">
          <span class="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">INFRAESTRUCTURA DE NIVEL EMPRESARIAL</span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Potencia sin interrupciones para tus aplicaciones
          </h2>
          <p class="text-xs sm:text-sm text-neutral-400">
            Nodos optimizados con hardware de última generación y aislamiento total de recursos.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#101014] to-[#0a0a0d] border border-neutral-800/80 hover:border-emerald-500/40 transition-all duration-300 group relative">
            <div class="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 text-xl mb-5 group-hover:scale-110 transition-transform">
              <i class="pi pi-bolt"></i>
            </div>
            <h3 class="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
              Almacenamiento NVMe Puro
            </h3>
            <p class="text-xs text-neutral-400 leading-relaxed">
              Lecturas y escrituras hasta 10 veces más rápidas que los discos SSD tradicionales para tus bases de datos.
            </p>
          </div>

          <div class="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#101014] to-[#0a0a0d] border border-neutral-800/80 hover:border-emerald-500/40 transition-all duration-300 group relative">
            <div class="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-teal-400 text-xl mb-5 group-hover:scale-110 transition-transform">
              <i class="pi pi-lock"></i>
            </div>
            <h3 class="text-base font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
              Respaldos Diarios Automáticos
            </h3>
            <p class="text-xs text-neutral-400 leading-relaxed">
              Tus datos están protegidos con copias de seguridad continuas y restauración con 1 solo clic.
            </p>
          </div>

          <div class="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#101014] to-[#0a0a0d] border border-neutral-800/80 hover:border-emerald-500/40 transition-all duration-300 group relative">
            <div class="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 text-xl mb-5 group-hover:scale-110 transition-transform">
              <i class="pi pi-comments"></i>
            </div>
            <h3 class="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
              Bots & Automatizaciones
            </h3>
            <p class="text-xs text-neutral-400 leading-relaxed">
              Infraestructura lista para desplegar bots de WhatsApp, automatizaciones de atención al cliente y webhooks.
            </p>
          </div>
        </div>
      </section>

      <!-- SECCIÓN CATÁLOGO DE PLANES / PAQUETES -->
      <section id="catalogo" class="space-y-12 pt-8">
        <div class="text-center space-y-2 max-w-xl mx-auto">
          <span class="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">PLANES DE HOSTING & SERVIDORES</span>
          <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Escoge la potencia que necesitas
          </h2>
          <p class="text-xs sm:text-sm text-neutral-400">
            Planes flexibles con escalabilidad instantánea conforme crezca tu tráfico.
          </p>
        </div>

        <!-- Grid de Items -->
        <div v-if="items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <div
            v-for="item in items"
            :key="item.id"
            :class="[
              'rounded-3xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between group relative',
              item.destacado === 1
                ? 'bg-gradient-to-b from-[#16161d] via-[#0e0e12] to-[#09090c] border-2 border-emerald-500/60 shadow-2xl shadow-emerald-950/40 lg:-translate-y-2'
                : 'bg-gradient-to-b from-[#111115] to-[#0a0a0d] border border-neutral-800/80 hover:border-neutral-700 shadow-xl'
            ]"
          >
            <!-- Badge Destacado Neon -->
            <div v-if="item.destacado === 1" class="absolute -top-4 left-1/2 -translate-x-1/2">
              <span class="px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-[11px] font-extrabold tracking-wider uppercase shadow-lg shadow-emerald-500/30">
                ⭐ Más Popular
              </span>
            </div>

            <div class="space-y-5">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] font-mono font-semibold text-neutral-300 uppercase">
                  {{ item.categoria || 'Hosting Cloud' }}
                </span>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {{ item.nombre }}
                </h3>
                <p class="text-xs text-neutral-400 mt-1.5 leading-relaxed min-h-[32px]">
                  {{ item.descripcion }}
                </p>
              </div>

              <!-- Precio -->
              <div class="pt-3 pb-2 border-y border-neutral-800/80 flex items-baseline space-x-2">
                <span class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                  {{ formatCurrency(item.precio, item.moneda) }}
                </span>
                <span class="text-xs text-neutral-400 font-medium">{{ item.periodo }}</span>
              </div>

              <!-- Lista de Beneficios -->
              <div v-if="item.caracteristicas" class="space-y-3 pt-2">
                <div class="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">Especificaciones:</div>
                <div
                  v-for="(feature, fIdx) in item.caracteristicas.split('\n').filter(Boolean)"
                  :key="fIdx"
                  class="flex items-start space-x-2.5 text-xs text-neutral-200"
                >
                  <div class="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <i class="pi pi-check text-[8px] text-emerald-400"></i>
                  </div>
                  <span class="leading-tight">{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- Botón de Contratación -->
            <div class="mt-8 pt-4">
              <button
                @click="handleContractWhatsApp(item)"
                :class="[
                  'w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-200 active:scale-95 shadow-md',
                  item.destacado === 1
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black shadow-emerald-500/20'
                    : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-white hover:border-emerald-500/40'
                ]"
              >
                <i class="pi pi-whatsapp text-emerald-400 text-sm"></i>
                <span>Contratar Plan Cloud</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Skeleton Loading -->
        <div v-else-if="isLoading" class="p-16 text-center text-xs text-neutral-500 font-mono">
          <i class="pi pi-spin pi-spinner text-2xl text-emerald-400 mb-3"></i>
          <p>Cargando planes de infraestructura en tiempo real...</p>
        </div>
      </section>

      <!-- TECNOLOGÍA CLOUD -->
      <section id="tecnologia" class="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#111116] to-[#07070a] border border-neutral-800/80 space-y-10">
        <div class="text-center space-y-2 max-w-xl mx-auto">
          <span class="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">ARQUITECTURA MODERNA</span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Panel de control y herramientas incluidas
          </h2>
          <p class="text-xs sm:text-sm text-neutral-400">
            Administra tus sitios y servicios sin complicaciones técnicas.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div class="space-y-3 text-center sm:text-left">
            <div class="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold flex items-center justify-center text-sm mx-auto sm:mx-0 shadow-lg shadow-emerald-950/50">
              01
            </div>
            <h4 class="text-base font-bold text-white">Panel cPanel / Plesk</h4>
            <p class="text-xs text-neutral-400 leading-relaxed">
              Crea correos electrónicos, subdominios, bases de datos MySQL y administra archivos desde una interfaz intuitiva.
            </p>
          </div>

          <div class="space-y-3 text-center sm:text-left">
            <div class="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-300 font-mono font-bold flex items-center justify-center text-sm mx-auto sm:mx-0 shadow-lg shadow-teal-950/50">
              02
            </div>
            <h4 class="text-base font-bold text-white">Instalador en 1 Clic</h4>
            <p class="text-xs text-neutral-400 leading-relaxed">
              Despliega WordPress, Laravel, Node.js o tiendas WooCommerce en segundos con certificados SSL automáticos.
            </p>
          </div>

          <div class="space-y-3 text-center sm:text-left">
            <div class="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold flex items-center justify-center text-sm mx-auto sm:mx-0 shadow-lg shadow-cyan-950/50">
              03
            </div>
            <h4 class="text-base font-bold text-white">Migración Gratuita</h4>
            <p class="text-xs text-neutral-400 leading-relaxed">
              ¿Vienes de otro proveedor? Nuestro equipo migra tus sitios web y correos corporativos sin costo ni caída de servicio.
            </p>
          </div>
        </div>
      </section>

      <!-- PREGUNTAS FRECUENTES (FAQS) -->
      <section v-if="faqs.length > 0" id="faqs" class="max-w-3xl mx-auto space-y-8">
        <div class="text-center space-y-2">
          <span class="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">PREGUNTAS FRECUENTES</span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dudas sobre nuestros planes de hosting
          </h2>
        </div>

        <div class="space-y-3">
          <div
            v-for="faq in faqs"
            :key="faq.id"
            @click="toggleFaq(faq.id)"
            class="p-5 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 hover:border-neutral-700 transition-all cursor-pointer select-none space-y-2"
          >
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-semibold text-white flex items-center space-x-2.5">
                <i class="pi pi-question-circle text-emerald-400 text-xs"></i>
                <span>{{ faq.pregunta }}</span>
              </h4>
              <i
                class="pi pi-chevron-down text-xs text-neutral-400 transition-transform duration-200"
                :class="{ 'rotate-180 text-emerald-400': activeFaqId === faq.id }"
              ></i>
            </div>
            <transition name="fade">
              <p v-show="activeFaqId === faq.id" class="text-xs text-neutral-400 leading-relaxed pl-6 pt-1 border-t border-neutral-800/60">
                {{ faq.respuesta }}
              </p>
            </transition>
          </div>
        </div>
      </section>

      <!-- BANNER FINAL CTA WHATSAPP -->
      <section class="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-teal-950/60 border border-emerald-500/40 shadow-2xl text-center space-y-6">
        <div class="max-w-2xl mx-auto space-y-3">
          <h3 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            ¿Necesitas un servidor dedicado o una solución para bots a gran escala?
          </h3>
          <p class="text-xs sm:text-sm text-neutral-300">
            Nuestros ingenieros de infraestructura están listos para diseñar tu arquitectura a la medida.
          </p>
        </div>

        <button
          @click="handleContractWhatsApp()"
          class="px-8 py-4 rounded-2xl bg-white hover:bg-neutral-200 text-black text-sm font-bold shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 inline-flex items-center space-x-2"
        >
          <i class="pi pi-whatsapp text-emerald-500 text-base"></i>
          <span>Contactar a un Ingeniero Cloud</span>
        </button>
      </section>
    </main>

    <!-- FOOTER ELEGANTE -->
    <footer class="relative z-10 border-t border-neutral-900 py-10 bg-[#060608] text-xs text-neutral-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center space-x-2">
          <span class="font-bold text-white tracking-wider">PUVNEXT BOT</span>
          <span>•</span>
          <span>Infraestructura Cloud, Servidores & Automatización</span>
        </div>
        <div>
          <span>© {{ new Date().getFullYear() }} Puvnex Enterprise CRM. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
