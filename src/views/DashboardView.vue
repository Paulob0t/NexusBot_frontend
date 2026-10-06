<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { dashboardApi, type DashboardResponse, type PagoItem } from '@/api/dashboard'

import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppToast from '@/components/common/AppToast.vue'
import DashboardKpis from '@/components/dashboard/DashboardKpis.vue'
import PendingPaymentsTable from '@/components/dashboard/PendingPaymentsTable.vue'
import FinancialTrends from '@/components/dashboard/FinancialTrends.vue'
import ServiceDistribution from '@/components/dashboard/ServiceDistribution.vue'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const isMobileSidebarOpen = ref(false)
const user = computed(() => authStore.user)
const isClient = computed(() => authStore.isCliente)

// Estados de control
const currentSistema = ref<'conlineweb' | 'hostingpro'>('conlineweb')
const isLoading = ref(true)
const dashboardData = ref<DashboardResponse | null>(null)
const errorMsg = ref<string | null>(null)

// Filtros y Búsqueda de Pagos
const searchQuery = ref('')
const activeFilter = ref<string>('todos')

async function loadDashboardData() {
  isLoading.value = true
  errorMsg.value = null
  try {
    const data = await dashboardApi.getStats(currentSistema.value)
    dashboardData.value = data
  } catch (err: any) {
    errorMsg.value = err.response?.data?.detail || 'Error al conectar con la base de datos'
  } finally {
    isLoading.value = false
  }
}

watch(currentSistema, () => {
  loadDashboardData()
})

onMounted(() => {
  loadDashboardData()
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function formatCurrency(amount: number, currency: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency || 'MXN',
    minimumFractionDigits: 2
  }).format(amount)
}

function formatWhatsAppLink(phone: string | null, cliente: string, monto: number, concepto: string): string {
  if (!phone) return '#'
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  const msg = encodeURIComponent(
    `Hola ${cliente}, le saludamos de NexusBot CRM. Le recordamos que su servicio "${concepto}" cuenta con un saldo pendiente de ${formatCurrency(monto)} MXN. ¿Le gustaría que le compartamos los métodos de pago?`
  )
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${msg}`
}

function copyPaymentDetails(pago: PagoItem) {
  const text = `Cliente: ${pago.cliente_nombre}\nConcepto: ${pago.concepto}\nMonto: ${formatCurrency(pago.monto, pago.currency)}\nVencimiento: ${pago.fecha_limite || 'Sin fecha'}`
  navigator.clipboard.writeText(text)
  showToast('Datos de pago copiados al portapapeles')
}

// Filtro Reactivo de Pagos
const filteredPagos = computed(() => {
  if (!dashboardData.value) return []
  let list = dashboardData.value.pagos_pendientes

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(
      (p) =>
        p.cliente_nombre.toLowerCase().includes(query) ||
        p.concepto.toLowerCase().includes(query) ||
        (p.nombre_servicio && p.nombre_servicio.toLowerCase().includes(query))
    )
  }

  if (activeFilter.value === 'vencidos') {
    list = list.filter((p) => p.estado_vencimiento === 'vencido')
  } else if (activeFilter.value === 'prox7') {
    list = list.filter((p) => p.estado_vencimiento === 'prox7')
  } else if (activeFilter.value === 'dominios') {
    list = list.filter((p) => p.tipo_servicio === 1)
  } else if (activeFilter.value === 'hosting') {
    list = list.filter((p) => p.tipo_servicio === 2)
  }

  return list
})

const maxTrendAmount = computed(() => {
  if (!dashboardData.value?.monthly_trend || dashboardData.value.monthly_trend.length === 0) return 1
  return Math.max(...dashboardData.value.monthly_trend.map((t) => t.pagados), 1)
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
            <div class="hidden sm:flex items-center space-x-2.5">
              <span class="text-sm font-semibold text-white">Dashboard</span>
              <span class="text-neutral-700">/</span>
              <span class="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">{{ currentSistema }}</span>
            </div>
          </div>

          <div class="flex items-center space-x-3 sm:space-x-4">
            <!-- Selector ConlineWeb / HostingPro -->
            <div v-if="!isClient" class="flex p-1 rounded-lg bg-neutral-950 border border-neutral-800">
              <button
                @click="currentSistema = 'conlineweb'"
                :class="[
                  'px-3 py-1 rounded-md text-xs font-medium transition-all duration-150',
                  currentSistema === 'conlineweb' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                ]"
              >
                ConlineWeb
              </button>
              <button
                @click="currentSistema = 'hostingpro'"
                :class="[
                  'px-3 py-1 rounded-md text-xs font-medium transition-all duration-150',
                  currentSistema === 'hostingpro' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                ]"
              >
                HostingPro
              </button>
            </div>

            <!-- Perfil & Logout -->
            <div class="flex items-center space-x-3 pl-2 sm:pl-3 border-l border-neutral-800">
              <div class="hidden md:flex flex-col text-right">
                <span class="text-xs font-medium text-white">{{ user?.nombre || user?.usuario }}</span>
                <span class="text-[10px] text-neutral-500 font-mono">{{ user?.rol }}</span>
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
        </div>
      </header>

      <!-- NOTIFICACIONES TOAST -->
      <AppToast />

      <!-- CONTENIDO PRINCIPAL -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <!-- BIENVENIDA HERO SOBRIO -->
        <div class="rounded-xl bg-[#0c0c0e] border border-neutral-800 p-6">
          <div class="space-y-1.5">
            <div class="flex items-center space-x-2">
              <span class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Resumen General</span>
              <span class="text-neutral-700">•</span>
              <span class="text-[10px] font-mono text-neutral-400 uppercase">{{ currentSistema }}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Bienvenido, {{ user?.nombre || user?.usuario }}
            </h2>
            <p class="text-neutral-400 text-xs sm:text-sm">
              Métricas de clientes, cobros pendientes y estado de infraestructura cloud.
            </p>
          </div>
        </div>

        <!-- LOADING STATE -->
        <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center space-y-3">
          <i class="pi pi-spin pi-spinner text-2xl text-neutral-400"></i>
          <p class="text-neutral-500 text-xs font-mono">Cargando métricas...</p>
        </div>

        <!-- ERROR STATE -->
        <div v-else-if="errorMsg" class="p-4 rounded-xl bg-neutral-900 border border-red-900/60 text-red-400 text-xs">
          <div class="flex items-center space-x-2 font-semibold mb-1">
            <i class="pi pi-info-circle"></i>
            <span>Error al cargar datos</span>
          </div>
          <p class="text-neutral-400">{{ errorMsg }}</p>
        </div>

        <!-- CONTENIDO CARGADO -->
        <template v-else-if="dashboardData">
          <!-- 1. KPIS SUPERIORES -->
          <DashboardKpis
            :kpis="dashboardData.kpis"
            :format-currency="formatCurrency"
          />

          <!-- 2. TABLA DE COBRANZA -->
          <PendingPaymentsTable
            :pagos="filteredPagos"
            :search-query="searchQuery"
            :active-filter="activeFilter"
            :format-currency="formatCurrency"
            :format-whats-app-link="formatWhatsAppLink"
            @update:search-query="searchQuery = $event"
            @update:active-filter="activeFilter = $event"
            @copy-details="copyPaymentDetails"
          />

          <!-- 3. TENDENCIAS & DISTRIBUCIÓN -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FinancialTrends
              :trends="dashboardData.monthly_trend"
              :max-trend-amount="maxTrendAmount"
              :format-currency="formatCurrency"
            />
            <ServiceDistribution
              :distribution="dashboardData.distribution"
              :format-currency="formatCurrency"
            />
          </div>
        </template>
      </main>
    </div>
  </div>
</template>
