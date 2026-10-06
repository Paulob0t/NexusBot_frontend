<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const credentials = reactive({
  usuario: '',
  contrasena: ''
})

const rememberMe = ref(true)
const showPassword = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)

async function handleLogin() {
  if (!credentials.usuario.trim()) {
    errorMessage.value = 'Por favor ingresa tu usuario o correo electrónico'
    return
  }
  if (!credentials.contrasena) {
    errorMessage.value = 'Por favor ingresa tu contraseña'
    return
  }

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const redirectUrl = await authStore.login({
      usuario: credentials.usuario.trim(),
      contrasena: credentials.contrasena
    })

    const returnTo = (route.query.redirect as string) || redirectUrl || '/dashboard'
    router.push(returnTo)
  } catch (err: any) {
    errorMessage.value = err.message || 'Credenciales de acceso no válidas'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex flex-col lg:flex-row bg-[#09090b] text-neutral-200 font-sans selection:bg-neutral-700 selection:text-white relative">
    
    <!-- SECCIÓN IZQUIERDA: HERO EDITORIAL & ESTADO (Desktop) -->
    <div class="hidden lg:flex lg:w-7/12 flex-col justify-between p-12 xl:p-20 relative z-10 border-r border-neutral-900 bg-[#0c0c0e]">
      
      <!-- Encabezado / Identidad de Marca -->
      <div class="space-y-6">
        <div class="flex items-center space-x-3.5">
          <div class="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <i class="pi pi-shield text-lg text-neutral-200"></i>
          </div>
          <div>
            <span class="text-xl font-semibold tracking-tight text-white">
              NEXUSBOT <span class="text-neutral-500 font-normal">CRM</span>
            </span>
            <span class="block text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
              Core Enterprise Platform
            </span>
          </div>
        </div>

        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>SISTEMA OPERACIONAL • EN LÍNEA</span>
        </div>
      </div>

      <!-- Centro: Mensaje sobrio y métricas -->
      <div class="space-y-10 my-auto py-8 max-w-xl">
        <div class="space-y-4">
          <h1 class="text-3xl xl:text-4xl font-medium tracking-tight text-white leading-snug">
            Infraestructura, gestión de clientes y servicios en un solo entorno centralizado.
          </h1>
          <p class="text-neutral-400 text-sm xl:text-base leading-relaxed font-normal">
            Plataforma segura de alto rendimiento para la administración integral de activos cloud, carteras de clientes, dominios, servidores y soporte técnico.
          </p>
        </div>

        <!-- Métricas Hairline en Blanco y Negro -->
        <div class="grid grid-cols-3 gap-3 pt-2">
          <div class="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
            <div class="text-xl font-semibold text-white tracking-tight font-mono">99.98%</div>
            <div class="text-[11px] text-neutral-500 font-medium mt-1">Disponibilidad</div>
          </div>
          <div class="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
            <div class="text-xl font-semibold text-neutral-200 tracking-tight font-mono">&lt; 15ms</div>
            <div class="text-[11px] text-neutral-500 font-medium mt-1">Latencia API</div>
          </div>
          <div class="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
            <div class="text-xl font-semibold text-neutral-200 tracking-tight font-mono">JWT / 256</div>
            <div class="text-[11px] text-neutral-500 font-medium mt-1">Cifrado de Sesión</div>
          </div>
        </div>

        <!-- Módulo de Estado del Sistema -->
        <div class="p-4 rounded-lg bg-neutral-900/40 border border-neutral-800 flex items-center space-x-3.5">
          <div class="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-300 shrink-0">
            <i class="pi pi-server text-sm"></i>
          </div>
          <div class="text-xs">
            <div class="font-medium text-neutral-200">Base de Datos PostgreSQL</div>
            <div class="text-neutral-500">Conexión activa con contenedor local en Podman.</div>
          </div>
        </div>
      </div>

      <!-- Pie de página izquierdo -->
      <div class="flex items-center justify-between text-xs text-neutral-600 pt-6 border-t border-neutral-900">
        <span>© 2026 NexusBot CRM. Todos los derechos reservados.</span>
        <span class="flex items-center space-x-1.5 text-neutral-500">
          <i class="pi pi-lock text-[11px]"></i>
          <span>Ambiente Seguro</span>
        </span>
      </div>
    </div>

    <!-- SECCIÓN DERECHA: FORMULARIO SOBRIO Y ELEGANTE -->
    <div class="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-20 relative z-10 bg-[#09090b]">
      <div class="w-full max-w-sm space-y-8">
        
        <!-- Logo en versión Móvil -->
        <div class="lg:hidden flex items-center space-x-3 mb-6">
          <div class="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <i class="pi pi-shield text-base text-neutral-200"></i>
          </div>
          <div>
            <span class="text-lg font-semibold text-white">NEXUSBOT</span>
            <span class="block text-[10px] font-mono text-neutral-500">CRM SUITE</span>
          </div>
        </div>

        <!-- Encabezado del Formulario -->
        <div class="space-y-2">
          <div class="inline-flex items-center px-2.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] font-mono uppercase tracking-wider">
            Portal de Autenticación
          </div>
          <h2 class="text-2xl font-semibold text-white tracking-tight">
            Iniciar Sesión
          </h2>
          <p class="text-neutral-400 text-xs sm:text-sm">
            Ingresa tus credenciales autorizadas para acceder.
          </p>
        </div>

        <!-- Alerta de Error Sobria -->
        <transition name="fade">
          <div v-if="errorMessage" class="p-3.5 rounded-lg bg-neutral-900 border border-red-900/60 text-red-400 text-xs flex items-start space-x-3">
            <i class="pi pi-info-circle text-sm text-red-400 shrink-0 mt-0.5"></i>
            <div class="flex-1 leading-relaxed">{{ errorMessage }}</div>
            <button @click="errorMessage = ''" class="text-neutral-500 hover:text-neutral-300">
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>
        </transition>

        <!-- Formulario de Acceso -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          
          <!-- Campo: Usuario / Correo -->
          <div class="space-y-1.5">
            <label for="usuario" class="block text-xs font-medium text-neutral-400">
              Usuario o Correo
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <i class="pi pi-user text-xs"></i>
              </span>
              <input
                id="usuario"
                v-model="credentials.usuario"
                type="text"
                placeholder="nombre_usuario"
                autocomplete="username"
                autofocus
                :disabled="isSubmitting"
                class="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 text-white placeholder-neutral-600 rounded-lg border border-neutral-800 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/20 text-sm transition duration-150 outline-none hover:border-neutral-700 disabled:opacity-50"
              />
            </div>
          </div>

          <!-- Campo: Contraseña (Personalizado y 100% integrado al tema oscuro) -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="contrasena" class="block text-xs font-medium text-neutral-400">
                Contraseña
              </label>
            </div>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <i class="pi pi-lock text-xs"></i>
              </span>
              <input
                id="contrasena"
                v-model="credentials.contrasena"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••••••"
                :disabled="isSubmitting"
                autocomplete="current-password"
                class="w-full pl-9 pr-10 py-2.5 bg-neutral-950 text-white placeholder-neutral-600 rounded-lg border border-neutral-800 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/20 text-sm transition duration-150 outline-none hover:border-neutral-700 disabled:opacity-50"
              />
              <button
                type="button"
                tabindex="-1"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Opciones adicionales -->
          <div class="flex items-center justify-between text-xs pt-1">
            <label class="flex items-center space-x-2 cursor-pointer select-none text-neutral-400 hover:text-neutral-300">
              <input
                type="checkbox"
                v-model="rememberMe"
                class="w-3.5 h-3.5 rounded bg-neutral-950 border-neutral-800 text-neutral-200 focus:ring-0 focus:ring-offset-0"
              />
              <span>Recordar sesión</span>
            </label>
            <span class="text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors">
              Recuperar contraseña
            </span>
          </div>

          <!-- Botón de Entrada: Minimalista y Elegante en contraste monocromático -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full mt-2 py-2.5 px-4 rounded-lg font-medium text-sm text-neutral-950 bg-neutral-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner text-sm"></i>
            <span v-else class="flex items-center space-x-1.5">
              <span>Continuar</span>
              <i class="pi pi-arrow-right text-xs"></i>
            </span>
          </button>
        </form>

        <!-- Pie del Formulario -->
        <div class="pt-6 border-t border-neutral-900 text-center">
          <p class="text-[11px] text-neutral-600">
            Conexión encriptada vía TLS / Tokens JWT Bearer (HS256)
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
