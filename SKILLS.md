# SKILLS — Portal da Transparência MA (Hackathon)

> Guia de desenvolvimento contínuo para Claude Code e OpenCode (Qwen).
> Atualizado em: 24/04/2026

---

## 🏗️ Stack Técnica

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) | ^3.5 |
| Build | Vite | ^8.0 |
| Estilização | Tailwind CSS v4 (`@tailwindcss/vite`) | ^4.0 |
| Componentes UI | PrimeVue 4 + PrimeIcons | ^4.0 |
| Estado global | Pinia | ^3.0 |
| Roteamento | Vue Router | ^5.0 |
| Tipo-verificação | TypeScript + vue-tsc | ~6.0 |
| Lint | ESLint + oxlint | latest |
| Node mínimo | 20.19.0 / 22.12.0 | — |

---

## 📁 Estrutura do Projeto

```
src/
├── assets/
│   └── main.css               ← Tailwind + filtros a11y (grayscale, contrast, invert)
├── components/
│   ├── AccessibilityBar.vue   ← Componente independente e funcional (A±, filtros, VLibras)
│   ├── AppHeader.vue          ← Usa AccessibilityBar, skip link, menu mobile
│   ├── HeroSearch.vue         ← Busca inteligente + tags populares
│   ├── QuickAccessCards.vue   ← 8 cards de 1 clique (4 col mobile / 8 col desktop)
│   ├── TransparencyNumbers.vue← Donut + barras de área + card servidores
│   ├── MostAccessedServices.vue← 6 cards com ícone + texto + seta
│   └── AppFooter.vue          ← Rede Transparência + links + SETRANSP
├── views/
│   └── HomeView.vue           ← Composição: Header + Main (tabindex=-1) + Footer
├── router/
│   └── index.ts               ← Rota home com lazy load
├── stores/
│   ├── accessibility.ts       ← fontSize, filter, vlibrasActive — persiste localStorage
│   └── counter.ts             ← placeholder (remover)
├── services/
│   ├── portalApi.ts           ← USE_REAL_API flag + mock imports + trim() em fornecedores
│   └── types/
│       ├── despesas.ts        ← DespesaItem, DespesasResponse
│       ├── servidores.ts      ← ServidorItem, ServidoresResponse
│       ├── contratos.ts       ← ContratoItem, ContratosResponse
│       ├── receitas.ts        ← ReceitaItem, ReceitasResponse
│       └── fornecedor.ts      ← Fornecedor (formato real da API)
├── data/mock/
│   ├── despesas.json          ← por_funcao[] + data[] com nome_cidadao
│   ├── servidores.json        ← por_vinculo[] + data[] com nome_cidadao
│   ├── contratos.json         ← por_situacao[] + data[] com modalidade_cidadao
│   ├── receitas.json          ← por_natureza[] com nome_cidadao
│   └── fornecedores.json      ← [{id_value, label, doc}] — formato real da API
├── App.vue                    ← Skip link + init() da store de a11y + RouterView
└── main.ts                    ← PrimeVue (tema Aura) + Pinia + Router

index.html                     ← lang="pt-BR" + VLibras script + meta SEO
.opencode/                     ← Config OpenCode/Qwen (ver seção abaixo)
SKILLS.md                      ← este arquivo
TASKS.md                       ← próximas tarefas e backlog
```

---

## 🎨 Design System

### Paleta de Cores
```css
--color-gov-blue: #1a3a6e    /* Azul principal governo MA */
--color-gov-red:  #c0392b    /* Vermelho MA.GOV.BR */
--color-primary:  #1a56db    /* Azul interativo (links, botões) */
```

### Princípios Visuais
- **Cards**: `rounded-xl shadow-sm border border-gray-100 bg-white`
- **Hover**: sempre `transition-colors` ou `transition-all`
- **Ícones**: PrimeIcons `pi pi-*` — nunca SVGs inline para ícones funcionais
- **Tipografia**: Rawline (gov.br) → Inter → system-ui

### Mobile-First (obrigatório)
- Base CSS = 320px. `sm:` `md:` `lg:` só expandem.
- Alvos de toque: `min-h-[44px]` em todo elemento interativo.
- Containers: `px-4 sm:px-6`. Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- Ver skill `.opencode/skills/mobile-first/SKILL.md`.

---

## ♿ Acessibilidade Implementada

| Recurso | Implementação |
|---|---|
| Tamanho de fonte A±  | `html.style.fontSize` 14–22px (5 níveis) |
| Escala de cinza | `html.classList.add('a11y-grayscale')` |
| Alto contraste | `html.classList.add('a11y-high-contrast')` |
| Inverter cores | `html.classList.add('a11y-invert')` + imagens re-invertidas |
| VLibras | Widget `[vw]` controlado por `display` |
| Persistência | `localStorage` chave `portal-a11y` |
| Skip link | `<a href="#main-content">` em App.vue |
| aria-label | Todo interativo sem texto visível |
| aria-hidden | Todo ícone decorativo |
| aria-pressed | Botões de toggle na AccessibilityBar |
| aria-live | Live regions para atualizações dinâmicas |

---

## 📖 Glossário / Thesaurus

Arquivo: `.claude/desafio-hackathon/Thesaurus para o Hackathon da Transparência.xlsx`

**Regra de ouro:** se o cidadão precisar de formação em contabilidade para entender um rótulo, o rótulo está errado.

| Técnico | Cidadão |
|---|---|
| Natureza da Receita | De onde vem o dinheiro |
| Unidade Gestora (UG) | Secretaria ou órgão responsável |
| Empenho | Compromisso de pagamento |
| Liquidação | Confirmação de entrega do serviço |
| Extraorçamentário | Pagamento fora do orçamento anual |
| Subfunção | Área de atuação |
| CNPJ do fornecedor | Empresa contratada |
| Modalidade licitatória | Como a compra foi feita |
| Estatutário | Concursado (efetivo) |
| Comissionado | Cargo de confiança |

Ver skill `.opencode/skills/thesaurus/SKILL.md` para lista completa.

---

## 🔌 API do Portal

**O portal é PHP server-side rendered — não possui REST API.**
Dados chegam no HTML; não há endpoints JSON gerais funcionando.

| Endpoint | Status | Formato real |
|---|---|---|
| `/app/v2/despesas/fornecedoresContratantes?search=` | ✅ 200 | `[{id_value, label, doc}]` |
| `/app/v2/despesas?ano=` | ❌ 500/HTML | — |
| `/app/v2/receitas?ano=` | ❌ 500 | — |
| `/app/v2/big_numbers` | ❌ 500 | — |
| Todos os demais | ❌ 404/HTML | — |

**Gotchas:**
1. `label` de fornecedores vem com padding `CHAR(n)` → sempre `.trim()`
2. CORS aberto — não usar como argumento de segurança
3. Endpoint real leva ~3,6s → debounce 300ms no autocomplete

**Estratégia adotada:** `USE_REAL_API = false` em `portalApi.ts`.
Mocks em `src/data/mock/*.json` com estrutura idêntica ao que a API retornaria.

---

## 🤖 OpenCode / Qwen

Configuração em `.opencode/`:

| Arquivo | Função |
|---|---|
| `QWEN.md` | Contexto principal do projeto para o modelo |
| `settings.json` | Modelo padrão (`qwen3.6-plus`) + permissões de Bash |
| `skills/vue3-tailwind/` | Padrões Vue 3 + Tailwind v4 + PrimeVue |
| `skills/a11y-wcag/` | Acessibilidade WCAG 2.1 + eMAG 3.1 |
| `skills/mock-data/` | Serviços, tipos e mocks da API |
| `skills/thesaurus/` | Linguagem cidadã — substituições de jargão |
| `skills/mobile-first/` | Auditoria e padrões de responsividade |

**Modelos disponíveis (opencode-go):**
- `opencode-go/qwen3.6-plus` — padrão, tarefas complexas
- `opencode-go/qwen3.5-plus` — tarefas rápidas / revisões

---

## 🚦 Regras de Desenvolvimento

### Arquitetura ≤ 3 cliques (LAI)
1. Home → Card de categoria → Resultado com dado imediato
2. Resultado → Filtro opcional → Dado refinado

Nunca criar formulários com mais de 2 campos obrigatórios para acessar dados primários.

### Componentes
- Single Responsibility — componentes pequenos e focados
- Props tipadas com `interface` TypeScript — sem `any`
- Dados locais no componente → compartilhados entre 2+ → store Pinia
- Sem comentários óbvios; apenas WHY não-óbvios

### Commits
`feat:` `fix:` `refactor:` `a11y:` `perf:` `docs:`

---

## 🎯 Roadmap

### Fase 1 — MVP Home ✅
- [x] Tailwind v4 + PrimeVue 4 configurados
- [x] AccessibilityBar funcional (A±, filtros, VLibras, persistência)
- [x] AppHeader mobile-first com menu hamburguer
- [x] HeroSearch com busca + tags
- [x] QuickAccessCards (8 cards, 1 clique)
- [x] TransparencyNumbers (donut + barras + servidores)
- [x] MostAccessedServices (6 cards)
- [x] AppFooter completo
- [x] Skip link + WCAG base
- [x] VLibras integrado
- [x] Mocks JSON com tipos TypeScript
- [x] portalApi.ts com USE_REAL_API flag
- [x] OpenCode skills configuradas

### Fase 2 — Páginas de Detalhe (próxima)
Ver `TASKS.md` para detalhamento.

---

## 🔍 Referências

- Protótipo: `.claude/desafio-hackathon/screencapture-uxpilot-ai-*.png`
- Dossiê de fragilidades: `.claude/desafio-hackathon/dossie_fragilidades_v2.md`
- Thesaurus: `.claude/desafio-hackathon/Thesaurus para o Hackathon da Transparência.xlsx`
- Portal auditado: `transparencia.ma.gov.br`
- LAI: Lei nº 12.527/2011 + Decreto nº 7.724/2012
- WCAG 2.1 AA / eMAG 3.1
