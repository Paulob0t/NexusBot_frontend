<script setup lang="ts">
defineProps<{
  formData: {
    forma_pago?: number
    estatus?: number
    id_pago?: string
  }
}>()

const paymentMethods = [
  { id: 1, label: 'Transferencia / SPEI', icon: 'pi-building' },
  { id: 2, label: 'Efectivo / OXXO', icon: 'pi-wallet' },
  { id: 3, label: 'Tarjeta / Stripe', icon: 'pi-credit-card' },
  { id: 4, label: 'PayPal', icon: 'pi-paypal' },
]
</script>

<template>
  <div class="p-6 rounded-2xl bg-[#0c0c0e] border border-neutral-800/80 shadow-sm space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-neutral-800/80">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
          <i class="pi pi-credit-card text-xs"></i>
        </div>
        <div>
          <h2 class="text-sm font-semibold text-white">Método de Pago & Estatus</h2>
          <p class="text-[11px] text-neutral-400">Canal de recepción y acreditación del cobro</p>
        </div>
      </div>
    </div>

    <!-- Selección de Método de Pago -->
    <div>
      <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
        Forma de Pago
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          v-for="m in paymentMethods"
          :key="m.id"
          type="button"
          @click="formData.forma_pago = m.id"
          class="p-3 rounded-xl border text-left transition-all flex items-center space-x-2.5"
          :class="formData.forma_pago === m.id
            ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
            : 'bg-[#141417] border-neutral-800/80 text-neutral-400 hover:text-white'"
        >
          <i class="pi text-xs" :class="[m.icon, formData.forma_pago === m.id ? 'text-white' : 'text-neutral-500']"></i>
          <span class="text-xs font-medium">{{ m.label }}</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
      <!-- Estatus de Pago -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Estatus del Pago
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="formData.estatus = 0"
            class="py-2.5 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center space-x-2"
            :class="formData.estatus === 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-[#141417] border-neutral-800 text-neutral-400 hover:text-white'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Pendiente</span>
          </button>
          <button
            type="button"
            @click="formData.estatus = 1"
            class="py-2.5 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center space-x-2"
            :class="formData.estatus === 1
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-[#141417] border-neutral-800 text-neutral-400 hover:text-white'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Acreditado / Pagado</span>
          </button>
        </div>
      </div>

      <!-- Referencia / Folio de Transacción -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
          Referencia / Folio Bancario
        </label>
        <input
          v-model="formData.id_pago"
          type="text"
          placeholder="ej. SPEI-849204 o Folio Stripe"
          class="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
        />
      </div>
    </div>
  </div>
</template>
