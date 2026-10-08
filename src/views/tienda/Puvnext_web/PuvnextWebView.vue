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

async function loadStorefrontData() {
  isLoading.value = true
  try {
    const [cfg, itms, fqs] = await Promise.all([
      tiendaApi.getConfig('conlineweb'),
      tiendaApi.getItems('conlineweb', true),
      tiendaApi.getFaqs('conlineweb', true)
    ])
    config.value = cfg
    items.value = itms
    faqs.value = fqs
  } catch (err) {
    console.error('Error cargando tienda Puvnext Web:', err)
  } finally {
    isLoading.value = false
  }
}

function handleContractWhatsApp(item?: TiendaItem) {
  const phone = config.value?.whatsapp_contacto || '5215500000000'
  let msg = config.value?.whatsapp_mensaje || 'Hola, me interesa información sobre sus servicios de Puvnext Web.'
  if (item) {
    msg = `Hola, me interesa contratar o recibir más información del paquete *${item.nombre}* (${formatCurrency(item.precio, item.moneda)} ${item.periodo}).`
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
  <div class="min-h-screen bg-[#09090b] text-neutral-200 selection:bg-white selection:text-black flex flex-col font-sans">
    <!-- Banner de Promoción / Anuncio Superior -->
    <div
      v-if="config && config.anuncio_activo === 1 && config.anuncio_texto"
      class="bg-gradient-to-r from-cyan-950/80 via-neutral-900 to-cyan-950/80 border-b border-cyan-500/20 py-2 px-4 text-center text-xs text-cyan-200 font-medium flex items-center justify-center space-x-2 shrink-0"
    >
      <i class="pi pi-bolt text-cyan-400 text-xs animate-pulse"></i>
      <span>{{ config.anuncio_texto }}</span>
    </div>

    <!-- Navbar Pública -->
    <header class="sticky top-0 z-30 bg-[#09090b]/80 backdrop-blur-md border-b border-neutral-800/80 h-16 shrink-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400">
            <i class="pi pi-globe text-sm"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-semibold text-white tracking-tight">PUVNEXT</span>
              <span class="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 uppercase font-semibold">WEB</span>
            </div>
          </div>
        </div>

        <!-- Navegación & Acciones -->
        <div class="flex items-center space-x-3">
          <button
            @click="handleContractWhatsApp()"
            class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
          >
            <i class="pi pi-whatsapp text-emerald-400 text-xs"></i>
            <span>Contacto</span>
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
            class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-sm"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- CUERPO DE LA TIENDA -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
      <!-- HERO SECTION -->
      <section class="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-8">
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400 shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{{ config?.hero_badge || 'Soluciones Digitales & Desarrollo Web' }}</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight sm:leading-tight">
          {{ config?.hero_titulo || 'Diseño Web Profesional y Tiendas Online' }}
        </h1>

        <p class="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          {{ config?.hero_subtitulo || 'Desarrollamos la presencia en línea de tu empresa con tecnología moderna, velocidad y soporte.' }}
        </p>

        <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#catalogo"
            class="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-sm flex items-center space-x-1.5"
          >
            <span>{{ config?.hero_cta_texto || 'Explorar Paquetes' }}</span>
            <i class="pi pi-arrow-down text-[10px]"></i>
          </a>
          <button
            @click="handleContractWhatsApp()"
            class="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white text-xs font-semibold transition-all shadow-sm flex items-center space-x-1.5"
          >
            <i class="pi pi-whatsapp text-emerald-400 text-xs"></i>
            <span>Hablar con un Asesor</span>
          </button>
        </div>
      </section>

      <!-- SECCIÓN CATÁLOGO DE PLANES / PAQUETES -->
      <section id="catalogo" class="space-y-8 pt-6">
        <div class="text-center space-y-2 max-w-xl mx-auto">
          <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Nuestros Paquetes y Soluciones
          </h2>
          <p class="text-xs sm:text-sm text-neutral-400">
            Precios transparentes y soluciones a la medida para cada etapa de tu negocio.
          </p>
        </div>

        <!-- Grid de Items -->
        <div v-if="items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in items"
            :key="item.id"
            :class="[
              'p-6 rounded-2xl bg-[#0c0c0e] border transition-all duration-200 flex flex-col justify-between group relative hover:border-neutral-700',
              item.destacado === 1 ? 'border-cyan-500/40 ring-1 ring-cyan-500/20 shadow-xl shadow-cyan-950/20' : 'border-neutral-800/80'
            ]"
          >
            <!-- Badge Destacado -->
            <div v-if="item.destacado === 1" class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="px-3 py-0.5 rounded-full bg-cyan-400 text-black text-[10px] font-bold tracking-wide uppercase shadow-sm">
                Más Popular
              </span>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400 uppercase">
                  {{ item.categoria || 'Desarrollo Web' }}
                </span>
              </div>

              <div>
                <h3 class="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {{ item.nombre }}
                </h3>
                <p class="text-xs text-neutral-400 mt-1 line-clamp-2">
                  {{ item.descripcion }}
                </p>
              </div>

              <!-- Precio -->
              <div class="pt-2 flex items-baseline space-x-1.5">
                <span class="text-3xl font-extrabold text-white tracking-tight">
                  {{ formatCurrency(item.precio, item.moneda) }}
                </span>
                <span class="text-xs text-neutral-400 font-medium">{{ item.periodo }}</span>
              </div>

              <!-- Lista de Beneficios -->
              <div v-if="item.caracteristicas" class="pt-4 border-t border-neutral-800/60 space-y-2">
                <div
                  v-for="(feature, fIdx) in item.caracteristicas.split('\n').filter(Boolean)"
                  :key="fIdx"
                  class="flex items-start space-x-2 text-xs text-neutral-300"
                >
                  <i class="pi pi-check text-[10px] text-cyan-400 mt-0.5 shrink-0"></i>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- Botón de Contratación -->
            <div class="mt-8 pt-4 border-t border-neutral-800/60">
              <button
                @click="handleContractWhatsApp(item)"
                :class="[
                  'w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all duration-200 active:scale-98',
                  item.destacado === 1
                    ? 'bg-white hover:bg-neutral-200 text-black shadow-sm'
                    : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white'
                ]"
              >
                <i class="pi pi-whatsapp text-emerald-400 text-xs"></i>
                <span>Contratar este Paquete</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="isLoading" class="p-12 text-center text-xs text-neutral-500 font-mono">
          <i class="pi pi-spin pi-spinner text-lg mb-2"></i>
          <p>Cargando catálogo...</p>
        </div>
      </section>

      <!-- SECCIÓN FAQS -->
      <section v-if="faqs.length > 0" class="max-w-3xl mx-auto space-y-6 pt-8">
        <div class="text-center space-y-1.5">
          <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Preguntas Frecuentes</h2>
          <p class="text-xs text-neutral-400">Todo lo que necesitas saber antes de iniciar tu proyecto.</p>
        </div>

        <div class="space-y-3">
          <div
            v-for="faq in faqs"
            :key="faq.id"
            class="p-5 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-1.5"
          >
            <h4 class="text-xs sm:text-sm font-semibold text-white flex items-center space-x-2">
              <i class="pi pi-question-circle text-cyan-400 text-xs"></i>
              <span>{{ faq.pregunta }}</span>
            </h4>
            <p class="text-xs text-neutral-400 leading-relaxed pl-5">
              {{ faq.respuesta }}
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER PÚBLICO -->
    <footer class="border-t border-neutral-900 py-8 bg-[#09090b] text-center text-xs text-neutral-500 space-y-2">
      <div class="flex items-center justify-center space-x-2 font-semibold text-neutral-400">
        <span>Puvnext Web</span>
        <span>•</span>
        <span>Desarrollo & Soluciones Digitales</span>
      </div>
      <p>© {{ new Date().getFullYear() }} Puvnex Enterprise. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>
