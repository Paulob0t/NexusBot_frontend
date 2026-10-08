<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHostings } from '@/composables/useHostings'
import { useToast } from '@/composables/useToast'
import { hostingsApi, type HostingListItem, type HostingDetail, type HostingPayload } from '@/api/hostings'
import { clientesApi } from '@/api/clientes'

import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppToast from '@/components/common/AppToast.vue'
import HostingKpis from '@/components/hostings/HostingKpis.vue'
import HostingTable from '@/components/hostings/HostingTable.vue'
import HostingCardGrid from '@/components/hostings/HostingCardGrid.vue'
import HostingDetailModal from '@/components/hostings/HostingDetailModal.vue'
import HostingFormModal from '@/components/hostings/HostingFormModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const isMobileSidebarOpen = ref(false)
const user = computed(() => authStore.user)
const isSuperAdmin = computed(() => authStore.isSuperAdmin || (user.value?.id_tipo_usuario ?? 0) >= 1)

// Composable de Hostings
const {
  isLoading,
  isSaving,
  hostings,
  stats,
  searchQuery,
  activeFilter,
  currentPage,
  totalItems,
  totalPages,
  viewMode,
  loadHostings,
  handleSearchInput,
  clearSearch,
  setFilter,
  changePage,
  removeHosting,
  formatWhatsAppRenewalLink,
} = useHostings()

// Modales y Estados
const isDetailOpen = ref(false)
const isFormOpen = ref(false)
const isEditing = ref(false)
const isLoadingDetail = ref(false)
const currentDetail = ref<HostingDetail | null>(null)
const editingHostingId = ref<number | null>(null)
const clientesList = ref<Array<{ id: number; empresa: string; nombre_contacto: string }>>([])

const formData = ref<HostingPayload>({
  cliente_id: 0,
  nom_host: '',
  dominio: '',
  usuario: '',
  contrasena_normal: '',
  tipo_producto: 'Servicio de alojamiento',
  producto: 1,
  costo_producto: 1500.0,
  id_forma_pago: 1,
  dns: '',
  url_pago: '',
  url_acceso: '',
  ns1: 'ns1.puvnex.io',
  ns2: 'ns2.puvnex.io',
  fecha_contratacion: new Date().toISOString().split('T')[0],
  fecha_pago: '',
  estado_producto: 1,
  IVA: 1,
  frecuencia_pago: 2,
})

async function loadClientesDropdown() {
  try {
    const res = await clientesApi.getClientes({ limit: 100 })
    clientesList.value = res.items.map((c) => ({
      id: c.id,
      empresa: c.empresa,
      nombre_contacto: c.nombre_contacto,
    }))
  } catch {}
}

async function openDetail(id: number) {
  isDetailOpen.value = true
  isLoadingDetail.value = true
  try {
    currentDetail.value = await hostingsApi.getHostingDetail(id)
  } catch {
    showToast('No se pudo cargar el detalle del hosting', 'error')
    isDetailOpen.value = false
  } finally {
    isLoadingDetail.value = false
  }
}

function openCreate() {
  router.push('/hostings/nuevo')
}

async function openEdit(host: HostingListItem | HostingDetail) {
  isEditing.value = true
  editingHostingId.value = host.id_orden
  try {
    const d = await hostingsApi.getHostingDetail(host.id_orden)
    formData.value = {
      cliente_id: d.cliente_id,
      nom_host: d.nom_host,
      dominio: d.dominio,
      usuario: d.usuario,
      contrasena_normal: d.contrasena_normal || '',
      tipo_producto: d.tipo_producto,
      producto: d.producto,
      costo_producto: d.costo_producto,
      id_forma_pago: d.id_forma_pago,
      dns: d.dns,
      url_pago: d.url_pago,
      url_acceso: d.url_acceso,
      ns1: d.ns1,
      ns2: d.ns2,
      fecha_contratacion: d.fecha_contratacion || '',
      fecha_pago: d.fecha_pago || '',
      estado_producto: d.estado_producto,
      IVA: d.IVA,
      frecuencia_pago: d.frecuencia_pago,
    }
  } catch {
    formData.value.nom_host = host.nom_host
  }
  isFormOpen.value = true
}

async function handleSaveHosting() {
  if (!formData.value.nom_host.trim() || !formData.value.cliente_id) {
    showToast('El hostname y cliente titular son requeridos', 'error')
    return
  }
  isSaving.value = true
  try {
    if (isEditing.value && editingHostingId.value) {
      const updated = await hostingsApi.updateHosting(editingHostingId.value, formData.value)
      showToast(`Hosting "${updated.nom_host}" actualizado con éxito`)
      if (currentDetail.value && currentDetail.value.id_orden === updated.id_orden) {
        currentDetail.value = updated
      }
    } else {
      const created = await hostingsApi.createHosting(formData.value)
      showToast(`Hosting "${created.nom_host}" registrado con éxito`)
    }
    isFormOpen.value = false
    loadHostings()
  } catch (err: any) {
    showToast(err.response?.data?.detail || 'Error al guardar hosting', 'error')
  } finally {
    isSaving.value = false
  }
}

function handleWhatsApp(host: HostingListItem) {
  const link = formatWhatsAppRenewalLink(host)
  window.open(link, '_blank')
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadHostings()
  loadClientesDropdown()
})
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
              <span class="text-sm font-semibold tracking-tight text-white">Consulta de Hosting</span>
              <span class="text-neutral-600 hidden sm:inline">•</span>
              <span class="text-[11px] text-neutral-400 font-mono uppercase tracking-wider hidden sm:inline">Servidores & Alojamiento</span>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Botón Nuevo Hosting -->
            <button
              v-if="isSuperAdmin"
              @click="openCreate"
              class="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all duration-200 active:scale-95"
            >
              <i class="pi pi-plus text-xs"></i>
              <span>Asignar Hosting</span>
            </button>

            <!-- Botón Salir / Logout -->
            <button
              @click="handleLogout"
              class="p-2 rounded-xl bg-neutral-900 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors"
              title="Cerrar sesión"
            >
              <i class="pi pi-sign-out text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- NOTIFICACIONES TOAST -->
      <AppToast />

      <!-- CONTENIDO -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 w-full">
        <!-- 1. KPIS SUPERIORES -->
        <HostingKpis
          :stats="stats"
          :active-filter="activeFilter"
          @select-filter="setFilter"
        />

        <!-- 2. BARRA DE BÚSQUEDA Y FILTROS -->
        <div class="p-4 sm:p-5 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-4">
          <div class="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div class="relative w-full md:w-96">
              <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
              <input
                v-model="searchQuery"
                @input="handleSearchInput"
                type="text"
                placeholder="Buscar por host, dominio, cliente o usuario..."
                class="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors font-sans"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>

            <!-- Toggle Tabla / Tarjetas & Recargar -->
            <div class="flex items-center space-x-2 w-full md:w-auto justify-end">
              <div class="flex p-0.5 rounded-xl bg-[#141417] border border-neutral-800">
                <button
                  @click="viewMode = 'table'"
                  :class="[
                    'p-1.5 rounded-lg text-xs transition-colors',
                    viewMode === 'table' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  ]"
                  title="Vista Tabla"
                >
                  <i class="pi pi-table"></i>
                </button>
                <button
                  @click="viewMode = 'cards'"
                  :class="[
                    'p-1.5 rounded-lg text-xs transition-colors',
                    viewMode === 'cards' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  ]"
                  title="Vista Tarjetas"
                >
                  <i class="pi pi-th-large"></i>
                </button>
              </div>

              <button
                @click="loadHostings"
                class="p-2 rounded-xl bg-[#141417] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                title="Actualizar datos"
              >
                <i :class="['pi pi-refresh text-xs', isLoading ? 'pi-spin' : '']"></i>
              </button>
            </div>
          </div>

          <!-- Filtros Rápidos -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none scrollbar-thin">
            <button
              v-for="f in [
                { key: 'activos', label: 'Activos' },
                { key: 'inactivos', label: 'Inactivos' },
                { key: 'por_vencer_30', label: 'Próx. 30 Días' },
                { key: 'por_vencer_7', label: 'Crítico ≤7d' },
                { key: 'vencidos', label: 'Vencidos' },
                { key: 'todos', label: 'Todos' },
                { key: 'eliminados', label: 'Papelera' },
              ]"
              :key="f.key"
              @click="setFilter(f.key)"
              :class="[
                'px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 flex items-center space-x-1.5 border text-xs',
                activeFilter === f.key
                  ? 'bg-neutral-800 text-white border-neutral-600 font-semibold'
                  : 'bg-[#141417] text-neutral-400 border-neutral-800/80 hover:border-neutral-700 hover:text-neutral-200'
              ]"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- 3. LISTADO (TABLA O TARJETAS) -->
        <div class="rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 overflow-hidden">
          <div v-if="isLoading" class="p-16 flex flex-col items-center justify-center space-y-3">
            <i class="pi pi-spin pi-spinner text-2xl text-neutral-400"></i>
            <span class="text-xs text-neutral-400 font-mono">Cargando servidores de hosting...</span>
          </div>

          <div v-else-if="hostings.length === 0" class="p-16 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto text-xl">
              <i class="pi pi-server"></i>
            </div>
            <div class="text-sm font-semibold text-white">No se encontraron servicios de hosting</div>
            <p class="text-xs text-neutral-500 max-w-sm mx-auto">
              No hay registros con los filtros o término de búsqueda aplicados actualmente.
            </p>
          </div>

          <div v-else>
            <HostingTable
              v-if="viewMode === 'table'"
              :hostings="hostings"
              :is-loading="isLoading"
              :is-super-admin="isSuperAdmin"
              @open-detail="openDetail"
              @open-edit="openEdit"
              @delete-hosting="removeHosting"
              @send-whatsapp="handleWhatsApp"
            />
            <div v-else class="p-5">
              <HostingCardGrid
                :hostings="hostings"
                :is-super-admin="isSuperAdmin"
                @open-detail="openDetail"
                @open-edit="openEdit"
                @delete-hosting="removeHosting"
                @send-whatsapp="handleWhatsApp"
              />
            </div>

            <!-- Paginación -->
            <div class="p-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 bg-[#141417]/40">
              <div class="font-mono">
                Mostrando <span class="font-bold text-white">{{ hostings.length }}</span> de <span class="font-bold text-white">{{ totalItems }}</span> registros
              </div>
              <div class="flex items-center space-x-1.5">
                <button
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-300 transition-colors"
                >
                  Anterior
                </button>
                <span class="px-3 py-1 font-mono font-medium text-white">
                  Página {{ currentPage }} de {{ totalPages }}
                </span>
                <button
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-300 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- MODAL DE DETALLE -->
    <HostingDetailModal
      :is-open="isDetailOpen"
      :hosting="currentDetail"
      :is-loading="isLoadingDetail"
      :is-super-admin="isSuperAdmin"
      @close="isDetailOpen = false"
      @edit="openEdit"
      @send-whatsapp="handleWhatsApp"
    />

    <!-- MODAL DE CREACIÓN / EDICIÓN -->
    <HostingFormModal
      :is-open="isFormOpen"
      :is-editing="isEditing"
      :is-saving="isSaving"
      :form-data="formData"
      :clientes-list="clientesList"
      @close="isFormOpen = false"
      @save="handleSaveHosting"
    />
  </div>
</template>
