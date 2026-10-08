<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { clientesApi, type ClienteListItem } from '@/api/clientes'

const props = defineProps<{
  modelValue: number | null
  selectedClientFacturacion?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'client-selected', client: ClienteListItem): void
}>()

const clients = ref<ClienteListItem[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const isDropdownOpen = ref(false)

async function fetchClients() {
  isLoading.value = true
  try {
    const res = await clientesApi.getClientes({ limit: 100, filtro: 'activos' })
    clients.value = res.items
  } catch {
    clients.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchClients()
})

const selectedClient = computed(() => {
  if (!props.modelValue) return null
  return clients.value.find(c => c.id === props.modelValue) || null
})

const filteredClients = computed(() => {
  if (!searchQuery.value.trim()) return clients.value
  const q = searchQuery.value.toLowerCase().trim()
  return clients.value.filter(c =>
    c.empresa?.toLowerCase().includes(q) ||
    c.nombre_contacto?.toLowerCase().includes(q) ||
    c.correo?.toLowerCase().includes(q) ||
    String(c.id).includes(q)
  )
})

function selectClient(client: ClienteListItem) {
  emit('update:modelValue', client.id)
  emit('client-selected', client)
  isDropdownOpen.value = false
  searchQuery.value = ''
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-user text-xs"></i>
        </div>
        <div>
          <h2 class="text-sm font-semibold text-white">Cliente Titular</h2>
          <p class="text-[11px] text-neutral-400 font-sans">Selecciona el cliente al que se le asignará el dominio</p>
        </div>
      </div>
      <span v-if="selectedClient?.facturacion === 1" class="px-2.5 py-1 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-700 text-[10px] font-mono">
        Factura (+16% IVA)
      </span>
    </div>

    <!-- Buscador / Dropdown personalizado -->
    <div class="relative">
      <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
        Cliente Asignado <span class="text-rose-400">*</span>
      </label>

      <!-- Botón de apertura / estado actual -->
      <button
        type="button"
        @click="isDropdownOpen = !isDropdownOpen"
        class="w-full px-4 py-3 rounded-xl bg-[#141417] border border-neutral-800 hover:border-neutral-700 text-left flex items-center justify-between transition-all focus:outline-none focus:border-neutral-600"
      >
        <div v-if="selectedClient" class="flex items-center space-x-3 min-w-0">
          <div class="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center text-[11px] font-mono font-bold shrink-0">
            #{{ selectedClient.id }}
          </div>
          <div class="min-w-0">
            <span class="block text-xs font-semibold text-white truncate">{{ selectedClient.empresa }}</span>
            <span class="block text-[11px] text-neutral-400 truncate">{{ selectedClient.nombre_contacto }} • {{ selectedClient.correo || 'Sin correo' }}</span>
          </div>
        </div>
        <div v-else class="text-xs text-neutral-500 flex items-center space-x-2">
          <i class="pi pi-search text-xs"></i>
          <span>{{ isLoading ? 'Cargando directorio de clientes...' : 'Haz clic para seleccionar o buscar un cliente...' }}</span>
        </div>
        <i class="pi text-xs text-neutral-400 transition-transform" :class="isDropdownOpen ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
      </button>

      <!-- Panel desplegable -->
      <div
        v-if="isDropdownOpen"
        class="absolute left-0 right-0 top-full mt-2 z-40 bg-[#141417] border border-neutral-700/90 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn"
      >
        <div class="p-3 border-b border-neutral-800 bg-[#0c0c0e]">
          <div class="relative">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por empresa, contacto, ID o correo..."
              class="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
              autofocus
            />
          </div>
        </div>

        <div class="max-h-60 overflow-y-auto divide-y divide-neutral-800/60 scrollbar-thin">
          <div
            v-for="c in filteredClients"
            :key="c.id"
            @click="selectClient(c)"
            class="p-3 hover:bg-neutral-800/60 cursor-pointer flex items-center justify-between transition-colors"
            :class="selectedClient?.id === c.id ? 'bg-neutral-800/40' : ''"
          >
            <div class="min-w-0 pr-3">
              <div class="flex items-center space-x-2">
                <span class="text-xs font-semibold text-white truncate">{{ c.empresa }}</span>
                <span class="text-[10px] text-neutral-500 font-mono">#{{ c.id }}</span>
              </div>
              <p class="text-[11px] text-neutral-400 truncate">{{ c.nombre_contacto }} • {{ c.correo || 'Sin correo' }}</p>
            </div>
            <span v-if="c.facturacion === 1" class="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 shrink-0 font-mono">
              IVA
            </span>
          </div>

          <div v-if="filteredClients.length === 0" class="p-4 text-center text-xs text-neutral-500">
            No se encontraron clientes activos con ese criterio
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
