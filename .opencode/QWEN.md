# Portal da Transparência MA — Hackathon 2026

Protótipo de portal de transparência cidadã para o Maranhão.
Objetivo: demonstrar que é possível construir uma alternativa ao portal oficial
mais acessível, mais rápida (≤ 3 cliques para qualquer dado) e mais segura.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Vue 3 — Composition API + `<script setup>` obrigatório |
| Build | Vite 8 |
| Estilização | Tailwind CSS v4 (`@tailwindcss/vite`) — mobile-first |
| UI | PrimeVue 4 + PrimeIcons (`pi pi-*`) |
| Estado | Pinia 3 |
| Roteamento | Vue Router 5 |
| Tipos | TypeScript — sem `any` |

## Estrutura

```
src/
├── assets/main.css          ← Tailwind + filtros de acessibilidade
├── components/
│   ├── AccessibilityBar.vue ← Componente independente e funcional
│   ├── AppHeader.vue        ← Usa AccessibilityBar
│   ├── HeroSearch.vue
│   ├── QuickAccessCards.vue
│   ├── TransparencyNumbers.vue
│   ├── MostAccessedServices.vue
│   └── AppFooter.vue
├── views/HomeView.vue
├── stores/
│   └── accessibility.ts     ← Font size + filtros visuais + VLibras
├── services/
│   └── portalApi.ts         ← USE_REAL_API flag + fallback mock
├── services/types/          ← Interfaces TypeScript por recurso
└── data/mock/               ← JSONs compatíveis com o formato da API real
```

## Regras obrigatórias

### Mobile-first
- Estilos base = mobile (320px). Breakpoints `sm:` `md:` `lg:` para expandir.
- Alvos de toque: `min-h-[44px]` em todo elemento interativo.
- Containers: `px-4 sm:px-6`. Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

### Acessibilidade (WCAG 2.1 AA / eMAG 3.1)
- Todo elemento interativo sem texto visível → `aria-label`.
- Ícones decorativos → `aria-hidden="true"`.
- Listas de links → `<nav aria-label="..."><ul>`.
- Formulários → `<label for="id">` vinculado ao input.
- `:focus-visible` já configurado globalmente no CSS.

### Linguagem cidadã (Thesaurus)
Substituições obrigatórias em toda interface voltada ao usuário:

| Técnico | Cidadão |
|---|---|
| Unidade Gestora / UG | Secretaria ou órgão responsável |
| Empenho | Compromisso de pagamento |
| Liquidação | Confirmação de entrega |
| Natureza da Receita | De onde vem o dinheiro |
| Extraorçamentário | Pagamento fora do orçamento |
| Modalidade licitatória | Como a compra foi feita |
| CNPJ do fornecedor | Empresa contratada |
| Subfunção | Área de atuação |

Consulte `.claude/desafio-hackathon/Thesaurus para o Hackathon da Transparência.xlsx`
antes de nomear qualquer label, placeholder, tooltip ou título de seção.

### API e dados
- `USE_REAL_API = false` em `src/services/portalApi.ts` — usar mocks.
- Único endpoint real funcionando: `/app/v2/despesas/fornecedoresContratantes?search=`.
- Todo retorno de fornecedor → `label.trim()` (CHAR padding do banco legado).
- Mocks em `src/data/mock/*.json` mantêm o mesmo formato de campos da API real.

### Componentes
- Props tipadas com `interface` — sem `any`, sem `as unknown`.
- Dados locais ficam no componente; compartilhados entre 2+ → mover para `stores/`.
- Sem comentários óbvios; apenas WHY não-óbvios.
- Sem `Options API` — sempre `<script setup>`.

### Commits
`feat:` `fix:` `refactor:` `a11y:` `perf:` `docs:`

## Acessibilidade implementada

`stores/accessibility.ts` + `components/AccessibilityBar.vue`:
- **A- / A+**: altera `html.style.fontSize` (14–22px em 5 níveis)
- **Escala de cinza**: `html.classList.add('a11y-grayscale')`
- **Alto contraste**: `html.classList.add('a11y-high-contrast')`
- **Inverter cores**: `html.classList.add('a11y-invert')`
- **VLibras**: controla `display` do widget `[vw]`
- **Persistência**: `localStorage` com chave `portal-a11y`

## Referências

- Protótipo visual: `.claude/desafio-hackathon/screencapture-uxpilot-ai-*.png`
- Dossiê de fragilidades: `.claude/desafio-hackathon/dossie_fragilidades_v2.md`
- Thesaurus: `.claude/desafio-hackathon/Thesaurus para o Hackathon da Transparência.xlsx`
- LAI: Lei nº 12.527/2011 + Decreto Federal nº 7.724/2012
- WCAG 2.1 AA / eMAG 3.1

## Responda sempre em português (pt-BR).
