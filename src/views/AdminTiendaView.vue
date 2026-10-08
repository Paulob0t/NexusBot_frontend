<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import {
  tiendaApi,
  type TiendaConfig,
  type TiendaConfigUpdate,
  type TiendaItem,
  type TiendaItemPayload,
  type TiendaFaq,
  type TiendaFaqPayload
} from '@/api/tienda'

import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppToast from '@/components/common/AppToast.vue'

const { showToast } = useToast()

const isMobileSidebarOpen = ref(false)

// Sistema activo
const currentSistema = ref<'conlineweb' | 'hostingpro'>('conlineweb')

// Sub-pestañas activas
type TabType = 'hero' | 'catalogo' | 'faqs' | 'contacto'
const activeTab = ref<TabType>('hero')

// Estados de carga
const isLoading = ref(false)
const isSavingConfig = ref(false)
const isSavingItem = ref(false)
const isSavingFaq = ref(false)

// Configuración de Tienda
const config = ref<TiendaConfig>({
  id: 0,
  sistema: 'conlineweb',
  hero_badge: '',
  hero_titulo: '',
  hero_subtitulo: '',
  hero_cta_texto: '',
  hero_cta_enlace: '',
  whatsapp_contacto: '',
  whatsapp_mensaje: '',
  email_contacto: '',
  anuncio_activo: 0,
  anuncio_texto: ''
})

// Catálogo de Items
const items = ref<TiendaItem[]>([])
const faqs = ref<TiendaFaq[]>([])

// Modales
const isItemModalOpen = ref(false)
const isEditingItem = ref(false)
const itemFormData = ref<TiendaItemPayload>({
  sistema: 'conlineweb',
  nombre: '',
  categoria: '',
  descripcion: '',
  precio: 0,
  periodo: 'pago único',
  moneda: 'MXN',
  caracteristicas: '',
  destacado: 0,
  activo: 1,
  orden: 0
})
const editingItemId = ref<number | null>(null)

const isFaqModalOpen = ref(false)
const isEditingFaq = ref(false)
const faqFormData = ref<TiendaFaqPayload>({
  sistema: 'conlineweb',
  pregunta: '',
  respuesta: '',
  orden: 0,
  activo: 1
})
const editingFaqId = ref<number | null>(null)

// Cargar Datos
async function loadData() {
  isLoading.value = true
  try {
    const [cfg, itms, fqs] = await Promise.all([
      tiendaApi.getConfig(currentSistema.value),
      tiendaApi.getItems(currentSistema.value, false),
      tiendaApi.getFaqs(currentSistema.value, false)
    ])
    config.value = cfg
    items.value = itms
    faqs.value = fqs
  } catch (err: any) {
    showToast('Error al cargar la información de la tienda', 'error')
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch(currentSistema, () => {
  loadData()
})

onMounted(() => {
  loadData()
})

// Guardar Configuración (Hero, Anuncio, Contacto)
async function handleSaveConfig() {
  if (!config.value.hero_titulo.trim()) {
    showToast('El título principal del Hero es obligatorio', 'error')
    return
  }
  isSavingConfig.value = true
  try {
    const payload: TiendaConfigUpdate = {
      hero_badge: config.value.hero_badge,
      hero_titulo: config.value.hero_titulo,
      hero_subtitulo: config.value.hero_subtitulo,
      hero_cta_texto: config.value.hero_cta_texto,
      hero_cta_enlace: config.value.hero_cta_enlace,
      whatsapp_contacto: config.value.whatsapp_contacto,
      whatsapp_mensaje: config.value.whatsapp_mensaje,
      email_contacto: config.value.email_contacto,
      anuncio_activo: config.value.anuncio_activo,
      anuncio_texto: config.value.anuncio_texto
    }
    const updated = await tiendaApi.updateConfig(currentSistema.value, payload)
    config.value = updated
    showToast('Configuración de la tienda guardada correctamente')
  } catch (err: any) {
    showToast(err.response?.data?.detail || 'Error al guardar la configuración', 'error')
  } finally {
    isSavingConfig.value = false
  }
}

// Gestión de Items / Catálogo
function openCreateItem() {
  isEditingItem.value = false
  editingItemId.value = null
  itemFormData.value = {
    sistema: currentSistema.value,
    nombre: '',
    categoria: currentSistema.value === 'conlineweb' ? 'Desarrollo Web' : 'Hosting Cloud',
    descripcion: '',
    precio: 0,
    periodo: currentSistema.value === 'conlineweb' ? 'pago único' : '/mes',
    moneda: 'MXN',
    caracteristicas: '',
    destacado: 0,
    activo: 1,
    orden: items.value.length + 1
  }
  isItemModalOpen.value = true
}

function openEditItem(item: TiendaItem) {
  isEditingItem.value = true
  editingItemId.value = item.id
  itemFormData.value = {
    sistema: item.sistema,
    nombre: item.nombre,
    categoria: item.categoria || '',
    descripcion: item.descripcion || '',
    precio: item.precio,
    periodo: item.periodo || 'pago único',
    moneda: item.moneda || 'MXN',
    caracteristicas: item.caracteristicas || '',
    destacado: item.destacado,
    activo: item.activo,
    orden: item.orden
  }
  isItemModalOpen.value = true
}

async function handleSaveItem() {
  if (!itemFormData.value.nombre.trim()) {
    showToast('El nombre del paquete o servicio es requerido', 'error')
    return
  }
  isSavingItem.value = true
  try {
    if (isEditingItem.value && editingItemId.value) {
      await tiendaApi.updateItem(editingItemId.value, itemFormData.value)
      showToast(`Paquete "${itemFormData.value.nombre}" actualizado`)
    } else {
      await tiendaApi.createItem({ ...itemFormData.value, sistema: currentSistema.value })
      showToast(`Paquete "${itemFormData.value.nombre}" creado exitosamente`)
    }
    isItemModalOpen.value = false
    const itms = await tiendaApi.getItems(currentSistema.value, false)
    items.value = itms
  } catch (err: any) {
    showToast(err.response?.data?.detail || 'Error al guardar paquete', 'error')
  } finally {
    isSavingItem.value = false
  }
}

async function toggleItemStatus(item: TiendaItem) {
  const newStatus = item.activo === 1 ? 0 : 1
  try {
    await tiendaApi.updateItem(item.id, { activo: newStatus })
    item.activo = newStatus
    showToast(`Estado de "${item.nombre}" cambiado a ${newStatus === 1 ? 'Activo' : 'Inactivo'}`)
  } catch {
    showToast('Error al actualizar estado', 'error')
  }
}

async function handleDeleteItem(item: TiendaItem) {
  if (!confirm(`¿Eliminar el paquete "${item.nombre}" del catálogo?`)) return
  try {
    await tiendaApi.deleteItem(item.id)
    items.value = items.value.filter(i => i.id !== item.id)
    showToast(`Paquete "${item.nombre}" eliminado`)
  } catch {
    showToast('Error al eliminar paquete', 'error')
  }
}

// Gestión de FAQs
function openCreateFaq() {
  isEditingFaq.value = false
  editingFaqId.value = null
  faqFormData.value = {
    sistema: currentSistema.value,
    pregunta: '',
    respuesta: '',
    orden: faqs.value.length + 1,
    activo: 1
  }
  isFaqModalOpen.value = true
}

function openEditFaq(faq: TiendaFaq) {
  isEditingFaq.value = true
  editingFaqId.value = faq.id
  faqFormData.value = {
    sistema: faq.sistema,
    pregunta: faq.pregunta,
    respuesta: faq.respuesta,
    orden: faq.orden,
    activo: faq.activo
  }
  isFaqModalOpen.value = true
}

async function handleSaveFaq() {
  if (!faqFormData.value.pregunta.trim() || !faqFormData.value.respuesta.trim()) {
    showToast('La pregunta y respuesta son obligatorias', 'error')
    return
  }
  isSavingFaq.value = true
  try {
    if (isEditingFaq.value && editingFaqId.value) {
      await tiendaApi.updateFaq(editingFaqId.value, faqFormData.value)
      showToast('Pregunta frecuente actualizada')
    } else {
      await tiendaApi.createFaq({ ...faqFormData.value, sistema: currentSistema.value })
      showToast('Pregunta frecuente creada')
    }
    isFaqModalOpen.value = false
    const fqs = await tiendaApi.getFaqs(currentSistema.value, false)
    faqs.value = fqs
  } catch (err: any) {
    showToast(err.response?.data?.detail || 'Error al guardar FAQ', 'error')
  } finally {
    isSavingFaq.value = false
  }
}

async function handleDeleteFaq(faq: TiendaFaq) {
  if (!confirm('¿Eliminar esta pregunta frecuente?')) return
  try {
    await tiendaApi.deleteFaq(faq.id)
    faqs.value = faqs.value.filter(f => f.id !== faq.id)
    showToast('Pregunta frecuente eliminada')
  } catch {
    showToast('Error al eliminar FAQ', 'error')
  }
}

function goToLiveStore() {
  if (currentSistema.value === 'conlineweb') {
    window.open('/tienda/web', '_blank')
  } else {
    window.open('/tienda/bot', '_blank')
  }
}

function formatCurrency(amount: number, currency: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<template>
  <div class="h-screen w-screen bg-[#09090b] text-neutral-100 selection:bg-neutral-700 selection:text-white flex overflow-hidden font-sans">
    <!-- MENÚ LATERAL -->
    <AppSidebar
      :is-mobile-open="isMobileSidebarOpen"
      @close-mobile="isMobileSidebarOpen = false"
    />

    <!-- CONTENEDOR PRINCIPAL -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-16">
      <!-- HEADER SUPERIOR -->
      <header class="sticky top-0 z-30 bg-[#09090b]/80 backdrop-blur-md border-b border-neutral-800/80 h-16 shrink-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button
              @click="isMobileSidebarOpen = true"
              class="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <i class="pi pi-bars text-sm"></i>
            </button>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-semibold text-white">Gestor de Tienda CMS</span>
              <span class="text-neutral-700 hidden sm:inline">/</span>
              <span class="text-[11px] font-mono text-neutral-400 uppercase tracking-wider hidden sm:inline">
                {{ currentSistema === 'conlineweb' ? 'Puvnext Web' : 'Puvnext Bot' }}
              </span>
            </div>
          </div>

          <div class="flex items-center space-x-2.5 sm:space-x-3">
            <!-- Switcher Sistema Suave con Pastilla Deslizante -->
            <div class="hidden sm:flex relative p-1 rounded-xl bg-neutral-950 border border-neutral-800 select-none">
              <div
                class="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-neutral-800 border border-neutral-700/40 transition-all duration-300 ease-out pointer-events-none"
                :class="currentSistema === 'conlineweb' ? 'left-1' : 'left-[calc(50%+3px)]'"
              ></div>

              <button
                @click="currentSistema = 'conlineweb'"
                class="relative z-10 px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200"
                :class="currentSistema === 'conlineweb' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'"
              >
                Puvnext Web
              </button>
              <button
                @click="currentSistema = 'hostingpro'"
                class="relative z-10 px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200"
                :class="currentSistema === 'hostingpro' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'"
              >
                Puvnext Bot
              </button>
            </div>

            <!-- Botón Ver Tienda en Vivo -->
            <button
              @click="goToLiveStore"
              class="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
              title="Abrir tienda pública en una pestaña nueva"
            >
              <i class="pi pi-external-link text-xs"></i>
              <span class="hidden md:inline">Ver Tienda en Vivo</span>
            </button>
          </div>
        </div>
      </header>

      <!-- CUERPO PRINCIPAL -->
      <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        <!-- Barra de Navegación de Sub-Pestañas -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-3">
          <div class="flex items-center space-x-1 p-1 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
            <button
              @click="activeTab = 'hero'"
              :class="[
                'px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5',
                activeTab === 'hero' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              ]"
            >
              <i class="pi pi-desktop text-xs"></i>
              <span>Portada & Anuncios</span>
            </button>
            <button
              @click="activeTab = 'catalogo'"
              :class="[
                'px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5',
                activeTab === 'catalogo' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              ]"
            >
              <i class="pi pi-shopping-bag text-xs"></i>
              <span>Catálogo & Paquetes</span>
              <span class="px-1.5 py-0.2 rounded-full bg-neutral-900 text-[10px] font-mono text-neutral-300">
                {{ items.length }}
              </span>
            </button>
            <button
              @click="activeTab = 'faqs'"
              :class="[
                'px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5',
                activeTab === 'faqs' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              ]"
            >
              <i class="pi pi-question-circle text-xs"></i>
              <span>Preguntas Frecuentes</span>
              <span class="px-1.5 py-0.2 rounded-full bg-neutral-900 text-[10px] font-mono text-neutral-300">
                {{ faqs.length }}
              </span>
            </button>
            <button
              @click="activeTab = 'contacto'"
              :class="[
                'px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5',
                activeTab === 'contacto' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              ]"
            >
              <i class="pi pi-whatsapp text-xs"></i>
              <span>Contacto & WhatsApp</span>
            </button>
          </div>

          <!-- Indicador de Tienda Actual -->
          <div class="flex items-center space-x-2 text-xs text-neutral-400">
            <span class="w-2 h-2 rounded-full" :class="currentSistema === 'conlineweb' ? 'bg-cyan-400' : 'bg-emerald-400'"></span>
            <span>Editando:</span>
            <span class="font-semibold text-white">{{ currentSistema === 'conlineweb' ? 'Puvnext Web' : 'Puvnext Bot' }}</span>
          </div>
        </div>

        <!-- TAB 1: HERO & ANUNCIOS -->
        <div v-if="activeTab === 'hero'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Configuración Formulario -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Tarjeta de Anuncio Superior -->
              <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-4">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <h3 class="text-sm font-semibold text-white flex items-center space-x-2">
                      <i class="pi pi-megaphone text-amber-400 text-xs"></i>
                      <span>Barra de Anuncio / Promoción Superior</span>
                    </h3>
                    <p class="text-xs text-neutral-400">Muestra un banner llamativo en la parte superior de la tienda pública.</p>
                  </div>
                  <!-- Switch Anuncio -->
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="config.anuncio_activo === 1"
                      @change="config.anuncio_activo = config.anuncio_activo === 1 ? 0 : 1"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>

                <div v-if="config.anuncio_activo === 1" class="space-y-1.5 pt-2 border-t border-neutral-800/60">
                  <label class="text-xs text-neutral-300 font-medium">Texto del Anuncio</label>
                  <input
                    v-model="config.anuncio_texto"
                    type="text"
                    placeholder="Ej. 🔥 20% de descuento en pagos anuales..."
                    class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  />
                </div>
              </div>

              <!-- Tarjeta de Portada Hero -->
              <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-4">
                <div class="space-y-0.5">
                  <h3 class="text-sm font-semibold text-white flex items-center space-x-2">
                    <i class="pi pi-desktop text-neutral-300 text-xs"></i>
                    <span>Portada Principal (Hero Section)</span>
                  </h3>
                  <p class="text-xs text-neutral-400">Personaliza los títulos, subtítulos y llamados a la acción visibles en la cabecera.</p>
                </div>

                <div class="space-y-4 pt-2">
                  <div class="space-y-1.5">
                    <label class="text-xs text-neutral-300 font-medium">Badge / Etiqueta Superior</label>
                    <input
                      v-model="config.hero_badge"
                      type="text"
                      placeholder="Ej. Soluciones Digitales & Desarrollo Web"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs text-neutral-300 font-medium">Título Principal (H1)</label>
                    <input
                      v-model="config.hero_titulo"
                      type="text"
                      placeholder="Ej. Diseño Web Profesional y Tiendas Online"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs text-neutral-300 font-medium">Subtítulo / Descripción</label>
                    <textarea
                      v-model="config.hero_subtitulo"
                      rows="3"
                      placeholder="Breve resumen que inspire confianza a los visitantes..."
                      class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 resize-none"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                      <label class="text-xs text-neutral-300 font-medium">Texto del Botón CTA</label>
                      <input
                        v-model="config.hero_cta_texto"
                        type="text"
                        placeholder="Ej. Explorar Paquetes"
                        class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs text-neutral-300 font-medium">Enlace / Ancla del Botón</label>
                      <input
                        v-model="config.hero_cta_enlace"
                        type="text"
                        placeholder="#catalogo"
                        class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                  </div>
                </div>

                <div class="pt-4 flex justify-end">
                  <button
                    @click="handleSaveConfig"
                    :disabled="isSavingConfig"
                    class="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
                  >
                    <i v-if="isSavingConfig" class="pi pi-spin pi-spinner text-xs"></i>
                    <i v-else class="pi pi-check text-xs"></i>
                    <span>{{ isSavingConfig ? 'Guardando...' : 'Guardar Cambios' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Vista Previa en Vivo (Live Preview Card) -->
            <div class="space-y-4">
              <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-4 sticky top-24">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-neutral-300 flex items-center space-x-1.5">
                    <i class="pi pi-eye text-xs"></i>
                    <span>Vista Previa del Hero</span>
                  </span>
                  <span class="text-[10px] font-mono text-neutral-500 uppercase">TIENDA EN VIVO</span>
                </div>

                <!-- Simulación Banner -->
                <div
                  v-if="config.anuncio_activo === 1"
                  class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-center text-[11px] text-amber-300 flex items-center justify-center space-x-1.5"
                >
                  <i class="pi pi-bolt text-[10px]"></i>
                  <span class="truncate">{{ config.anuncio_texto || 'Texto de anuncio' }}</span>
                </div>

                <!-- Simulación Hero -->
                <div class="p-5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-center space-y-3">
                  <div class="inline-block px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400">
                    {{ config.hero_badge || 'Etiqueta' }}
                  </div>
                  <h4 class="text-sm font-bold text-white leading-snug">
                    {{ config.hero_titulo || 'Título Principal de la Tienda' }}
                  </h4>
                  <p class="text-[11px] text-neutral-400 line-clamp-3">
                    {{ config.hero_subtitulo || 'Descripción y propuesta de valor para tus clientes.' }}
                  </p>
                  <div class="pt-2">
                    <button class="px-3.5 py-1.5 rounded-lg bg-white text-black text-[11px] font-semibold">
                      {{ config.hero_cta_texto || 'Botón CTA' }}
                    </button>
                  </div>
                </div>

                <p class="text-[11px] text-neutral-500 text-center">
                  Cualquier ajuste guardado se aplicará de inmediato a la tienda pública.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: CATÁLOGO & PAQUETES -->
        <div v-if="activeTab === 'catalogo'" class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-semibold text-white">Catálogo de Planes & Servicios</h3>
              <p class="text-xs text-neutral-400">Administra los paquetes que verán tus clientes en {{ currentSistema === 'conlineweb' ? 'Puvnext Web' : 'Puvnext Bot' }}.</p>
            </div>
            <button
              @click="openCreateItem"
              class="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-sm flex items-center space-x-1.5"
            >
              <i class="pi pi-plus text-xs"></i>
              <span>Nuevo Paquete</span>
            </button>
          </div>

          <!-- Grid de Paquetes -->
          <div v-if="items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div
              v-for="item in items"
              :key="item.id"
              :class="[
                'p-6 rounded-2xl bg-[#0c0c0e] border transition-all flex flex-col justify-between relative',
                item.destacado === 1 ? 'border-neutral-600 shadow-md shadow-black/50' : 'border-neutral-800/80',
                item.activo === 0 ? 'opacity-60' : ''
              ]"
            >
              <!-- Badges Superiores -->
              <div class="flex items-center justify-between mb-4">
                <span class="px-2.5 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400">
                  {{ item.categoria || 'Servicio' }}
                </span>
                <div class="flex items-center space-x-2">
                  <span
                    v-if="item.destacado === 1"
                    class="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold flex items-center space-x-1"
                  >
                    <i class="pi pi-star-fill text-[8px]"></i>
                    <span>Popular</span>
                  </span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-md text-[10px] font-semibold',
                      item.activo === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-800 text-neutral-500'
                    ]"
                  >
                    {{ item.activo === 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>

              <!-- Contenido -->
              <div class="space-y-3 flex-1">
                <div>
                  <h4 class="text-base font-semibold text-white">{{ item.nombre }}</h4>
                  <p class="text-xs text-neutral-400 mt-1 line-clamp-2">{{ item.descripcion }}</p>
                </div>

                <!-- Precio -->
                <div class="pt-2 flex items-baseline space-x-1.5">
                  <span class="text-2xl font-bold text-white">{{ formatCurrency(item.precio, item.moneda) }}</span>
                  <span class="text-xs text-neutral-400">{{ item.periodo }}</span>
                </div>

                <!-- Lista de Características -->
                <div v-if="item.caracteristicas" class="pt-3 border-t border-neutral-800/60 space-y-1.5">
                  <div
                    v-for="(feature, fIdx) in item.caracteristicas.split('\n').filter(Boolean)"
                    :key="fIdx"
                    class="flex items-center space-x-2 text-xs text-neutral-300"
                  >
                    <i class="pi pi-check text-[10px] text-emerald-400 shrink-0"></i>
                    <span class="truncate">{{ feature }}</span>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <button
                  @click="toggleItemStatus(item)"
                  class="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  {{ item.activo === 1 ? 'Desactivar' : 'Activar' }}
                </button>
                <div class="flex items-center space-x-2">
                  <button
                    @click="openEditItem(item)"
                    class="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                    title="Editar paquete"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button
                    @click="handleDeleteItem(item)"
                    class="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 transition-colors"
                    title="Eliminar paquete"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="p-12 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 text-center space-y-3">
            <div class="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
              <i class="pi pi-inbox text-lg"></i>
            </div>
            <h4 class="text-sm font-semibold text-white">No hay paquetes en esta tienda</h4>
            <p class="text-xs text-neutral-500 max-w-sm mx-auto">Comienza agregando los planes o servicios que deseas ofrecer a tus clientes.</p>
            <button
              @click="openCreateItem"
              class="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold"
            >
              Agregar Primer Paquete
            </button>
          </div>
        </div>

        <!-- TAB 3: FAQS -->
        <div v-if="activeTab === 'faqs'" class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-semibold text-white">Preguntas Frecuentes (FAQ)</h3>
              <p class="text-xs text-neutral-400">Resuelve dudas comunes de los clientes antes de contratar.</p>
            </div>
            <button
              @click="openCreateFaq"
              class="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-sm flex items-center space-x-1.5"
            >
              <i class="pi pi-plus text-xs"></i>
              <span>Nueva FAQ</span>
            </button>
          </div>

          <div v-if="faqs.length > 0" class="space-y-3">
            <div
              v-for="faq in faqs"
              :key="faq.id"
              class="p-5 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 flex items-start justify-between gap-4"
            >
              <div class="space-y-1.5 flex-1">
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-0.5 rounded bg-neutral-900 text-[10px] font-mono text-neutral-400">Orden {{ faq.orden }}</span>
                  <h4 class="text-sm font-semibold text-white">{{ faq.pregunta }}</h4>
                </div>
                <p class="text-xs text-neutral-400 leading-relaxed">{{ faq.respuesta }}</p>
              </div>

              <div class="flex items-center space-x-2 shrink-0">
                <button
                  @click="openEditFaq(faq)"
                  class="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                >
                  <i class="pi pi-pencil text-xs"></i>
                </button>
                <button
                  @click="handleDeleteFaq(faq)"
                  class="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 transition-colors"
                >
                  <i class="pi pi-trash text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="p-12 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 text-center space-y-3">
            <div class="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
              <i class="pi pi-question text-lg"></i>
            </div>
            <h4 class="text-sm font-semibold text-white">No hay preguntas frecuentes registradas</h4>
            <p class="text-xs text-neutral-500 max-w-sm mx-auto">Crea respuestas a dudas recurrentes como métodos de pago, tiempos de entrega o garantías.</p>
            <button
              @click="openCreateFaq"
              class="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold"
            >
              Crear Pregunta
            </button>
          </div>
        </div>

        <!-- TAB 4: CONTACTO & WHATSAPP -->
        <div v-if="activeTab === 'contacto'" class="space-y-6">
          <div class="max-w-2xl p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-5">
            <div>
              <h3 class="text-sm font-semibold text-white flex items-center space-x-2">
                <i class="pi pi-whatsapp text-emerald-400 text-sm"></i>
                <span>Canales de Contacto Directo</span>
              </h3>
              <p class="text-xs text-neutral-400 mt-0.5">Configura el WhatsApp de ventas y el correo corporativo vinculado a esta tienda.</p>
            </div>

            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs text-neutral-300 font-medium">Número de WhatsApp (con lada internacional)</label>
                <input
                  v-model="config.whatsapp_contacto"
                  type="text"
                  placeholder="Ej. 5215512345678"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
                <span class="text-[10px] text-neutral-500">Formato: Código de país + número (ej. 52155... para México).</span>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs text-neutral-300 font-medium">Mensaje Predeterminado al hacer Clic en WhatsApp</label>
                <textarea
                  v-model="config.whatsapp_mensaje"
                  rows="3"
                  placeholder="Ej. Hola, me interesa información sobre sus paquetes de diseño web..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 resize-none"
                ></textarea>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs text-neutral-300 font-medium">Correo Electrónico de Ventas / Soporte</label>
                <input
                  v-model="config.email_contacto"
                  type="email"
                  placeholder="Ej. ventas@puvnex.io"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <div class="pt-4 flex justify-end">
              <button
                @click="handleSaveConfig"
                :disabled="isSavingConfig"
                class="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
              >
                <i v-if="isSavingConfig" class="pi pi-spin pi-spinner text-xs"></i>
                <i v-else class="pi pi-check text-xs"></i>
                <span>{{ isSavingConfig ? 'Guardando...' : 'Guardar Contacto' }}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- MODAL CREAR / EDITAR PAQUETE ITEM -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="isItemModalOpen"
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          @click.self="isItemModalOpen = false"
        >
          <div class="w-full max-w-lg rounded-2xl bg-[#0c0c0e] border border-neutral-800 p-6 space-y-5 shadow-2xl my-8">
            <div class="flex items-center justify-between pb-3 border-b border-neutral-800/80">
              <h3 class="text-sm font-semibold text-white">
                {{ isEditingItem ? 'Editar Paquete' : 'Nuevo Paquete de Catálogo' }}
              </h3>
              <button @click="isItemModalOpen = false" class="text-neutral-400 hover:text-white">
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>

            <div class="space-y-4 text-xs">
              <div class="space-y-1.5">
                <label class="text-neutral-300 font-medium">Nombre del Paquete / Servicio</label>
                <input
                  v-model="itemFormData.nombre"
                  type="text"
                  placeholder="Ej. Landing Page Express"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="text-neutral-300 font-medium">Categoría</label>
                  <input
                    v-model="itemFormData.categoria"
                    type="text"
                    placeholder="Ej. Diseño Web / Hosting"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-neutral-300 font-medium">Orden de Aparición</label>
                  <input
                    v-model.number="itemFormData.orden"
                    type="number"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="space-y-1.5">
                  <label class="text-neutral-300 font-medium">Precio</label>
                  <input
                    v-model.number="itemFormData.precio"
                    type="number"
                    step="any"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-neutral-300 font-medium">Periodo</label>
                  <input
                    v-model="itemFormData.periodo"
                    type="text"
                    placeholder="pago único, /mes, /año"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-neutral-300 font-medium">Moneda</label>
                  <input
                    v-model="itemFormData.moneda"
                    type="text"
                    placeholder="MXN"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-neutral-300 font-medium">Descripción Corta</label>
                <input
                  v-model="itemFormData.descripcion"
                  type="text"
                  placeholder="Resumen del paquete en una línea"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-neutral-300 font-medium">Características / Beneficios (1 por línea)</label>
                <textarea
                  v-model="itemFormData.caracteristicas"
                  rows="4"
                  placeholder="Diseño One-Page responsivo&#10;Dominio .com gratis 1 año&#10;Certificado SSL incluido"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 resize-none font-mono text-[11px]"
                ></textarea>
              </div>

              <div class="flex items-center space-x-6 pt-2">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="itemFormData.destacado === 1"
                    @change="itemFormData.destacado = itemFormData.destacado === 1 ? 0 : 1"
                    class="rounded bg-neutral-900 border-neutral-700 text-white focus:ring-0"
                  />
                  <span class="text-neutral-300">Marcar como Destacado / Popular ⭐</span>
                </label>

                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="itemFormData.activo === 1"
                    @change="itemFormData.activo = itemFormData.activo === 1 ? 0 : 1"
                    class="rounded bg-neutral-900 border-neutral-700 text-white focus:ring-0"
                  />
                  <span class="text-neutral-300">Activo en Tienda</span>
                </label>
              </div>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-3 border-t border-neutral-800/80">
              <button
                @click="isItemModalOpen = false"
                class="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                @click="handleSaveItem"
                :disabled="isSavingItem"
                class="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center space-x-1.5"
              >
                <i v-if="isSavingItem" class="pi pi-spin pi-spinner text-xs"></i>
                <span>{{ isSavingItem ? 'Guardando...' : 'Guardar Paquete' }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- MODAL CREAR / EDITAR FAQ -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="isFaqModalOpen"
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          @click.self="isFaqModalOpen = false"
        >
          <div class="w-full max-w-md rounded-2xl bg-[#0c0c0e] border border-neutral-800 p-6 space-y-5 shadow-2xl">
            <div class="flex items-center justify-between pb-3 border-b border-neutral-800/80">
              <h3 class="text-sm font-semibold text-white">
                {{ isEditingFaq ? 'Editar Pregunta Frecuente' : 'Nueva Pregunta Frecuente' }}
              </h3>
              <button @click="isFaqModalOpen = false" class="text-neutral-400 hover:text-white">
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>

            <div class="space-y-4 text-xs">
              <div class="space-y-1.5">
                <label class="text-neutral-300 font-medium">Pregunta</label>
                <input
                  v-model="faqFormData.pregunta"
                  type="text"
                  placeholder="Ej. ¿Cuánto tiempo tarda la entrega?"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-neutral-300 font-medium">Respuesta</label>
                <textarea
                  v-model="faqFormData.respuesta"
                  rows="4"
                  placeholder="Escribe la respuesta clara y detallada..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 resize-none"
                ></textarea>
              </div>

              <div class="space-y-1.5">
                <label class="text-neutral-300 font-medium">Orden</label>
                <input
                  v-model.number="faqFormData.orden"
                  type="number"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-3 border-t border-neutral-800/80">
              <button
                @click="isFaqModalOpen = false"
                class="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                @click="handleSaveFaq"
                :disabled="isSavingFaq"
                class="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center space-x-1.5"
              >
                <i v-if="isSavingFaq" class="pi pi-spin pi-spinner text-xs"></i>
                <span>{{ isSavingFaq ? 'Guardando...' : 'Guardar FAQ' }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Componente Toast Global -->
    <AppToast />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
