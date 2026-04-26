# Memorial Descritivo
## Portal da Transparência MA — Proposta de Solução Cidadã
### Hackathon da Transparência · Abril de 2026

---

## 1. Identificação do Projeto

| Campo | Informação |
|---|---|
| **Nome da solução** | Portal da Transparência MA — Redesign Cidadão |
| **Evento** | Hackathon da Transparência |
| **Data de entrega** | Abril de 2026 |
| **Repositório** | https://github.com/andrepfdev/hackathon-transparencia.git |
| **Tecnologias principais** | Vue 3 · Tailwind CSS v4 · TypeScript · PrimeVue 4 |

---

## 2. Problema Identificado

O Portal da Transparência do Maranhão recebeu o **Selo Diamante 2025** do Programa Nacional de Transparência Pública (PNTP). Uma auditoria técnica e de usabilidade realizada em abril de 2026 revelou, entretanto, **11 categorias de fragilidades** que contradizem os critérios que fundamentam essa classificação.

### 2.1 Violação da Regra dos 3 Cliques (LAI)

A Lei de Acesso à Informação (Lei nº 12.527/2011) e o Decreto Federal nº 7.724/2012 determinam que portais de transparência devem garantir acesso à informação de forma **direta e sem barreiras desnecessárias**. O CGI.br e a CGU orientam que dados primários devem ser acessíveis em **no máximo 3 cliques** a partir da página inicial.

| Informação desejada | Cliques necessários no portal atual |
|---|---|
| "Quanto o Estado gastou com saúde este mês?" | **5–7 cliques** + 5 campos de filtro |
| "Qual o salário de um servidor público?" | **4–5 cliques** |
| "Quais contratos foram firmados este ano?" | **4–5 cliques** |

Nenhuma consulta primária é alcançável em ≤ 3 cliques no portal oficial.

### 2.2 Barreiras de Linguagem

O portal utiliza jargões de contabilidade pública inacessíveis ao cidadão comum: "Empenho", "Liquidação", "Natureza da Receita", "Subfunção", "Unidade Gestora". Não há tooltips explicativos nem alternativas em linguagem simples.

### 2.3 Acessibilidade Digital Deficiente

- Alto contraste quebrado (inaplicável na prática)
- Ícones de navegação sem `aria-label` — violação do WCAG 2.1 Critério 1.1.1 (Nível A)
- Ausência de skip link funcional para leitores de tela
- Mapa "Presença do Estado" com tiles em branco (falha de carregamento)

### 2.4 Instabilidade da Infraestrutura de Dados

| Endpoint | Status (19/04/2026) |
|---|---|
| Exportar despesas em CSV | ❌ HTTP 500 |
| API de receitas | ❌ HTTP 404 |
| API de contratos | ⚠️ Retorna HTML |
| Autocomplete de fornecedores | ✅ Funcional (porém sem TRIM nos dados) |

---

## 3. Solução Proposta

### 3.1 Princípio Central

> **Se o cidadão precisar de formação em contabilidade pública para entender um campo da interface, o campo está errado.**

Nossa solução reimagina o portal como uma **ferramenta cidadã**: dados públicos apresentados com linguagem acessível, em até 3 cliques, com acessibilidade real e navegação intuitiva.

### 3.2 Arquitetura de Navegação (≤ 3 Cliques)

```
HOME
├── Busca inteligente por linguagem natural
├── Cards de Acesso Rápido (1 clique → dado imediato)
│   ├── Onde o dinheiro foi gasto (Despesas)
│   ├── Salários dos servidores
│   ├── Compras e contratos
│   ├── De onde vem o dinheiro (Receitas)
│   └── Obras em andamento
└── Filtros opcionais (2º clique, nunca obrigatório)
```

**Fluxo máximo para um dado concreto:**
1. Usuário vê os totais do ano na própria home (0 cliques)
2. Clica em "Onde o dinheiro foi gasto" → tabela carregada com dados do ano atual
3. Clica em "Saúde" → dados filtrados em linguagem simples

### 3.3 Linguagem Cidadã (Thesaurus)

Toda a interface substitui termos técnicos por equivalentes em linguagem simples:

| Termo técnico | Linguagem cidadã |
|---|---|
| Empenho | Compromisso de pagamento |
| Liquidação | Confirmação de entrega do serviço |
| Unidade Gestora (UG) | Secretaria ou órgão responsável |
| Natureza da Receita | De onde vem o dinheiro |
| Estatutário | Concursado (efetivo) |
| Modalidade Licitatória | Como a compra foi feita |
| Subfunção | Área de atuação |

O glossário completo está disponível no Thesaurus do Hackathon da Transparência.

---

## 4. Implementação Técnica

### 4.1 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | Vue 3 (Composition API) | Reatividade eficiente, ecossistema maduro |
| Build | Vite 8 | HMR instantâneo, build otimizado |
| Estilização | Tailwind CSS v4 | Mobile-first nativo, tokens de design |
| Componentes UI | PrimeVue 4 + PrimeIcons | Acessibilidade integrada, consistência |
| Estado global | Pinia 3 | Simples, tipado, com persistência |
| Roteamento | Vue Router 5 | Lazy load de rotas |
| Tipo-verificação | TypeScript + vue-tsc | Segurança em tempo de compilação |

### 4.2 Estratégia de Dados

O portal oficial é **server-side rendered** (PHP/Laravel) e não possui REST API funcional. Apenas um endpoint JSON está operacional: o autocomplete de fornecedores.

**Estratégia adotada:**
- Dados mockados em `src/data/mock/*.json` com estrutura idêntica ao que a API retornaria
- Flag `USE_REAL_API` em `src/services/portalApi.ts` para transição imediata quando a API oficial for restaurada
- Todos os tipos definidos em TypeScript (`src/services/types/`)

**Recursos mockados:**

| Arquivo | Dados simulados |
|---|---|
| `despesas.json` | Despesas por função, resumo anual, registros individuais |
| `servidores.json` | Total de servidores, por tipo de vínculo, dados individuais |
| `contratos.json` | Contratos por situação e modalidade, registros individuais |
| `receitas.json` | Receitas por natureza, previsão vs. arrecadado |
| `fornecedores.json` | Formato exato do endpoint real (com `.trim()` aplicado) |

### 4.3 Acessibilidade Implementada

| Recurso | Implementação |
|---|---|
| Tamanho de fonte (A±) | 5 níveis: 14px a 22px, aplicado no `<html>` |
| Escala de cinza | Classe `a11y-grayscale` no `<html>` |
| Alto contraste | Classe `a11y-high-contrast` com fundo preto e texto branco |
| Inverter cores | Classe `a11y-invert` com re-inversão automática de imagens |
| Libras (VLibras) | Widget oficial do governo, controlado por estado Pinia |
| Persistência | `localStorage` — preferências mantidas entre sessões |
| Skip link | `<a href="#main-content">` visível ao focar com Tab |
| Alvos de toque | Mínimo 44×44px em todos os elementos interativos (WCAG 2.5.5) |
| Textos alternativos | `aria-label` em todo elemento interativo sem texto visível |
| Ícones decorativos | `aria-hidden="true"` em todos os ícones funcionais |
| Estados de toggle | `aria-pressed` nos botões de alternância |
| Atualizações dinâmicas | `aria-live="polite"` em regiões de conteúdo variável |

**Conformidade:** WCAG 2.1 Nível AA + eMAG 3.1

### 4.4 Mobile-First

Toda a interface foi construída com base em 320px (menor celular), expandindo progressivamente para telas maiores:

- Sem conteúdo ou funcionalidade exclusiva de desktop
- Alvos de toque mínimos de 44×44px
- Tipografia escalável (`text-xl sm:text-2xl md:text-3xl`)
- Containers com padding responsivo (`px-4 sm:px-6`)
- Menus colapsáveis com hambúrguer acessível

---

## 5. Componentes Desenvolvidos

| Componente | Responsabilidade |
|---|---|
| `AccessibilityBar` | Barra de recursos de acessibilidade — independente e funcional |
| `AppHeader` | Cabeçalho com menu mobile, skip link, logo e navegação |
| `HeroSearch` | Busca principal com campo inteligente e tags populares |
| `QuickAccessCards` | 8 atalhos de 1 clique para os dados mais procurados |
| `TransparencyNumbers` | Painel com gráfico de rosca, barras e card de servidores |
| `MostAccessedServices` | 6 cards dos serviços mais utilizados pelos cidadãos |
| `InstitutionalLogos` | Faixa com logos dos órgãos da Rede Transparência MA |
| `AppFooter` | Rodapé completo com links institucionais e SETRANSP |
| `BuscaInteligenteView` | Assistente de IA conversacional com voz e síntese de dados |
| `SatisfactionSurvey` | Pesquisa de satisfação por página com avaliação em estrelas |

---

## 5.1 Assistente de Transparência (IA)

O **Assistente de Transparência** é uma interface de chat em linguagem natural que permite ao cidadão consultar dados públicos sem precisar conhecer filtros técnicos ou jargão contábil.

### Arquitetura

```
Entrada do usuário (texto ou voz)
↓
[STT: Web Speech API, pt-BR] — opcional
↓
geminiAgent.ts → Gemini 2.5 Flash (JSON estruturado)
↓
Extração de intenção + filtros
↓
portalApi.ts → dados reais (mock em demo)
↓
Resposta enriquecida com estatísticas (📊)
↓
Renderização markdown + botão de detalhe
↓
[TTS: Gemini 2.5 Flash TTS, voz Aoede] — se entrada foi por voz
```

### Modelo e Prompt

| Aspecto | Detalhe |
|---|---|
| **Modelo** | Gemini 2.5 Flash (`gemini-2.5-flash`) |
| **Temperatura** | 0.3 (respostas consistentes e factuais) |
| **Tokens máximos** | 1 024 por resposta |
| **Formato de saída** | JSON obrigatório: `mensagem`, `intencao`, `filtros`, `linkDetalhe` |
| **Retentativas** | Até 2 tentativas com backoff em erro 429 |

O system prompt injeta dinamicamente: glossário técnico→cidadão (Thesaurus), mapeamento de sinônimos por área orçamentária, filtros disponíveis por categoria e data atual (para contextualizar anos relativos).

### Consulta por Voz — Computação Afetiva Aplicada ao Acesso à Informação

A interação por voz é o diferencial mais significativo do assistente sob a perspectiva da **Computação Afetiva**. A fala é um canal naturalmente carregado de estado emocional e representa a forma de comunicação mais acessível para cidadãos idosos, com baixa alfabetização digital ou em situação de ansiedade diante de interfaces complexas de dados públicos. Ao permitir que o cidadão simplesmente fale sua dúvida e receba uma resposta em áudio com prosódia natural, o assistente elimina a barreira cognitiva imposta pelo formulário tradicional de filtros — e transforma a experiência de acesso à informação pública em um diálogo, não em um preenchimento de formulário.

**Reconhecimento de Voz (STT):** Web Speech API nativa do navegador
- Idioma: `pt-BR`
- Modo: sessão única por ativação (não contínuo)
- Resultados intermediários habilitados para feedback visual em tempo real
- Fallback: campo de texto manual quando a API não é suportada pelo navegador

**Síntese de Voz (TTS):** Gemini 2.5 Flash TTS com reprodução via Web Audio API

| Aspecto | Detalhe |
|---|---|
| **Endpoint** | `gemini-2.5-flash-preview-tts:generateContent` |
| **Voz** | Aoede (português), prosódia natural |
| **Formato** | PCM 16-bit, 24 kHz, mono |
| **Chunking** | Texto dividido em fragmentos ≤ 200 caracteres; geração paralela, reprodução sequencial |
| **Limite** | 500 caracteres por resposta (truncado em fronteira de sentença) |
| **Pré-processamento** | Remove markdown; converte `R$ 1.234,56` → por extenso; converte `85,5%` → "85,5 por cento" |

A escolha por síntese via modelo de IA — em vez da Web Speech Synthesis nativa do navegador — resulta em qualidade e naturalidade de fala significativamente superiores, reduzindo a sensação de frieza característica de sistemas automatizados. O assistente reproduz a resposta em áudio automaticamente quando a entrada foi feita por microfone. O usuário pode desativar o TTS pelo ícone de volume no cabeçalho da página.

### Integração com Dados Reais

Ao identificar a intenção do usuário, o agente consulta a API do portal e enriquece a resposta com estatísticas concretas:

| Intenção | Dados retornados |
|---|---|
| `despesas` | Total de registros, total pago, total empenhado |
| `servidores` | Total de servidores, folha total, média salarial |
| `contratos` | Quantidade de contratos, valor total contratado |
| `receitas` | Arrecadado, previsto, percentual de execução |

### Histórico de Conversa

O assistente mantém as últimas **20 mensagens** da sessão como contexto para o Gemini, permitindo perguntas de acompanhamento sem necessidade de repetir o tema.

---

## 5.2 Pesquisa de Satisfação — Medição de Estado Afetivo por Página

O componente `SatisfactionSurvey` é o mecanismo de **medição de estado afetivo** do portal. Enquanto a consulta por voz representa a dimensão de *entrada afetiva* — o cidadão se expressa de forma natural — a pesquisa de satisfação representa a dimensão de *resposta afetiva*: o sistema captura a reação emocional do usuário à experiência vivida em cada seção.

Na perspectiva da **Computação Afetiva**, coletar essa avaliação imediatamente após a interação, antes que a experiência emocional se dissolva, é essencial para obter dados válidos sobre o estado afetivo induzido pela interface. A escala de 1 a 5 estrelas é um instrumento de autorrelato de afeto amplamente utilizado em pesquisa, capturando a **valência afetiva** (positivo/negativo) de forma simples e culturalmente universal. O campo de comentário livre complementa com dados qualitativos, revelando *por que* o usuário se sentiu daquela forma.

Juntos, o assistente por voz e a pesquisa de satisfação formam um ciclo afetivo básico no portal:

```
Entrada afetiva (voz)
→ Processamento empático (IA em linguagem cidadã)
→ Saída afetiva (áudio natural)
→ Medição do estado resultante (pesquisa de satisfação)
→ Dados para refinamento da experiência
```

### O que é coletado

| Campo | Tipo | Papel na Computação Afetiva |
|---|---|---|
| Avaliação em estrelas | 1 a 5 (Muito ruim → Excelente) | Medida de valência afetiva |
| Comentário livre | Texto, máx. 200 caracteres | Dado qualitativo de estado emocional |
| Página avaliada | Nome da rota (ex: `BuscaInteligente`) | Contexto da experiência |
| Timestamp | Milissegundos epoch | Rastreabilidade temporal |

### Comportamento

- Exibido automaticamente ao final de cada página instrumentada
- Oculto após envio — uma avaliação por página por sessão
- Toast de confirmação com transição suave após o envio
- Estado gerenciado por store Pinia (`useSatisfactionStore`)
- Dados armazenados em memória de sessão (sem persistência em backend no protótipo)

### Páginas instrumentadas

`HomeView` · `BuscaInteligenteView` · `DespesasView` · `RemuneracaoView` · `NotFoundView`

---

## 6. Diferenciais em Relação ao Portal Oficial

| Critério | Portal Oficial | Nossa Solução |
|---|---|---|
| Cliques para dado primário | 5–7 | **1–2** |
| Linguagem | Jargão técnico | **Linguagem cidadã** |
| Alto contraste funcional | ❌ Quebrado | ✅ Implementado |
| Mobile | Parcialmente responsivo | **Mobile-first total** |
| Libras (VLibras) | ❌ Ausente | ✅ Integrado |
| Exportação de dados | ❌ CSV quebrado (HTTP 500) | ✅ Previsto |
| Skip link | ❌ Ausente | ✅ Funcional |
| Ícones com label | ❌ Sem aria-label | ✅ Todos rotulados |
| Design system | Dois sistemas conflitantes | **Único e consistente** |
| Busca com relevância | Retorna "1000 resultados" genéricos | **Por categoria com valores** |
| Assistente por voz | ❌ Ausente | ✅ STT + TTS em português |
| Feedback do Cidadão | ❌ Ausente | ✅ Por página, por sessão |

---

## 7. Base Legal e Normativa

- **Lei nº 12.527/2011** — Lei de Acesso à Informação (LAI)
- **Decreto Federal nº 7.724/2012** — Regulamenta a LAI
- **eMAG 3.1** — Modelo de Acessibilidade em Governo Eletrônico (MP/SLTI)
- **WCAG 2.1 Nível AA** — Web Content Accessibility Guidelines (W3C)
- **PNTP** — Programa Nacional de Transparência Pública (CGU)

---

## 8. Próximos Passos (Roadmap)

### Fase 2 — Páginas de Detalhe
- Página de Despesas com gráfico por área e tabela paginada
- Página de Servidores com vínculo e faixa salarial
- Página de Contratos com modalidade e situação
- Página de Receitas com previsão vs. arrecadado

### Fase 3 — Inteligência e Busca ✅ Concluída
- ✅ Busca inteligente por linguagem natural (Gemini 2.5 Flash)
- ✅ Chat de consulta integrado, consumindo os dados do portal
- ✅ Entrada por voz (Web Speech API, pt-BR)
- ✅ Resposta em áudio (Gemini TTS, voz Aoede)
- ✅ Pesquisa de satisfação por página

### Fase 4 — Entrega
- Integração com a API real quando disponível (`USE_REAL_API = true`)
- Exportação de dados em CSV diretamente no navegador
- Testes de acessibilidade com leitor de tela (NVDA + Firefox)

---

## 9. Conclusão

O protótipo demonstra que é tecnicamente viável construir um portal de transparência **mais acessível, mais rápido e mais intuitivo** que o portal oficial atual — usando tecnologias modernas, gratuitas e de código aberto, sem infraestrutura de servidor própria, e respeitando integralmente os princípios da Lei de Acesso à Informação e as diretrizes de acessibilidade do governo federal.

A Transparência pública só cumpre seu papel democrático quando qualquer cidadão — independentemente de formação técnica, dispositivo ou limitação — consegue acessar e compreender os dados.

---

*Desenvolvido no Hackathon da Transparência — Abril de 2026*
*Auditoria técnica do portal oficial realizada em 19/04/2026*
