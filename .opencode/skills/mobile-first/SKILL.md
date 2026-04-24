---
name: mobile-first
description: "Audita e corrige classes Tailwind para garantir mobile-first real. Ativa ao revisar componentes Vue existentes em busca de problemas de responsividade, ao criar layouts novos, ou ao mencionar mobile, responsivo, toque, 320px, breakpoint, grid ou flex."
---

# Mobile-First — Auditoria e Padrões

## Filosofia

**Base = 320px (mobile)**. Breakpoints adicionam comportamento para telas maiores.
Nunca criar estilo só para desktop e "consertar" para mobile depois.

---

## Checklist de auditoria (rode mentalmente em todo componente)

### ✅ Grids
```html
<!-- ❌ Sem base mobile -->
<div class="grid md:grid-cols-3 gap-4">

<!-- ✅ Mobile-first -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
```

### ✅ Padding e espaçamento
```html
<!-- ❌ Padding igual em todos os tamanhos -->
<section class="py-12 px-6">

<!-- ✅ Menor no mobile, cresce com a tela -->
<section class="py-6 px-4 sm:py-10 sm:px-6">
```

### ✅ Tipografia
```html
<!-- ❌ Tamanho único -->
<h1 class="text-3xl font-bold">

<!-- ✅ Escala com a tela -->
<h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
```

### ✅ Alvos de toque (WCAG 2.5.5)
Mínimo **44×44px** para qualquer elemento interativo.
```html
<!-- ❌ Botão pequeno -->
<button class="p-1">
  <i class="pi pi-close" />
</button>

<!-- ✅ Alvo adequado -->
<button class="min-h-[44px] min-w-[44px] flex items-center justify-center p-2">
  <i class="pi pi-times" aria-hidden="true" />
</button>
```

### ✅ Flex direction
```html
<!-- ❌ Sempre horizontal -->
<div class="flex gap-4">

<!-- ✅ Coluna no mobile, linha no desktop -->
<div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
```

### ✅ Visibilidade condicional
```html
<!-- Ocultar no mobile -->
<nav class="hidden md:flex">

<!-- Visível só no mobile -->
<div class="md:hidden">
```

### ✅ Overflow horizontal em listas
```html
<!-- Lista que pode ser longa no mobile -->
<nav class="flex items-center gap-1 overflow-x-auto scrollbar-none">
  <!-- scrollbar-none = scrollbar-width: none + webkit: none -->
</nav>
```

---

## Breakpoints do projeto

| Prefixo | Min-width | Dispositivo típico |
|---|---|---|
| (base) | 0px | Celular 320–639px |
| `sm:` | 640px | Tablet pequeno |
| `md:` | 768px | Tablet / desktop pequeno |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Desktop largo (raramente usado) |

---

## Padrões recorrentes do projeto

### Card de serviço (mobile: horizontal, desktop: vertical)
```html
<a class="flex items-start gap-4 p-4 sm:flex-col sm:p-5 rounded-xl bg-white border border-gray-100">
  <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
    <i class="pi pi-chart-bar text-blue-600 text-lg" aria-hidden="true" />
  </div>
  <div class="flex-1 min-w-0">
    <h3 class="font-semibold text-sm sm:text-base">Despesas</h3>
    <p class="text-xs text-gray-500 mt-0.5">Veja onde o dinheiro foi gasto.</p>
  </div>
</a>
```

### Grid de ícones (QuickAccessCards)
```html
<!-- 4 por linha no mobile (50px cada), 8 no desktop -->
<div class="grid grid-cols-4 sm:grid-cols-8 gap-1 sm:gap-2">
  <a class="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-xl min-h-[72px]">
    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center">
      <i class="pi pi-chart-bar text-blue-600 text-base sm:text-xl" aria-hidden="true" />
    </div>
    <span class="text-[10px] sm:text-xs font-semibold text-gray-700 leading-tight">Despesas</span>
  </a>
</div>
```

### Footer responsivo
```html
<!-- Mobile: 1 col → sm: 2 col → md: 3 col -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
```

---

## Container padrão

```css
/* src/assets/main.css */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-inline: 1rem;
}
@media (min-width: 640px) {
  .container { padding-inline: 1.5rem; }
}
```

**Nunca** usar `px-4` e `container` juntos — o container já tem padding.

---

## Como auditar um componente existente

1. Procurar `md:` ou `lg:` sem classe base correspondente → corrigir.
2. Procurar `grid-cols-` sem `grid-cols-1` base → adicionar.
3. Procurar elementos interativos sem `min-h-[44px]` → adicionar.
4. Procurar texto em `text-xs` que é conteúdo principal → elevar para `text-sm`.
5. Procurar `flex` sem `flex-col` como base em listas → adicionar `flex-col sm:flex-row`.
6. Procurar `py-12` ou `py-10` sem versão mobile menor → adicionar `py-6 sm:py-10`.

---

## Armadilhas

- `grid-cols-4 md:grid-cols-8`: em 320px cada célula tem 80px — testar se cabe.
- `text-[10px]` em mobile: aceito só para labels de ícones compactos (≤ 2 palavras).
- Scroll horizontal acidental: verificar se algum filho tem `min-width` fixo maior que o viewport.
- `gap-4` em mobile com muitos itens pode criar espaçamento excessivo — preferir `gap-3 sm:gap-4`.
