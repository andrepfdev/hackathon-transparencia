# TASKS — Portal da Transparência MA (Hackathon)

> Próximas tarefas de desenvolvimento, organizadas por prioridade e fase.
> Atualizado em: 24/04/2026

---

## 🔥 Fase 2 — Páginas de Detalhe (MVP)

### 2.1 · DespesasView — Página de Despesas

**Mock:** `src/data/mock/despesas.json`
**Serviço:** `getDespesas(ano?)` → `DespesasResponse`

**Campos disponíveis no mock:**
- `resumo.total_empenhado`, `total_liquidado`, `total_pago`
- `por_funcao[]` → `{ nome_cidadao, valor_pago, percentual }` → gráfico de barras
- `data[]` → tabela paginada com filtros

**Tarefas:**
- [ ] Criar `src/views/DespesasView.vue` com `<main id="main-content" tabindex="-1">`
- [ ] Adicionar rota `/despesas` em `src/router/index.ts` (lazy load)
- [ ] Cards de resumo: "Total comprometido", "Total confirmado", "Total pago" (linguagem cidadã)
- [ ] Gráfico de barras horizontais por função (`por_funcao[]`) — SVG puro ou PrimeVue Chart
- [ ] Tabela paginada com colunas: Secretaria, Empresa contratada, Área, Tipo de gasto, Valor pago, Status
- [ ] Badges de status com linguagem cidadã: `Pago` / `Comprometido` / `Serviço confirmado`
- [ ] Filtro por área (funcao), ano e situação
- [ ] Loading skeleton + estado de erro + estado vazio
- [ ] `<caption class="sr-only">` na tabela, `scope="col"` nos cabeçalhos
- [ ] Botão "Baixar dados completos (CSV)" (mock: `disabled` com tooltip explicativo)

---

### 2.2 · ServidoresView — Página de Servidores

**Mock:** `src/data/mock/servidores.json`
**Serviço:** `getServidores(ano?)` → `ServidoresResponse`

**Campos disponíveis no mock:**
- `resumo.total_servidores`
- `resumo.por_vinculo[]` → `{ nome_cidadao, quantidade, percentual }` → gráfico de rosca
- `data[]` → tabela com nome, local de trabalho, cargo, tipo de vínculo, salário bruto/líquido

**Tarefas:**
- [ ] Criar `src/views/ServidoresView.vue`
- [ ] Adicionar rota `/servidores`
- [ ] Card de total: "84.500 servidores públicos ativos"
- [ ] Gráfico de rosca (donut) por tipo de vínculo (`por_vinculo[]`) — reutilizar lógica do `TransparencyNumbers.vue`
- [ ] Legenda com: Concursado (efetivo), Cargo de confiança, Contrato temporário
- [ ] Tabela: Nome, Local de trabalho, Cargo, Tipo de vínculo, Salário bruto, Salário recebido
- [ ] Filtro por secretaria, vínculo e faixa salarial
- [ ] Nunca exibir CPF completo — mascarar como `***.123.456-**`
- [ ] Loading skeleton + estados de erro/vazio
- [ ] Acessibilidade: `aria-sort` nas colunas ordenáveis

---

### 2.3 · ContratosView — Página de Contratos

**Mock:** `src/data/mock/contratos.json`
**Serviço:** `getContratos(ano?)` → `ContratosResponse`

**Campos disponíveis no mock:**
- `resumo.total_valor`, `por_situacao[]`
- `data[]` → `{ objeto_cidadao, secretaria, empresa, modalidade_cidadao, valor, vigencia_inicio, vigencia_fim, situacao }`

**Tarefas:**
- [ ] Criar `src/views/ContratosView.vue`
- [ ] Adicionar rota `/contratos`
- [ ] Cards: "Total contratado", "Contratos ativos", "Em andamento"
- [ ] Gráfico de barras por "Como a compra foi feita" (`modalidade_cidadao`)
- [ ] Tabela: O que foi contratado, Secretaria, Empresa, Como foi feito, Valor, Prazo, Status
- [ ] Badge de status com cor + texto (nunca só cor)
- [ ] Filtro por modalidade, secretaria, situação
- [ ] Campo de vigência: "Prazo: DD/MM/AAAA até DD/MM/AAAA"
- [ ] Tooltip em "Como a compra foi feita" explicando modalidades

---

### 2.4 · ReceitasView — Página de Receitas

**Mock:** `src/data/mock/receitas.json`
**Serviço:** `getReceitas(ano?)` → `ReceitasResponse`

**Campos disponíveis no mock:**
- `resumo.total_previsto`, `total_arrecadado`, `percentual_execucao`
- `por_natureza[]` → `{ nome_cidadao, previsto, arrecadado, percentual }` → gráfico de progresso
- `data[]` → registros individuais

**Tarefas:**
- [ ] Criar `src/views/ReceitasView.vue`
- [ ] Adicionar rota `/receitas`
- [ ] Cards: "Valor esperado para o ano", "Valor já recebido", "% executado"
- [ ] Barras de progresso por natureza: "De onde vem o dinheiro" (`nome_cidadao`)
- [ ] Tabela: Categoria, Previsto, Recebido, Diferença, % executado
- [ ] Indicador visual: arrecadado vs previsto (barra horizontal com marcador)
- [ ] Legenda: "FPE = Repasse federal ao Maranhão", "ICMS = Imposto sobre compras e serviços"
- [ ] Nunca exibir siglas sozinhas — sempre com explicação ao lado

---

## 🧠 Fase 2.6 — Agente de Busca com Linguagem Natural (Gemini)

### 2.6.1 · BuscaInteligenteView

**Serviço:** `src/services/geminiAgent.ts` → `enviarMensagem(texto, historico)`
**Thesaurus:** `src/data/thesaurus/termosAgente.ts`
**Rota:** `/busca-inteligente`
**Config:** `VITE_GEMINI_API_KEY` em `.env`

**Tarefas:**
- [x] Criar `src/data/thesaurus/termosAgente.ts` com termos, intenções e campos de filtro
- [x] Criar `src/services/geminiAgent.ts` com integração Gemini 2.0 Flash via fetch nativo
- [x] Criar `src/views/BuscaInteligenteView.vue` com interface de chat conversacional
- [x] Adicionar rota `/busca-inteligente` em `src/router/index.ts` (lazy load)
- [x] Criar `.env.example` com `VITE_GEMINI_API_KEY=`
- [x] Atualizar `SKILLS.md` com seção de IA / Gemini
- [ ] Adicionar link para `/busca-inteligente` no `HeroSearch.vue` ou `QuickAccessCards.vue`
- [ ] Testar com chave real do Gemini e ajustar system prompt conforme respostas
- [ ] Expandir `FUNCOES_ORCAMENTO` no thesaurus com valores reais dos mocks

**Comportamento implementado:**
- Chat conversacional com histórico (últimas 10 trocas)
- Gemini identifica intenção + extrai filtros da pergunta
- Consulta automática nos mocks locais (`filtrarDespesas`, `getServidores`, etc.)
- Botão "Ver detalhes →" navega para a view correta
- Sugestões rápidas na tela inicial
- Sem chave configurada → mensagem de erro amigável (sem exceção)
- `aria-live="polite"`, `role="log"`, alvos de toque `min-h-[44px]`

---

## 🔍 Fase 2.5 — Busca e Autocomplete

### 2.5.1 · Busca Inteligente no HeroSearch

**Endpoint real:** `buscarFornecedores(termo)` → `Fornecedor[]`
**Mock fallback:** `src/data/mock/fornecedores.json`

**Tarefas:**
- [ ] Conectar `HeroSearch.vue` ao `buscarFornecedores()` do `portalApi.ts`
- [ ] Debounce 300ms (API real leva ~3,6s)
- [ ] Exibir dropdown com resultados: nome da empresa + CNPJ mascarado
- [ ] Sempre `.trim()` no `label` retornado pela API real
- [ ] `aria-live="polite"` para anunciar contagem de resultados
- [ ] Estado: carregando / sem resultados / erro de rede
- [ ] Tags populares ("Despesas", "Servidores", "Contratos") navegam para as views corretas

---

## 📊 Fase 3 — Visualizações Avançadas

### 3.1 · Dashboard de Números (melhorar TransparencyNumbers)
- [ ] Trocar donut estático por dados do `getDespesas()` real (`por_funcao[]`)
- [ ] Trocar barras estáticas por dados do `getReceitas()` (`por_natureza[]`)
- [ ] Trocar card de servidores por `getServidores()` (`resumo.total_servidores`)
- [ ] Seletor de ano (2023, 2024, 2025) que re-chama os serviços
- [ ] Animação de entrada nos números (IntersectionObserver)

### 3.2 · Comparativo Anual
- [ ] Linha do tempo: despesas por área nos últimos 3 anos
- [ ] Dados: `por_funcao[]` de múltiplas chamadas `getDespesas(ano)`
- [ ] Gráfico de linhas SVG ou PrimeVue Chart

### 3.3 · Mapa de Calor por Secretaria (nice-to-have)
- [ ] Visualização de gastos agrupados por secretaria
- [ ] Dados: `por_funcao[]` de `despesas.json`

---

## ♿ Fase 3.5 — Acessibilidade Avançada

- [ ] Auditar tabelas de dados: `aria-sort`, `aria-describedby`, `scope`
- [ ] Adicionar `prefers-reduced-motion` nas animações de entrada
- [ ] Testar com leitor de tela (NVDA + Firefox) os gráficos SVG
- [ ] `<title>` e `<desc>` em todos os SVGs de dados
- [ ] Tabela alternativa em texto para cada gráfico (`class="sr-only"`)
- [ ] Focus trap no menu mobile (`AppHeader.vue`)
- [ ] Testar fluxo completo com teclado (Tab → Enter → Escape)

---

## 🚀 Fase 4 — Polimento e Entrega

### 4.1 · Performance
- [ ] Lazy load de views já implementado — verificar bundle size
- [ ] Imagens: `loading="lazy"` + `width`/`height` em todas as `<img>`
- [ ] Prefetch de rotas no `router/index.ts` com `/* @vite-prefetch */`

### 4.2 · SEO e Metadados
- [ ] `<title>` dinâmico por rota (vue-meta ou composable manual)
- [ ] `<meta name="description">` específico para cada view
- [ ] `<meta property="og:*">` para compartilhamento social
- [ ] Adicionar `robots.txt` e `sitemap.xml` básicos

### 4.3 · Testes (se houver tempo)
- [ ] Teste unitário da store de acessibilidade (`vitest`)
- [ ] Teste de snapshot do `AccessibilityBar.vue`
- [ ] Teste E2E do fluxo: Home → Despesas → filtrar → ver resultado (`playwright`)

### 4.4 · Documentação Final
- [ ] Atualizar `SKILLS.md` com Fase 2 e 3 marcadas como concluídas
- [ ] Gravar vídeo de demo: fluxo completo com acessibilidade ativada
- [ ] README com instruções de execução para os juízes

---

## 📋 Backlog / Nice-to-Have

- [ ] Dark mode (além do alto contraste existente)
- [ ] PWA: `manifest.json` + service worker para offline básico
- [ ] Exportar qualquer tabela como CSV (no browser, sem backend)
- [ ] Compartilhar filtro via URL query string (`?ano=2025&funcao=Saude`)
- [ ] Breadcrumb de navegação em todas as views de detalhe
- [ ] "Dados de exemplo" — banner claro indicando que os dados são mockados

---

## 🗂️ Ordem de Implementação Sugerida

```
1. DespesasView       ← maior impacto visual, dados mais ricos
2. ServidoresView     ← segundo dado mais buscado
3. ContratosView      ← demonstra transparência em compras
4. ReceitasView       ← fecha o ciclo orçamentário
5. Busca autocomplete ← usa endpoint real (prova que não é tudo mock)
6. Dashboard melhorado← polimento do que já existe
7. A11y avançado      ← auditoria final
8. Polimento/entrega  ← SEO, meta, README
```

---

## ⚡ Comandos Rápidos

```bash
# Dev
npm run dev

# Type check
npm run type-check

# Build
npm run build

# Preview build
npm run preview
```
