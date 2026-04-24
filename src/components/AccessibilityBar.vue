<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAccessibilityStore, type FilterMode } from '@/stores/accessibility'

const a11y = useAccessibilityStore()

onMounted(() => a11y.init())

const canIncrease = computed(() => a11y.fontIndex < 4)
const canDecrease = computed(() => a11y.fontIndex > 0)

interface Action {
  id: string
  label: string
  shortLabel: string
  icon: string
  active?: boolean
  disabled?: boolean
  action: () => void
}

const actions = computed<Action[]>(() => [
  {
    id: 'decrease-font',
    label: 'Diminuir fonte',
    shortLabel: 'A-',
    icon: 'pi pi-minus',
    disabled: !canDecrease.value,
    action: () => a11y.decreaseFontSize(),
  },
  {
    id: 'increase-font',
    label: 'Aumentar fonte',
    shortLabel: 'A+',
    icon: 'pi pi-plus',
    disabled: !canIncrease.value,
    action: () => a11y.increaseFontSize(),
  },
  {
    id: 'grayscale',
    label: 'Escala de cinza',
    shortLabel: 'Cinza',
    icon: 'pi pi-circle',
    active: a11y.filter === 'grayscale',
    action: () => a11y.setFilter('grayscale' as FilterMode),
  },
  {
    id: 'high-contrast',
    label: 'Alto contraste',
    shortLabel: 'Contraste',
    icon: 'pi pi-eye',
    active: a11y.filter === 'high-contrast',
    action: () => a11y.setFilter('high-contrast' as FilterMode),
  },
  {
    id: 'invert',
    label: 'Inverter cores',
    shortLabel: 'Inverter',
    icon: 'pi pi-palette',
    active: a11y.filter === 'invert',
    action: () => a11y.setFilter('invert' as FilterMode),
  },
  {
    id: 'vlibras',
    label: 'Libras (VLibras)',
    shortLabel: 'Libras',
    icon: 'pi pi-volume-up',
    active: a11y.vlibrasActive,
    action: () => a11y.toggleVlibras(),
  },
  {
    id: 'reset',
    label: 'Redefinir acessibilidade',
    shortLabel: 'Redefinir',
    icon: 'pi pi-refresh',
    action: () => a11y.reset(),
  },
])
</script>

<template>
  <div
    class="bg-[#1a3a6e] text-white"
    role="region"
    aria-label="Recursos de acessibilidade"
  >
    <div class="container">
      <!-- Scrollável horizontalmente no mobile, linha única no desktop -->
      <nav
        class="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none"
        aria-label="Opções de acessibilidade"
      >
        <button
          v-for="action in actions"
          :key="action.id"
          :aria-label="action.label"
          :aria-pressed="action.active"
          :disabled="action.disabled"
          class="flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-1.5 text-xs font-medium transition-colors flex-shrink-0
                 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white
                 disabled:opacity-40 disabled:cursor-not-allowed"
          :class="action.active ? 'bg-white/20 ring-1 ring-white/50' : ''"
          @click="action.action()"
        >
          <!-- No mobile: só ícone + label curta. No md+: label completa -->
          <span
            class="inline-flex items-center justify-center w-4 h-4 font-bold text-[11px] leading-none"
            aria-hidden="true"
          >
            <!-- A- e A+ usam texto para melhor clareza visual -->
            <template v-if="action.id === 'decrease-font'">A<sup>-</sup></template>
            <template v-else-if="action.id === 'increase-font'">A<sup>+</sup></template>
            <i v-else :class="action.icon" class="text-[11px]" />
          </span>
          <span class="hidden sm:inline">{{ action.label }}</span>
          <span class="sm:hidden">{{ action.shortLabel }}</span>
        </button>

        <!-- Indicador do tamanho de fonte atual -->
        <span
          class="ml-auto flex-shrink-0 text-[10px] text-blue-300 hidden sm:block"
          aria-live="polite"
          aria-atomic="true"
        >
          Fonte: {{ [14, 16, 18, 20, 22][a11y.fontIndex] }}px
        </span>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-none {
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
