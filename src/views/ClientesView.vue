<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useClientes } from '@/composables/useClientes'
import { useToast } from '@/composables/useToast'
import { clientesApi, type ClienteListItem, type ClienteDetail, type ClientePayload } from '@/api/clientes'

import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppToast from '@/components/common/AppToast.vue'
import ClienteKpis from '@/components/clientes/ClienteKpis.vue'
import ClienteTable from '@/components/clientes/ClienteTable.vue'
import ClienteCardGrid from '@/components/clientes/ClienteCardGrid.vue'
import ClienteDetailModal from '@/components/clientes/ClienteDetailModal.vue'
import ClienteFormModal from '@/components/clientes/ClienteFormModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const isMobileSidebarOpen = ref(false)
const user = computed(() => authStore.user)
const isSuperAdmin = computed(() => authStore.isSuperAdmin || (user.value?.id_tipo_usuario ?? 0) >= 1)

// Composable de Clientes
const {
  isLoading,
  isSaving,
  clientes,
  stats,
  searchQuery,
  activeFilter,
  currentSistema,
  currentPage,
  totalItems,
  totalPages,
  viewMode,
  loadClientes,
  handleSearchInput,
  clearSearch,
  setFilter,
  changePage,
  removeCliente,
  formatWhatsAppLink,
  formatCurrency,
  getInitials,
} = useClientes()

// Modales y Estados Locales
const isDetailOpen = ref(false)
const isFormOpen = ref(false)
const isEditing = ref(false)
const isLoadingDetail = ref(false)
const currentDetail = ref<ClienteDetail | null>(null)
const editingClientId = ref<number | null>(null)

const formData = ref<ClientePayload>({
  empresa: '',
  nombre_contacto: '',
  correo: '',
  telefono: '',
  rfc: '',
  rsocial: '',
  calle: '',
  next: '',
  nint: '',
  col: '',
  cp: '',
  ciudad: '',
  estado: '',
  pais: 'México',
  especificacion: '',
})

async function openDetail(id: number) {
  isDetailOpen.value = true
  isLoadingDetail.value = true
  try {
    currentDetail.value = await clientesApi.getClienteDetail(id)
  } catch {
    showToast('No se pudo cargar el detalle del cliente', 'error')
    isDetailOpen.value = false
  } finally {
    isLoadingDetail.value = false
  }
}

function openCreate() {
  isEditing.value = false
  editingClientId.value = null
  formData.value = {
    empresa: '',
    nombre_contacto: '',
    correo: '',
    telefono: '',
    rfc: '',
    rsocial: '',
    calle: '',
    next: '',
    nint: '',
    col: '',
    cp: '',
    ciudad: '',
    estado: '',
    pais: 'México',
    especificacion: '',
  }
  isFormOpen.value = true
}

async function openEdit(client: ClienteListItem | ClienteDetail) {
  isEditing.value = true
  editingClientId.value = client.id
  try {
    const d = 'calle' in client ? client : await clientesApi.getClienteDetail(client.id)
    formData.value = {
      empresa: d.empresa || '',
      nombre_contacto: d.nombre_contacto || '',
      correo: d.correo || '',
      telefono: d.telefono || '',
      rfc: d.rfc || '',
      rsocial: d.rsocial || '',
      calle: d.calle || '',
      next: d.next || '',
      nint: d.nint || '',
      col: d.col || '',
      cp: d.cp || '',
      ciudad: d.ciudad || '',
      estado: d.estado || '',
      pais: d.pais || 'México',
      especificacion: d.especificacion || '',
    }
  } catch {
    formData.value.empresa = client.empresa
    formData.value.nombre_contacto = client.nombre_contacto
  }
  isFormOpen.value = true
}

async function handleSaveClient() {
  if (!formData.value.empresa.trim() || !formData.value.nombre_contacto.trim()) {
    showToast('Empresa y Contacto son obligatorios', 'error')
    return
  }
  isSaving.value = true
  try {
    if (isEditing.value && editingClientId.value) {
      const updated = await clientesApi.updateCliente(editingClientId.value, formData.value)
      showToast(`Cliente "${updated.empresa}" actualizado con éxito`)
      if (currentDetail.value && currentDetail.value.id === updated.id) {
        currentDetail.value = updated
      }
    } else {
      const created = await clientesApi.createCliente(formData.value)
      showToast(`Cliente "${created.empresa}" registrado con éxito`)
    }
    isFormOpen.value = false
    loadClientes()
  } catch (err: any) {
    showToast(err.response?.data?.detail || 'Error al guardar cliente', 'error')
  } finally {
    isSaving.value = false
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadClientes()
})
</script>

<template>
  <div class="h-screen w-screen bg-[#09090b] text-neutral-200 selection:bg-neutral-700 selection:text-white flex overflow-hidden">
    <!-- MENÚ LATERAL -->
    <AppSidebar
      :is-mobile-open="isMobileSidebarOpen"
      @close-mobile="isMobileSidebarOpen = false"
    />

    <!-- CONTENEDOR PRINCIPAL -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-16 bg-[#09090b]">
      <!-- HEADER SUPERIOR -->
      <header class="sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur-md border-b border-neutral-900 h-16 shrink-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button
              @click="isMobileSidebarOpen = true"
              class="lg:hidden p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <i class="pi pi-bars text-sm"></i>
            </button>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-semibold text-white">Directorio de Clientes</span>
              <span class="text-neutral-700 hidden sm:inline">/</span>
              <span class="text-[11px] font-mono text-neutral-400 uppercase tracking-wider hidden sm:inline">{{ currentSistema }}</span>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Switcher Sistema Suave con Pastilla Deslizante -->
            <div v-if="isSuperAdmin" class="hidden sm:flex relative p-1 rounded-lg bg-neutral-950 border border-neutral-800 select-none">
              <!-- Fondo deslizante con transición suave -->
              <div
                class="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md bg-neutral-800 border border-neutral-700/40 transition-all duration-300 ease-out pointer-events-none"
                :class="currentSistema === 'conlineweb' ? 'left-1' : 'left-[calc(50%+3px)]'"
              ></div>

              <button
                @click="currentSistema = 'conlineweb'"
                class="relative z-10 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                :class="currentSistema === 'conlineweb' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'"
              >
                ConlineWeb
              </button>
              <button
                @click="currentSistema = 'hostingpro'"
                class="relative z-10 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                :class="currentSistema === 'hostingpro' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'"
              >
                HostingPro
              </button>
            </div>

            <!-- Botón Nuevo Cliente (Monocromático) -->
            <button
              v-if="isSuperAdmin"
              @click="openCreate"
              class="px-3.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-medium flex items-center space-x-1.5 transition-colors active:scale-98"
            >
              <i class="pi pi-plus text-xs"></i>
              <span>Nuevo Cliente</span>
            </button>

            <!-- Botón Salir / Logout -->
            <button
              @click="handleLogout"
              class="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              title="Cerrar sesión"
            >
              <i class="pi pi-sign-out text-xs"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- NOTIFICACIONES TOAST -->
      <AppToast />

      <!-- CONTENIDO CON TRANSICIÓN -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-5 w-full">
        <!-- 1. KPIS SUPERIORES -->
        <ClienteKpis
          :stats="stats"
          :active-filter="activeFilter"
          @select-filter="setFilter"
        />

        <!-- 2. BARRA DE BÚSQUEDA Y FILTROS -->
        <div class="p-4 sm:p-5 rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-3.5">
          <div class="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div class="relative w-full md:w-96">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
              <input
                v-model="searchQuery"
                @input="handleSearchInput"
                type="text"
                placeholder="Buscar por empresa, contacto, correo, RFC..."
                class="w-full pl-8 pr-8 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>

            <div class="flex items-center justify-between w-full md:w-auto space-x-3">
              <span class="text-xs text-neutral-400 font-mono">
                Mostrando <strong class="text-white">{{ clientes.length }}</strong> de <strong class="text-white">{{ totalItems }}</strong>
              </span>

              <div class="flex p-0.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <button
                  @click="viewMode = 'table'"
                  :class="['p-1.5 rounded text-xs transition-colors', viewMode === 'table' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white']"
                  title="Vista en tabla"
                >
                  <i class="pi pi-table text-xs"></i>
                </button>
                <button
                  @click="viewMode = 'cards'"
                  :class="['p-1.5 rounded text-xs transition-colors', viewMode === 'cards' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white']"
                  title="Vista en tarjetas"
                >
                  <i class="pi pi-th-large text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Pestañas Filtros Rápidos -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none">
            <button
              v-for="f in [
                { id: 'activos', label: 'Clientes Activos' },
                { id: 'pendientes', label: 'Con Pagos Pendientes', badge: stats.con_pagos_pendientes },
                { id: 'sin_servicios', label: 'Sin Servicios' },
                { id: 'transferidos', label: 'Transferidos' },
                { id: 'eliminados', label: 'Eliminados' },
                { id: 'todos', label: 'Todos' },
              ]"
              :key="f.id"
              @click="setFilter(f.id)"
              :class="[
                'px-2.5 py-1 rounded-lg transition-all duration-200 shrink-0 flex items-center space-x-1.5 font-medium text-xs',
                activeFilter === f.id
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-900'
              ]"
            >
              <span>{{ f.label }}</span>
              <span v-if="f.badge && f.badge > 0" class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-700">
                {{ f.badge }}
              </span>
            </button>
          </div>
        </div>

        <!-- 3. CONTENEDOR CON TRANSICIÓN SUAVE AL CAMBIAR SISTEMA O FILTRO -->
        <Transition name="fade-slide" mode="out-in">
          <div :key="`${currentSistema}-${activeFilter}-${isLoading}`">
            <!-- Loading -->
            <div v-if="isLoading" class="py-16 text-center space-y-2">
              <i class="pi pi-spin pi-spinner text-2xl text-neutral-400"></i>
              <p class="text-xs text-neutral-500 font-mono">Cargando clientes de {{ currentSistema }}...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="clientes.length === 0" class="p-10 text-center rounded-xl bg-[#0c0c0e] border border-neutral-800 space-y-2">
              <i class="pi pi-inbox text-3xl text-neutral-600"></i>
              <h3 class="text-sm font-semibold text-white">No se encontraron clientes en {{ currentSistema }}</h3>
              <p class="text-xs text-neutral-500">Prueba cambiando el filtro o agregando un nuevo cliente.</p>
              <button
                @click="clearSearch(); setFilter('activos')"
                class="mt-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-white transition-colors"
              >
                Restablecer Filtros
              </button>
            </div>

            <!-- Listado Activo -->
            <div v-else class="space-y-4">
              <!-- 4. TABLA DESKTOP -->
              <ClienteTable
                v-if="viewMode === 'table'"
                :clientes="clientes"
                :is-super-admin="isSuperAdmin"
                :get-initials="getInitials"
                :format-whats-app-link="formatWhatsAppLink"
                @view-detail="openDetail"
                @edit="openEdit"
                @delete="removeCliente"
              />

              <!-- 5. GRID TARJETAS MOBILE -->
              <ClienteCardGrid
                v-else
                :clientes="clientes"
                :view-mode="viewMode"
                :is-super-admin="isSuperAdmin"
                :get-initials="getInitials"
                :format-whats-app-link="formatWhatsAppLink"
                @view-detail="openDetail"
                @edit="openEdit"
              />

              <!-- 6. PAGINACIÓN -->
              <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-900">
                <span class="text-xs text-neutral-500 font-mono">
                  Página <strong class="text-neutral-200">{{ currentPage }}</strong> de <strong class="text-neutral-200">{{ totalPages }}</strong>
                </span>
                <div class="flex items-center space-x-1">
                  <button
                    @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    v-for="p in Math.min(totalPages, 5)"
                    :key="`p-${p}`"
                    @click="changePage(p)"
                    :class="['w-7 h-7 rounded text-xs font-mono transition-colors', currentPage === p ? 'bg-neutral-800 text-white font-semibold' : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white']"
                  >
                    {{ p }}
                  </button>
                  <button
                    @click="changePage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </main>
    </div>

    <!-- MODAL DETALLE -->
    <ClienteDetailModal
      :is-open="isDetailOpen"
      :is-loading="isLoadingDetail"
      :cliente="currentDetail"
      :is-super-admin="isSuperAdmin"
      :get-initials="getInitials"
      :format-whats-app-link="formatWhatsAppLink"
      :format-currency="formatCurrency"
      @close="isDetailOpen = false"
      @edit="openEdit"
    />

    <!-- MODAL FORMULARIO -->
    <ClienteFormModal
      :is-open="isFormOpen"
      :is-editing="isEditing"
      :is-saving="isSaving"
      :form-data="formData"
      @close="isFormOpen = false"
      @submit="handleSaveClient"
    />
  </div>
</template>

<style scoped>
/* Transición suave para cambio de sistema / contenido */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
