<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { clientesApi, type ClientePayload, type ClienteDetail } from '@/api/clientes'

import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppToast from '@/components/common/AppToast.vue'
import ClienteFormPersonalInfo from '@/components/clientes/ClienteFormPersonalInfo.vue'
import ClienteFormFiscal from '@/components/clientes/ClienteFormFiscal.vue'
import ClienteFormAddress from '@/components/clientes/ClienteFormAddress.vue'
import ClienteFormSecurity from '@/components/clientes/ClienteFormSecurity.vue'
import ClienteSuccessModal from '@/components/clientes/ClienteSuccessModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const isMobileSidebarOpen = ref(false)
const isSaving = ref(false)
const showSuccessModal = ref(false)
const createdClient = ref<ClienteDetail | null>(null)

// Campos del formulario
const formData = ref<ClientePayload & { nombre: string; apellido: string; contrasena: string; requiereFacturacion: boolean }>({
  nombre: '',
  apellido: '',
  nombre_contacto: '',
  empresa: '',
  correo: '',
  telefono: '',
  rfc: '',
  rsocial: '',
  especificacion: '',
  calle: '',
  next: '',
  nint: '',
  col: '',
  cp: '',
  pais: 'México',
  estado: '',
  ciudad: '',
  facturacion: 0,
  requiereFacturacion: false,
  contrasena: '',
})

function toggleFacturacion() {
  formData.value.requiereFacturacion = !formData.value.requiereFacturacion
  formData.value.facturacion = formData.value.requiereFacturacion ? 1 : 0
}

function generateSecurePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*'
  let pass = ''
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  formData.value.contrasena = pass
  showToast('Contraseña generada con éxito')
}

async function handleSubmit() {
  const fullNombre = [formData.value.nombre.trim(), formData.value.apellido.trim()].filter(Boolean).join(' ')
  formData.value.nombre_contacto = fullNombre || formData.value.nombre_contacto || formData.value.empresa

  if (!formData.value.empresa.trim() || !formData.value.nombre_contacto.trim()) {
    showToast('La empresa y el nombre de contacto son requeridos', 'error')
    return
  }

  if (formData.value.correo && !formData.value.correo.includes('@')) {
    showToast('Ingresa un correo electrónico válido', 'error')
    return
  }

  isSaving.value = true
  try {
    const payload: ClientePayload = {
      empresa: formData.value.empresa.trim(),
      nombre_contacto: formData.value.nombre_contacto.trim(),
      correo: formData.value.correo?.trim() || undefined,
      telefono: formData.value.telefono?.trim() || undefined,
      rfc: formData.value.rfc?.trim().toUpperCase() || undefined,
      rsocial: formData.value.rsocial?.trim() || undefined,
      especificacion: formData.value.especificacion?.trim() || undefined,
      calle: formData.value.calle?.trim() || undefined,
      next: formData.value.next?.trim() || undefined,
      nint: formData.value.nint?.trim() || undefined,
      col: formData.value.col?.trim() || undefined,
      cp: formData.value.cp?.trim() || undefined,
      pais: formData.value.pais || 'México',
      estado: formData.value.estado?.trim() || undefined,
      ciudad: formData.value.ciudad?.trim() || undefined,
      facturacion: formData.value.requiereFacturacion ? 1 : 0,
      contrasena: formData.value.contrasena?.trim() || undefined,
    }

    const res = await clientesApi.createCliente(payload)
    createdClient.value = res
    showToast(`Cliente "${res.empresa}" registrado exitosamente`)
    showSuccessModal.value = true
  } catch (err: any) {
    showToast(err.response?.data?.detail || 'Error al registrar cliente', 'error')
  } finally {
    isSaving.value = false
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="h-screen w-screen bg-[#09090b] text-neutral-100 selection:bg-neutral-800 selection:text-white flex overflow-hidden">
    <!-- MENÚ LATERAL -->
    <AppSidebar
      :is-mobile-open="isMobileSidebarOpen"
      @close-mobile="isMobileSidebarOpen = false"
    />

    <!-- CONTENEDOR PRINCIPAL -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-16">
      <!-- HEADER SUPERIOR -->
      <header class="sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur-md border-b border-neutral-800/80 h-16 shrink-0">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button
              @click="isMobileSidebarOpen = true"
              class="lg:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <i class="pi pi-bars text-sm"></i>
            </button>
            <button
              @click="router.push('/clientes')"
              class="p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
              title="Volver a lista de clientes"
            >
              <i class="pi pi-arrow-left text-xs"></i>
            </button>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-semibold text-neutral-100">Nuevo Cliente</span>
              <span class="text-neutral-700 hidden sm:inline">•</span>
              <span class="text-xs text-neutral-400 font-normal hidden sm:inline">Formulario de Registro</span>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button
              @click="handleLogout"
              class="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
              title="Cerrar sesión"
            >
              <i class="pi pi-sign-out text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- NOTIFICACIONES TOAST -->
      <AppToast />

      <!-- FORMULARIO PRINCIPAL -->
      <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full space-y-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 1. Información Personal -->
          <ClienteFormPersonalInfo
            :form-data="formData"
            @toggle-facturacion="toggleFacturacion"
          />

          <!-- 2. Datos Fiscales (si requiere facturación) -->
          <ClienteFormFiscal
            v-if="formData.requiereFacturacion"
            :form-data="formData"
          />

          <!-- 3. Domicilio -->
          <ClienteFormAddress
            :form-data="formData"
          />

          <!-- 4. Seguridad y Credenciales -->
          <ClienteFormSecurity
            :form-data="formData"
            @generate-password="generateSecurePassword"
          />

          <!-- BOTONES DE ACCIÓN -->
          <div class="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              @click="router.push('/clientes')"
              class="px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-6 py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <i v-if="isSaving" class="pi pi-spin pi-spinner text-xs"></i>
              <i v-else class="pi pi-check text-xs"></i>
              <span>{{ isSaving ? 'Registrando...' : 'Registrar Cliente' }}</span>
            </button>
          </div>
        </form>
      </main>
    </div>

    <!-- MODAL DE ÉXITO -->
    <ClienteSuccessModal
      :is-open="showSuccessModal"
      :client="createdClient"
      :raw-password="formData.contrasena"
      @close="showSuccessModal = false"
    />
  </div>
</template>
