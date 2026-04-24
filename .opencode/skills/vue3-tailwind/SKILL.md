---
name: vue3-tailwind
description: "Cria e edita componentes Vue 3 + Tailwind v4 + PrimeVue 4 do Portal da Transparência. Ativa ao trabalhar com .vue, stores Pinia, Vue Router, ou qualquer arquivo em src/. Inclui padrões de <script setup>, props tipadas, mobile-first com Tailwind e ícones PrimeIcons."
---

# Vue 3 + Tailwind v4 + PrimeVue 4 — Portal da Transparência MA

## Padrão de Componente

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  titulo: string
  valor?: number
}

const props = withDefaults(defineProps<Props>(), {
  valor: 0,
})

const emit = defineEmits<{
  selecionar: [id: string]
}>()
</script>

<template>
  <!-- Container mobile-first -->
  <div class="p-4 sm:p-6 rounded-xl bg-white shadow-sm border border-gray-100">
    <h2 class="text-base sm:text-lg font-semibold text-[#1a3a6e]">{{ props.titulo }}</h2>
  </div>
</template>
```

**Regras:**
- Sempre `<script setup lang="ts">` — nunca Options API.
- Sempre `interface` para props e emits — nunca `any`.
- Exportar tipos reutilizáveis para `src/services/types/`.

---

## Tailwind v4 — Mobile-First

### Breakpoints do projeto
| Prefixo | Largura | Uso |
|---|---|---|
| (base) | 0px+ | Mobile 320–639px |
| `sm:` | 640px+ | Tablet |
| `md:` | 768px+ | Tablet largo / desktop pequeno |
| `lg:` | 1024px+ | Desktop |

### Padrões obrigatórios

```html
<!-- Grid: 1 col mobile → 2 tablet → 3 desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

<!-- Padding responsivo -->
<section class="py-6 px-4 sm:py-10">

<!-- Texto responsivo -->
<h1 class="text-xl sm:text-2xl md:text-3xl font-bold">

<!-- Alvo de toque mínimo WCAG (44px) -->
<button class="min-h-[44px] px-4">

<!-- Flex que vira coluna no mobile -->
<div class="flex flex-col sm:flex-row gap-4">

<!-- Ocultar no mobile, mostrar no desktop -->
<nav class="hidden md:flex">
```

### Cores do projeto
```css
text-[#1a3a6e]   /* Azul governo MA */
text-[#c0392b]   /* Vermelho MA.GOV.BR */
text-blue-600    /* Azul interativo */
bg-blue-50       /* Fundo hover suave */
border-gray-100  /* Bordas de cards */
```

---

## PrimeIcons

Sempre usar classes `pi pi-*` — nunca SVG inline para ícones funcionais.

```html
<!-- Decorativo: aria-hidden obrigatório -->
<i class="pi pi-chart-bar text-blue-600 text-xl" aria-hidden="true" />

<!-- Funcional (dentro de botão sem texto visível): aria-label no botão -->
<button aria-label="Buscar despesas">
  <i class="pi pi-search" aria-hidden="true" />
</button>
```

Ícones mais usados no projeto:
- `pi-chart-bar` Despesas
- `pi-money-bill` Receitas
- `pi-users` Servidores
- `pi-file` Contratos
- `pi-search` Licitações / Busca
- `pi-building` Obras
- `pi-book` Legislação
- `pi-link` Convênios
- `pi-arrow-right` Navegação
- `pi-home` Início

---

## Pinia — Store

```typescript
// src/stores/exemplo.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExemploStore = defineStore('exemplo', () => {
  const items = ref<Item[]>([])
  const loading = ref(false)

  const total = computed(() => items.value.length)

  async function carregar() {
    loading.value = true
    try {
      const { data } = await getDespesas()
      items.value = data
    } finally {
      loading.value = false
    }
  }

  return { items, loading, total, carregar }
})
```

---

## Vue Router — Rota com lazy load

```typescript
// src/router/index.ts
{
  path: '/despesas',
  name: 'despesas',
  component: () => import('@/views/DespesasView.vue'),
  meta: { title: 'Despesas — Portal da Transparência' },
}
```

---

## Estados de carregamento e erro (padrão do projeto)

```vue
<template>
  <!-- Skeleton enquanto carrega -->
  <div v-if="loading" class="animate-pulse space-y-3">
    <div class="h-4 bg-gray-200 rounded w-3/4" />
    <div class="h-4 bg-gray-200 rounded w-1/2" />
  </div>

  <!-- Erro -->
  <div v-else-if="error" class="text-center py-8 text-gray-500">
    <i class="pi pi-exclamation-triangle text-3xl text-yellow-500 mb-2" aria-hidden="true" />
    <p class="text-sm">Não foi possível carregar os dados.</p>
    <button class="text-blue-600 text-sm hover:underline mt-2" @click="retry">Tentar novamente</button>
  </div>

  <!-- Vazio -->
  <div v-else-if="!items.length" class="text-center py-8 text-gray-400 text-sm">
    Nenhum resultado encontrado para os filtros selecionados.
  </div>

  <!-- Conteúdo -->
  <ul v-else>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
</template>
```

---

## Armadilhas comuns

- Nunca usar `Options API` — sempre `<script setup>`.
- Nunca importar PrimeVue components sem registro no `main.ts` ou auto-import.
- Nunca esquecer `aria-hidden="true"` em ícones decorativos.
- Nunca usar classes Tailwind sem base mobile (ex.: `md:grid-cols-3` sem `grid-cols-1`).
- Nunca usar `text-xs` em mobile para texto de conteúdo importante — mínimo `text-sm`.
