# SKILLS — Portal da Transparência MA (Hackathon)

> Guia de desenvolvimento contínuo para a equipe e para o Claude Code.
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
│   └── main.css          ← Tailwind @import + variáveis de tema
├── components/
│   ├── AppHeader.vue     ← Barra de acessibilidade + logo + nav principal
│   ├── HeroSearch.vue    ← Campo de busca inteligente + tags populares
│   ├── QuickAccessCards.vue ← 8 cards de acesso rápido (1 clique → dado)
│   ├── TransparencyNumbers.vue ← Gráficos de despesas, áreas, servidores
│   ├── MostAccessedServices.vue ← Grid de 6 serviços mais acessados
│   └── AppFooter.vue     ← Rede de Transparência + links + info SETRANSP
├── views/
│   └── HomeView.vue      ← Composição da página inicial
├── router/
│   └── index.ts          ← Rotas da aplicação
├── stores/               ← Stores Pinia (dados, filtros, busca)
├── App.vue               ← Root: <RouterView />
└── main.ts               ← Bootstrap: PrimeVue + Pinia + Router
```

---

## 🎨 Design System

### Paleta de Cores (Tailwind custom)
```css
--color-gov-blue: #1a3a6e    /* Azul principal do governo MA */
--color-gov-red:  #c0392b    /* Vermelho MA.GOV.BR */
--color-primary:  #1a56db    /* Azul interativo (links, botões) */
```

### Princípios Visuais
- **Cards** com `rounded-xl`, `shadow-sm`, `border border-gray-100`
- **Hover** sempre com `transition-colors` ou `transition-all`
- **Ícones** via PrimeIcons (`pi pi-*`) — nunca imagens para ícones funcionais
- **Tipografia**: Rawline (gov.br) → fallback Inter → system-ui

### Acessibilidade (obrigatório por LAI e WCAG 2.1)
- Todo elemento interativo tem `aria-label` descritivo
- Ícones decorativos levam `aria-hidden="true"`
- Skip link `#main-content` implementado (via tabindex no `<main>`)
- Contraste mínimo AA em todos os textos
- Formulários com `<label>` vinculado via `for`/`id`

---

## 📖 Glossário (Thesaurus Hackathon)

O arquivo `.claude/desafio-hackathon/Thesaurus para o Hackathon da Transparência.xlsx`
contém os **termos técnicos do portal oficial** e suas equivalências em **linguagem cidadã**.

**Regra de ouro:** toda interface voltada ao usuário final usa a linguagem cidadã.
A linguagem técnica fica restrita a filtros avançados e documentação interna.

### Exemplos de substituição obrigatória

| Termo técnico (portal atual) | Linguagem cidadã (nosso protótipo) |
|---|---|
| Natureza da Receita | De onde vem o dinheiro |
| Unidade Gestora (UG) | Secretaria / Órgão responsável |
| Empenho | Compromisso de pagamento |
| Liquidação | Confirmação de entrega do serviço |
| Extraorçamentário | Pagamentos fora do orçamento anual |
| Subfunção | Área de atuação |
| CNPJ do fornecedor | Empresa contratada |
| Modalidade licitatória | Como a compra foi feita |

> Consulte sempre o Thesaurus antes de nomear labels, placeholders, tooltips e títulos de seção.

---

## 🔌 API do Portal (Endpoints Funcionais)

Base URL: `https://transparencia.ma.gov.br`

| Endpoint | Status | Uso |
|---|---|---|
| `/app/v2/despesas/fornecedoresContratantes?search={termo}` | ✅ 200 | Autocomplete de fornecedores |
| `/app/v2/despesas?ano={ano}` | ⚠️ testar | Listagem de despesas |
| `/app/v2/despesas/exportar?tipo=csv&ano={ano}` | ❌ 500 | **QUEBRADO** — não usar |
| `/app/v2/receitas/unidades?search=` | ❌ 404 | **INATIVO** |
| `/app/v2/remuneracao/exportar` | ❌ 404 | **INATIVO** |
| `dados.ma.gov.br/api/action/datastore_search` | ⚠️ instável | CKAN — retorna JSON inválido às vezes |

### Gotchas críticos da API
1. **Trim obrigatório**: nomes de fornecedores retornam com padding `CHAR(n)` — sempre `label.trim()`
2. **CORS aberto**: sem headers de restrição — não depender de segurança via CORS
3. **Lentidão**: autocomplete leva ~3,6s — implementar debounce de 300ms + skeleton

---

## 🚦 Regras de Desenvolvimento

### Arquitetura ≤ 3 cliques (LAI)
Todo dado primário deve ser acessível a partir da home em **no máximo 3 cliques**:
1. Home → Card de categoria → Resultado com dado imediato
2. Resultado → Filtro opcional → Dado refinado

**Nunca** criar formulários com mais de 2 campos obrigatórios para acessar dados primários.

### Componentes
- Prefira componentes pequenos e focados (Single Responsibility)
- Props tipadas com `interface` TypeScript — sem `any`
- Dados mockados ficam no próprio componente enquanto a API real não está integrada
- Separe dados/lógica em `stores/` quando compartilhados entre 2+ componentes

### Commits
Convenção: `feat:`, `fix:`, `refactor:`, `a11y:`, `perf:`, `docs:`

---

## 🎯 Roadmap de Desenvolvimento

### Fase 1 — MVP Home (atual)
- [x] Setup Tailwind v4 + PrimeVue 4
- [x] AppHeader com acessibilidade
- [x] HeroSearch com busca + tags populares
- [x] QuickAccessCards (8 categorias, 1 clique)
- [x] TransparencyNumbers (gráficos mock)
- [x] MostAccessedServices
- [x] AppFooter completo

### Fase 2 — Integração de Dados
- [ ] Store `usePortalApi` com chamadas reais à API MA
- [ ] Debounce + skeleton no autocomplete de fornecedores
- [ ] Gráfico de pizza real com dados do mês atual
- [ ] Barras de investimento com dados reais por área

### Fase 3 — Páginas de Detalhe
- [ ] `/despesas` — Tabela com filtros simplificados (linguagem cidadã)
- [ ] `/servidores` — Busca por nome/cargo com salário visível
- [ ] `/contratos` — Lista de contratos ativos com valores
- [ ] `/obras` — Mapa interativo por município

### Fase 4 — Polimento
- [ ] Dark mode (`.dark` class)
- [ ] PWA / offline básico
- [ ] Testes de acessibilidade automatizados (axe-core)
- [ ] Performance: lazy load de rotas + imagens

---

## 🔍 Referências

- Protótipo visual: `.claude/desafio-hackathon/screencapture-uxpilot-ai-*.png`
- Dossiê de fragilidades: `.claude/desafio-hackathon/dossie_fragilidades_v2.md`
- Thesaurus: `.claude/desafio-hackathon/Thesaurus para o Hackathon da Transparência.xlsx`
- Portal oficial auditado: `transparencia.ma.gov.br`
- LAI: Lei nº 12.527/2011 + Decreto Federal nº 7.724/2012
- WCAG 2.1 AA (obrigatório por eMAG 3.1)
