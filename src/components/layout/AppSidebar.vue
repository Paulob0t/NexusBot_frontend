<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps<{
  isMobileOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close-mobile'): void
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isSuperAdmin = computed(() => authStore.isSuperAdmin || (user.value?.id_tipo_usuario ?? 0) === 1 || (user.value?.id_tipo_usuario ?? 0) === 2)
const isClient = computed(() => authStore.isCliente || (user.value?.id_tipo_usuario ?? 0) === 0)
const isAgente = computed(() => authStore.isAgente || (user.value?.id_tipo_usuario ?? 0) === 3)

// Estado colapsado / expandido adaptativo en escritorio
const isCollapsed = ref(false)

// Estados para módulos colapsables del menú
const openModules = ref<Record<string, boolean>>({
  consultas: false,
  registros: false,
  solicitudes: false,
  comunicacion: false,
  soporte: false,
  analytics: false,
  seguridad: false,
})

// Auto-expandir el módulo correspondiente según la ruta actual
function syncActiveModules(path: string) {
  if (
    path === '/clientes/nuevo' ||
    path === '/dominios/nuevo' ||
    path === '/hostings/nuevo' ||
    path === '/pagos/nuevo' ||
    path === '/registrar-pago'
  ) {
    openModules.value.registros = true
  } else if (
    path === '/clientes' ||
    path === '/dominios' ||
    path === '/hostings' ||
    path === '/pagos' ||
    (path.startsWith('/clientes/') && !path.includes('/nuevo')) ||
    (path.startsWith('/dominios/') && !path.includes('/nuevo')) ||
    (path.startsWith('/hostings/') && !path.includes('/nuevo')) ||
    (path.startsWith('/pagos/') && !path.includes('/nuevo'))
  ) {
    openModules.value.consultas = true
  } else if (path === '/recordatorios' || path.startsWith('/comunicacion')) {
    openModules.value.comunicacion = true
  } else if (path === '/solicitudes' || path.startsWith('/solicitud')) {
    openModules.value.solicitudes = true
  }
}

watch(
  () => route.path,
  (newPath) => {
    syncActiveModules(newPath)
  },
  { immediate: true }
)

function toggleModule(modKey: string) {
  if (isCollapsed.value) {
    isCollapsed.value = false
  }
  openModules.value[modKey] = !openModules.value[modKey]
}

function handleNavigation(path: string) {
  emit('close-mobile')
  router.push(path)
}

function handleLogout() {
  emit('close-mobile')
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <!-- Overlay móvil con Teleport -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="isMobileOpen"
          @click="emit('close-mobile')"
          class="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        ></div>
      </transition>
    </Teleport>

    <!-- Menú Lateral -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 bg-[#09090b] text-neutral-300 border-r border-neutral-900 flex flex-col transition-all duration-150 ease-out lg:static lg:h-screen lg:sticky lg:top-0 shrink-0 select-none overflow-hidden',
        isCollapsed ? 'lg:w-16' : 'lg:w-64',
        isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Cabecera / Marca -->
      <div class="h-16 px-4 border-b border-neutral-900 flex items-center justify-between shrink-0 bg-[#09090b]">
        <div
          class="flex items-center space-x-3 cursor-pointer overflow-hidden group"
          @click="handleNavigation('/dashboard')"
        >
          <div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
            <i class="pi pi-shield text-sm text-neutral-200"></i>
          </div>
          <div v-show="!isCollapsed" class="min-w-0">
            <span class="text-sm font-semibold tracking-tight text-white flex items-center space-x-1">
              <span>NEXUSBOT</span>
              <span class="text-neutral-500 font-normal">CRM</span>
            </span>
            <span class="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Core Suite</span>
          </div>
        </div>

        <!-- Botón toggle colapso -->
        <div class="flex items-center space-x-1">
          <button
            @click="isCollapsed = !isCollapsed"
            class="hidden lg:flex w-7 h-7 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 items-center justify-center transition-colors"
            :title="isCollapsed ? 'Expandir menú' : 'Colapsar menú'"
          >
            <i :class="isCollapsed ? 'pi pi-chevron-right text-[10px]' : 'pi pi-chevron-left text-[10px]'"></i>
          </button>
          <button
            @click="emit('close-mobile')"
            class="lg:hidden w-8 h-8 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 flex items-center justify-center transition-colors"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Scroll de Módulos -->
      <div class="flex-1 overflow-y-auto px-2.5 py-3 space-y-3 custom-scrollbar overflow-x-hidden">
        <!-- Dashboard Principal -->
        <div>
          <button
            @click="handleNavigation('/dashboard')"
            :class="[
              'w-full flex items-center rounded-lg text-xs font-medium transition-colors duration-100',
              isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-3 py-2',
              route.path === '/dashboard'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
            ]"
            :title="isCollapsed ? 'Dashboard Principal' : undefined"
          >
            <i class="pi pi-th-large text-xs text-neutral-400 shrink-0"></i>
            <span v-show="!isCollapsed" class="truncate">Dashboard</span>
          </button>
        </div>

        <!-- SECCIÓN: AGENTES / TICKETS (Solo si es Agente) -->
        <div v-if="isAgente" class="space-y-1">
          <div v-show="!isCollapsed" class="px-3 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
            Operaciones
          </div>
          <button
            @click="handleNavigation('/solicitudes')"
            :class="[
              'w-full flex items-center rounded-lg text-xs font-medium transition-colors',
              isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-3 py-2',
              route.path === '/solicitudes' || route.path.startsWith('/solicitud')
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
            ]"
            :title="isCollapsed ? 'Mis Solicitudes' : undefined"
          >
            <i class="pi pi-ticket text-xs text-neutral-400 shrink-0"></i>
            <span v-show="!isCollapsed" class="truncate">Mis Solicitudes</span>
          </button>
        </div>

        <!-- SECCIÓN: CLIENTES / PORTAL (Solo si es Cliente) -->
        <div v-if="isClient" class="space-y-1">
          <div v-show="!isCollapsed" class="px-3 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
            Mi Portal
          </div>
          <button
            @click="handleNavigation('/portal')"
            :class="[
              'w-full flex items-center rounded-lg text-xs font-medium transition-colors',
              isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-3 py-2',
              route.path === '/portal'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
            ]"
            :title="isCollapsed ? 'Inicio Portal' : undefined"
          >
            <i class="pi pi-home text-xs text-neutral-400 shrink-0"></i>
            <span v-show="!isCollapsed" class="truncate">Inicio Portal</span>
          </button>
          <button
            @click="handleNavigation('/dominios')"
            :class="[
              'w-full flex items-center rounded-lg text-xs font-medium text-neutral-400 hover:bg-neutral-900/60 hover:text-white transition-colors',
              isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-3 py-2',
              route.path === '/dominios' ? 'bg-neutral-900 text-white font-semibold' : ''
            ]"
            :title="isCollapsed ? 'Mis Sitios & Dominios' : undefined"
          >
            <i class="pi pi-globe text-xs text-neutral-400 shrink-0"></i>
            <span v-show="!isCollapsed" class="truncate">Mis Dominios</span>
          </button>
          <button
            @click="handleNavigation('/hostings')"
            :class="[
              'w-full flex items-center rounded-lg text-xs font-medium text-neutral-400 hover:bg-neutral-900/60 hover:text-white transition-colors',
              isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-3 py-2',
              route.path === '/hostings' ? 'bg-neutral-900 text-white font-semibold' : ''
            ]"
            :title="isCollapsed ? 'Mis Servicios de Hosting' : undefined"
          >
            <i class="pi pi-server text-xs text-neutral-400 shrink-0"></i>
            <span v-show="!isCollapsed" class="truncate">Mis Hostings</span>
          </button>
          <button
            @click="handleNavigation('/pagos')"
            :class="[
              'w-full flex items-center rounded-lg text-xs font-medium text-neutral-400 hover:bg-neutral-900/60 hover:text-white transition-colors',
              isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-3 py-2',
              route.path === '/pagos' ? 'bg-neutral-900 text-white font-semibold' : ''
            ]"
            :title="isCollapsed ? 'Mis Pagos & Facturas' : undefined"
          >
            <i class="pi pi-credit-card text-xs text-neutral-400 shrink-0"></i>
            <span v-show="!isCollapsed" class="truncate">Mis Pagos</span>
          </button>
          <button
            @click="handleNavigation('/solicitudes')"
            :class="[
              'w-full flex items-center rounded-lg text-xs font-medium text-neutral-400 hover:bg-neutral-900/60 hover:text-white transition-colors',
              isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-3 py-2',
              route.path === '/solicitudes' ? 'bg-neutral-900 text-white font-semibold' : ''
            ]"
            :title="isCollapsed ? 'Soporte & Tickets' : undefined"
          >
            <i class="pi pi-headphones text-xs text-neutral-400 shrink-0"></i>
            <span v-show="!isCollapsed" class="truncate">Soporte & Tickets</span>
          </button>
        </div>

        <!-- SECCIONES PARA ADMINISTRADORES / STAFF -->
        <template v-if="isSuperAdmin">
          <!-- Solicitudes de Agentes (Acceso Directo Admin) -->
          <div class="space-y-1">
            <button
              @click="handleNavigation('/solicitudes')"
              :class="[
                'w-full flex items-center rounded-lg text-xs font-medium transition-colors',
                isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-3 py-2',
                route.path === '/solicitudes' || route.path.startsWith('/solicitud')
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
              ]"
              :title="isCollapsed ? 'Solicitudes' : undefined"
            >
              <i class="pi pi-ticket text-xs text-neutral-400 shrink-0"></i>
              <span v-show="!isCollapsed" class="truncate">Solicitudes & Tickets</span>
            </button>
          </div>

          <!-- 1. MÓDULO: CONSULTAS (CRM Core) -->
          <div class="space-y-1">
            <button
              @click="toggleModule('consultas')"
              :class="[
                'w-full flex items-center rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors group',
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              ]"
              :title="isCollapsed ? 'Consultas' : undefined"
            >
              <div class="flex items-center space-x-2.5">
                <span class="w-5 h-5 rounded bg-neutral-900 text-neutral-400 flex items-center justify-center shrink-0">
                  <i class="pi pi-search text-[10px]"></i>
                </span>
                <span v-show="!isCollapsed" class="uppercase tracking-wider text-[9px] font-mono text-neutral-400">Consultas</span>
              </div>
              <i
                v-show="!isCollapsed"
                class="pi pi-chevron-down text-[9px] transition-transform duration-150 text-neutral-600 group-hover:text-neutral-400"
                :class="{ '-rotate-90': !openModules.consultas }"
              ></i>
            </button>

            <transition
              enter-active-class="transition-all duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-show="openModules.consultas && !isCollapsed" class="space-y-0.5 pl-3 pt-0.5 border-l border-neutral-900 ml-4">
                <button
                  @click="handleNavigation('/clientes')"
                  :class="[
                    'w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-colors',
                    route.path === '/clientes'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
                  ]"
                >
                  <span class="truncate">Clientes</span>
                </button>
                <button
                  @click="handleNavigation('/dominios')"
                  :class="[
                    'w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-colors',
                    route.path === '/dominios'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
                  ]"
                >
                  <span class="truncate">Dominios</span>
                </button>
                <button
                  @click="handleNavigation('/hostings')"
                  :class="[
                    'w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-colors',
                    route.path === '/hostings'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
                  ]"
                >
                  <span class="truncate">Hosting</span>
                </button>
                <button
                  @click="handleNavigation('/pagos')"
                  :class="[
                    'w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-colors',
                    route.path === '/pagos'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
                  ]"
                >
                  <span class="truncate">Pagos</span>
                </button>
              </div>
            </transition>
          </div>

          <!-- 2. MÓDULO: REGISTROS -->
          <div class="space-y-1">
            <button
              @click="toggleModule('registros')"
              :class="[
                'w-full flex items-center rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors group',
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              ]"
              :title="isCollapsed ? 'Registros' : undefined"
            >
              <div class="flex items-center space-x-2.5">
                <span class="w-5 h-5 rounded bg-neutral-900 text-neutral-400 flex items-center justify-center shrink-0">
                  <i class="pi pi-plus text-[10px]"></i>
                </span>
                <span v-show="!isCollapsed" class="uppercase tracking-wider text-[9px] font-mono text-neutral-400">Registros</span>
              </div>
              <i
                v-show="!isCollapsed"
                class="pi pi-chevron-down text-[9px] transition-transform duration-150 text-neutral-600 group-hover:text-neutral-400"
                :class="{ '-rotate-90': !openModules.registros }"
              ></i>
            </button>

            <transition
              enter-active-class="transition-all duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-show="openModules.registros && !isCollapsed" class="space-y-0.5 pl-3 pt-0.5 border-l border-neutral-900 ml-4">
                <button
                  @click="handleNavigation('/clientes/nuevo')"
                  :class="[
                    'w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-colors',
                    route.path === '/clientes/nuevo'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
                  ]"
                >
                  <span class="truncate">Nuevo Cliente</span>
                </button>
                <button
                  @click="handleNavigation('/dominios/nuevo')"
                  :class="[
                    'w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-colors',
                    route.path === '/dominios/nuevo'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
                  ]"
                >
                  <span class="truncate">Asignar Dominio</span>
                </button>
                <button
                  @click="handleNavigation('/hostings/nuevo')"
                  :class="[
                    'w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-colors',
                    route.path === '/hostings/nuevo'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
                  ]"
                >
                  <span class="truncate">Asignar Hosting</span>
                </button>
                <button
                  @click="handleNavigation('/pagos/nuevo')"
                  :class="[
                    'w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-colors',
                    route.path === '/pagos/nuevo' || route.path === '/registrar-pago'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
                  ]"
                >
                  <span class="truncate">Registrar Pago</span>
                </button>
              </div>
            </transition>
          </div>

          <!-- 3. MÓDULO: COMUNICACIÓN & CRM -->
          <div class="space-y-1">
            <button
              @click="toggleModule('comunicacion')"
              :class="[
                'w-full flex items-center rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors group',
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              ]"
              :title="isCollapsed ? 'Comunicación' : undefined"
            >
              <div class="flex items-center space-x-2.5">
                <span class="w-5 h-5 rounded bg-neutral-900 text-neutral-400 flex items-center justify-center shrink-0">
                  <i class="pi pi-send text-[10px]"></i>
                </span>
                <span v-show="!isCollapsed" class="uppercase tracking-wider text-[9px] font-mono text-neutral-400">Comunicación</span>
              </div>
              <i
                v-show="!isCollapsed"
                class="pi pi-chevron-down text-[9px] transition-transform duration-150 text-neutral-600 group-hover:text-neutral-400"
                :class="{ '-rotate-90': !openModules.comunicacion }"
              ></i>
            </button>

            <transition
              enter-active-class="transition-all duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-show="openModules.comunicacion && !isCollapsed" class="space-y-0.5 pl-3 pt-0.5 border-l border-neutral-900 ml-4">
                <button
                  @click="handleNavigation('/recordatorios')"
                  :class="[
                    'w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-colors',
                    route.path === '/recordatorios' || route.path.startsWith('/comunicacion')
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
                  ]"
                >
                  <span class="truncate">Recordatorios Correo</span>
                </button>
              </div>
            </transition>
          </div>
        </template>
      </div>

      <!-- Footer: Usuario Conectado & Logout -->
      <div class="p-2.5 border-t border-neutral-900 bg-[#09090b] shrink-0">
        <div
          :class="[
            'p-2 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center overflow-hidden',
            isCollapsed ? 'justify-center flex-col space-y-1' : 'justify-between space-x-2'
          ]"
        >
          <div class="flex items-center space-x-2 overflow-hidden">
            <div class="w-7 h-7 rounded bg-neutral-800 text-white font-medium flex items-center justify-center text-xs shrink-0">
              {{ (user?.nombre || user?.usuario || 'A').charAt(0).toUpperCase() }}
            </div>
            <div v-show="!isCollapsed" class="overflow-hidden">
              <div class="text-xs font-medium text-white truncate max-w-[110px]">{{ user?.nombre || user?.usuario }}</div>
              <div class="text-[10px] text-neutral-500 font-mono">En línea</div>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="w-6 h-6 rounded text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900 flex items-center justify-center transition-colors shrink-0"
            title="Cerrar sesión"
          >
            <i class="pi pi-sign-out text-[11px]"></i>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>
