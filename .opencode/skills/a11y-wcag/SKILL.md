---
name: a11y-wcag
description: "Garante acessibilidade WCAG 2.1 AA e eMAG 3.1 em componentes Vue. Ativa ao criar ou revisar qualquer componente interativo, formulário, modal, ícone, ou ao mencionar acessibilidade, leitores de tela, NVDA, JAWS, VLibras, contraste, fonte, aria, role ou tabindex."
---

# Acessibilidade — WCAG 2.1 AA + eMAG 3.1

## Sistema de Acessibilidade Implementado

### Store (`src/stores/accessibility.ts`)
```typescript
const a11y = useAccessibilityStore()

a11y.increaseFontSize()   // A+ (até 22px)
a11y.decreaseFontSize()   // A- (mínimo 14px)
a11y.setFilter('grayscale')      // ou 'high-contrast' | 'invert' | 'none'
a11y.toggleVlibras()      // Ativa/oculta widget VLibras
a11y.reset()              // Volta tudo ao padrão
```

Persistência automática em `localStorage` (`portal-a11y`).

### Classes CSS de filtro (`src/assets/main.css`)
```css
html.a11y-grayscale    → filter: grayscale(100%)
html.a11y-high-contrast → fundo preto, texto branco, links amarelos
html.a11y-invert       → filter: invert(1) hue-rotate(180deg)
                         (imagens re-invertidas automaticamente)
```

---

## Checklists por tipo de elemento

### Botões
```html
<!-- Com texto visível -->
<button class="min-h-[44px] px-4 py-2">
  Buscar
</button>

<!-- Somente ícone -->
<button aria-label="Fechar menu" class="min-h-[44px] min-w-[44px]">
  <i class="pi pi-times" aria-hidden="true" />
</button>

<!-- Estado ativo (toggle) -->
<button
  :aria-pressed="isActive"
  class="..."
  @click="toggle"
>
  Alto Contraste
</button>
```

### Links de navegação
```html
<nav aria-label="Menu principal">
  <ul>
    <li>
      <a href="/despesas" aria-current="page">Despesas</a>
    </li>
  </ul>
</nav>
```

### Formulários
```html
<form @submit.prevent="buscar">
  <label for="campo-busca">
    Buscar no portal
    <span class="sr-only">(pressione Enter para buscar)</span>
  </label>
  <input
    id="campo-busca"
    v-model="query"
    type="search"
    autocomplete="off"
    :aria-describedby="erro ? 'erro-busca' : undefined"
  />
  <p v-if="erro" id="erro-busca" role="alert" class="text-red-600 text-sm">
    {{ erro }}
  </p>
</form>
```

### Tabelas de dados
```html
<table>
  <caption class="sr-only">Despesas do Estado — 2025</caption>
  <thead>
    <tr>
      <th scope="col">Secretaria</th>
      <th scope="col">Valor pago</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in despesas" :key="item.id">
      <td>{{ item.unidade_gestora }}</td>
      <td>{{ formatCurrency(item.valor_pago) }}</td>
    </tr>
  </tbody>
</table>
```

### Gráficos SVG
```html
<svg
  viewBox="0 0 100 100"
  role="img"
  aria-labelledby="grafico-titulo grafico-desc"
>
  <title id="grafico-titulo">Despesas por área — Abril 2025</title>
  <desc id="grafico-desc">
    Saúde 35%, Educação 28%, Segurança 20%, Infraestrutura 17%
  </desc>
  <!-- paths do gráfico -->
</svg>
```

### Live regions (atualizações dinâmicas)
```html
<!-- Contagem de resultados -->
<p aria-live="polite" aria-atomic="true" class="sr-only">
  {{ resultados.length }} resultados encontrados
</p>

<!-- Erros e alertas críticos -->
<div role="alert">
  Erro ao carregar dados. Tente novamente.
</div>
```

---

## Classes utilitárias de acessibilidade

```css
/* Visível apenas para leitores de tela */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border-width: 0;
}
```

No Tailwind: `class="sr-only"` (já incluído).

---

## Contraste mínimo WCAG AA

| Texto | Fundo | Ratio mínimo |
|---|---|---|
| Corpo (< 18pt) | Qualquer | 4.5:1 |
| Grande (≥ 18pt bold) | Qualquer | 3:1 |
| Componente UI (borda, ícone) | Adjacente | 3:1 |

Combinações do projeto:
- `#1a3a6e` sobre `#fff` → ✅ 9.8:1
- `#1a56db` sobre `#fff` → ✅ 5.2:1
- `text-gray-500` sobre `#fff` → ⚠️ 3.9:1 (apenas para texto de apoio)
- `text-gray-400` sobre `#fff` → ❌ 2.9:1 — **só para placeholder/decorativo**

---

## VLibras

Widget declarado em `index.html`. Controlado pela store de acessibilidade.
Quando `vlibrasActive = true`, o elemento `[vw]` recebe `display: block`.

```typescript
// Ativar VLibras
a11y.toggleVlibras()
```

O widget é inicializado via:
```javascript
// index.html
window.addEventListener('load', () => {
  new window.VLibras.Widget('https://vlibras.gov.br/app')
})
```

---

## Skip link

Implementado em `App.vue`:
```html
<a href="#main-content" class="skip-link">Ir para o conteúdo principal</a>
```

CSS em `main.css`:
```css
.skip-link {
  position: absolute;
  top: -100%;
  /* aparece ao focar com Tab */
}
.skip-link:focus { top: 0; }
```

O `<main id="main-content" tabindex="-1">` em cada view absorve o foco.

---

## Armadilhas comuns

- `aria-label` **não** substitui `<label>` em formulários — usar ambos.
- `role="button"` em `<div>` exige `tabindex="0"` e handler de teclado (`@keydown.enter`).
- `aria-hidden="true"` em containers com foco visível bloqueia o leitor de tela — aplicar apenas em elementos realmente decorativos.
- Animações: respeitar `prefers-reduced-motion` em transições longas.
- Nunca usar `color` como único indicador de estado — sempre combinar com texto ou ícone.
