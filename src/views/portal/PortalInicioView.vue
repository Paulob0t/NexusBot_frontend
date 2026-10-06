<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import PortalHeroGreeting from '@/components/portal/PortalHeroGreeting.vue'
import PortalAlertBanner from '@/components/portal/PortalAlertBanner.vue'
import PortalKpis from '@/components/portal/PortalKpis.vue'
import PortalQuickGrid from '@/components/portal/PortalQuickGrid.vue'
import PortalRecentActivity from '@/components/portal/PortalRecentActivity.vue'
import PortalHelpSection from '@/components/portal/PortalHelpSection.vue'
import SolicitudFormModal from '@/components/solicitudes/SolicitudFormModal.vue'
import AppToast from '@/components/common/AppToast.vue'
import { useAuthStore } from '@/stores/auth'
import { portalApi, type PortalInicioResponse } from '@/api/portal'
import { solicitudesApi, type SolicitudCreatePayload } from '@/api/solicitudes'

const authStore = useAuthStore()
const router = useRouter()
const isMobileOpen = ref(false)
const loading = ref(true)
const savingTicket = ref(false)
const isCreateTicketModalOpen = ref(false)

const portalData = reactive<PortalInicioResponse>({
  cliente_id: 0,
  cliente_nombre: '',
  cliente_empresa: '',
  cliente_correo: '',
  saludo: 'Hola',
  total_sitios: 0,
  total_pendientes: 0,
  monto_total_pendiente: 0,
  total_tickets_abiertos: 0,
  total_hostings: 0,
  total_dominios: 0,
  doc_url: 'https://conlineweb.com',
  sitios_recientes: [],
  pagos_pendientes_recientes: [],
  tickets_recientes: []
})

// Toast
const toast = reactive({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info'
})

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
  toast.message = msg
  toast.type = type
  toast.visible = true
}

async function fetchPortalData() {
  loading.value = true
  try {
    const data = await portalApi.getInicio()
    Object.assign(portalData, data)
  } catch (err: any) {
    showToast('Error al cargar la información del portal.', 'error')
  } finally {
    loading.value = false
  }
}

function handleOpenTicket() {
  isCreateTicketModalOpen.value = true
}

async function handleSaveTicket(data: SolicitudCreatePayload) {
  savingTicket.value = true
  try {
    if (!data.id_cliente && portalData.cliente_id) {
      data.id_cliente = portalData.cliente_id
    }
    await solicitudesApi.create(data)
    isCreateTicketModalOpen.value = false
    showToast('Ticket creado exitosamente. Nuestro equipo técnico lo atenderá a la brevedad.')
    await fetchPortalData()
  } catch (err: any) {
    showToast('Error al crear el ticket. Inténtalo de nuevo.', 'error')
  } finally {
    savingTicket.value = false
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchPortalData()
})
</script>

<template>
  <div class="flex h-screen bg-[#09090b] text-neutral-200 overflow-hidden font-sans selection:bg-neutral-800 selection:text-white">
    <!-- Sidebar -->
    <AppSidebar
      :is-mobile-open="isMobileOpen"
      @close-mobile="isMobileOpen = false"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#09090b]">
      <!-- Topbar Header -->
      <header class="h-16 border-b border-neutral-900 bg-[#09090b]/90 backdrop-blur-md px-4 md:px-8 flex items-center justify-between z-10 shrink-0">
        <div class="flex items-center gap-3">
          <button
            @click="isMobileOpen = true"
            class="md:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <i class="pi pi-bars text-sm"></i>
          </button>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-semibold text-white">Portal de Clientes</span>
            <span class="text-neutral-700 hidden sm:inline">/</span>
            <span class="text-[11px] font-mono text-neutral-400 uppercase tracking-wider hidden sm:inline">Panel Principal</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="fetchPortalData"
            class="p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
            title="Actualizar datos"
          >
            <i class="pi pi-refresh text-xs" :class="{ 'animate-spin': loading }"></i>
          </button>

          <div class="h-4 w-px bg-neutral-800"></div>

          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-800 flex items-center justify-center text-xs font-semibold font-mono">
              {{ portalData.cliente_nombre ? portalData.cliente_nombre.charAt(0).toUpperCase() : 'C' }}
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-xs font-semibold text-white leading-none">{{ portalData.cliente_nombre || 'Cliente' }}</p>
              <p class="text-[10px] text-neutral-500 mt-0.5 leading-none font-mono">{{ portalData.cliente_empresa || 'Cuenta personal' }}</p>
            </div>
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

      <!-- Scrollable Main View Container -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-7 max-w-7xl mx-auto w-full custom-scrollbar">
        <!-- Skeleton Loading State -->
        <div v-if="loading" class="space-y-5 animate-pulse">
          <div class="h-28 rounded-xl bg-neutral-900/60 border border-neutral-800"></div>
          <div class="h-14 rounded-xl bg-neutral-900/60 border border-neutral-800"></div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="h-24 rounded-xl bg-neutral-900/60 border border-neutral-800"></div>
          </div>
          <div class="h-64 rounded-xl bg-neutral-900/60 border border-neutral-800"></div>
        </div>

        <template v-else>
          <!-- 1. Hero Greeting Banner -->
          <PortalHeroGreeting
            :saludo="portalData.saludo"
            :nombre="portalData.cliente_nombre"
            :empresa="portalData.cliente_empresa"
            :total-pendientes="portalData.total_pendientes"
            @open-ticket="handleOpenTicket"
          />

          <!-- 2. Alert Banner (Urgent or OK) -->
          <PortalAlertBanner
            :total-pendientes="portalData.total_pendientes"
            :monto-pendiente="portalData.monto_total_pendiente"
          />

          <!-- 3. Key Metrics / KPIs -->
          <PortalKpis
            :total-sitios="portalData.total_sitios"
            :total-pendientes="portalData.total_pendientes"
            :total-tickets-abiertos="portalData.total_tickets_abiertos"
            :total-hostings="portalData.total_hostings"
            :total-dominios="portalData.total_dominios"
          />

          <!-- 4. Quick Access Grid (6 Cards) -->
          <PortalQuickGrid
            :total-sitios="portalData.total_sitios"
            :total-pendientes="portalData.total_pendientes"
            :total-tickets-abiertos="portalData.total_tickets_abiertos"
          />

          <!-- 5. Recent Activity (Websites & Tickets) -->
          <PortalRecentActivity
            :sitios="portalData.sitios_recientes"
            :tickets="portalData.tickets_recientes"
            @open-ticket="handleOpenTicket"
          />

          <!-- 6. Help & Documentation Section -->
          <PortalHelpSection
            :doc-url="portalData.doc_url"
            @open-ticket="handleOpenTicket"
          />
        </template>
      </main>
    </div>

    <!-- Modal Crear Ticket -->
    <SolicitudFormModal
      :visible="isCreateTicketModalOpen"
      :solicitud-to-edit="null"
      :agentes="[]"
      :clients="[{ id: portalData.cliente_id, nombre_contacto: portalData.cliente_nombre, empresa: portalData.cliente_empresa }]"
      :saving="savingTicket"
      @close="isCreateTicketModalOpen = false"
      @save="handleSaveTicket"
    />

    <!-- Toast Notification -->
    <AppToast />
  </div>
</template>
