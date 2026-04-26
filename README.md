# Portal da Transparência MA — Redesign Cidadão

Protótipo desenvolvido no **Hackathon da Transparência — Abril de 2026**.

Redesign do Portal da Transparência do Maranhão com foco em acessibilidade real, linguagem cidadã e navegação em até 3 cliques, conforme exigido pela Lei de Acesso à Informação (Lei nº 12.527/2011).

**Deploy:** https://hackathon-transparencia.vercel.app

---

## O problema

O Portal da Transparência do Maranhão recebeu o Selo Diamante 2025 do PNTP, mas uma auditoria técnica realizada em abril de 2026 identificou fragilidades que contradizem essa classificação:

- Consultas primárias exigem entre 5 e 7 cliques (a LAI orienta no máximo 3)
- Interface repleta de jargão contábil sem explicação: "empenho", "liquidação", "unidade gestora"
- Alto contraste quebrado, sem skip link funcional, ícones sem `aria-label`
- Endpoints com falha: exportação CSV retorna HTTP 500, API de receitas retorna 404

---

## A solução

Interface reimaginada como ferramenta cidadã, não como sistema interno de contabilidade.

**Princípio central:** se o cidadão precisar de formação em contabilidade pública para entender um campo da tela, o campo está errado.

### Navegação em até 3 cliques

```
Home
├── Busca inteligente (linguagem natural ou termo técnico)
├── Cards de acesso rápido → dado imediato (1 clique)
└── Filtros opcionais (2º clique, nunca obrigatório)
```

### Linguagem cidadã

Todos os termos técnicos são substituídos por equivalentes acessíveis, baseados no Tesauro de Transparência do Maranhão v2.2:

| Termo técnico | Linguagem cidadã |
|---|---|
| Empenho | Compromisso de pagamento |
| Liquidação | Confirmação de entrega do serviço |
| Unidade Gestora | Secretaria ou órgão responsável |
| Remuneração bruta | Salário antes dos descontos |
| Pregão eletrônico | Compra feita pela internet com competição de preços |
| Modalidade licitatória | Como a compra foi feita |

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Build | Vite 8 |
| Estilização | Tailwind CSS v4 |
| Componentes UI | PrimeVue 4 + PrimeIcons |
| Estado global | Pinia 3 |
| Roteamento | Vue Router 5 |
| Tipagem | TypeScript + vue-tsc |
| IA | Google Gemini 2.5 Flash |
| Voz — entrada | Web Speech API (nativa do navegador) |
| Voz — saída | Gemini 2.5 Flash TTS + Web Audio API |

Nenhuma biblioteca de terceiros foi instalada para as funcionalidades de voz — tudo usa APIs nativas do navegador e chamadas `fetch` diretas.

---

## Funcionalidades implementadas

### Busca inteligente na home

O campo de busca interpreta tanto termos coloquiais quanto técnicos e exibe sugestões categorizadas enquanto o usuário digita:

- Termos coloquiais: "hospital" → Despesas com Saúde; "obras" → Despesas com Urbanismo
- Termos técnicos: "empenho" → Despesas; "pregão eletrônico" → Contratos
- Navegação por teclado: setas, Enter e Escape
- Fallback: encaminha para o assistente de IA com a pergunta pré-preenchida

### Assistente de transparência (IA)

Chat conversacional em linguagem natural integrado a dados reais do portal.

**Fluxo:**
1. Usuário digita ou fala a pergunta
2. Gemini 2.5 Flash interpreta a intenção e extrai filtros
3. O assistente consulta os dados do portal com os filtros detectados
4. A resposta inclui estatísticas reais e um link para a página de detalhe

**Intenções reconhecidas:**

| Intenção | Exemplos de perguntas |
|---|---|
| Despesas | "quanto o governo gastou com saúde?", "empenhos de 2024" |
| Servidores | "salário de professor", "quantos servidores ativos?" |
| Contratos | "contratos vigentes", "pregões de merenda escolar" |
| Receitas | "quanto o MA arrecadou de ICMS?", "entrada de recursos" |

**Configuração do modelo:**
- Temperatura: 0.3 (respostas factuais e consistentes)
- Máximo de tokens: 1.024 por resposta
- Histórico: últimas 20 mensagens por sessão
- Formato de saída: JSON estruturado com `mensagem`, `intencao`, `filtros`, `linkDetalhe`
- Retry automático em erro 429 com backoff

### Consulta por voz — Computação Afetiva aplicada ao acesso à informação

A interação por voz é o diferencial mais significativo do assistente sob a perspectiva da **Computação Afetiva**: a fala é um canal naturalmente carregado de estado emocional e representa a forma de comunicação mais acessível para cidadãos idosos, com baixa alfabetização digital ou em situação de ansiedade diante de interfaces complexas. Ao permitir que o cidadão simplesmente fale sua dúvida e receba uma resposta em áudio, o assistente elimina a barreira cognitiva imposta pelo formulário tradicional de filtros.

**Entrada por voz (fala → texto):** Web Speech API nativa do navegador
- Idioma: `pt-BR`
- Sem bibliotecas externas, sem custo adicional
- Disponível em Chrome, Edge e Safari
- Feedback visual durante a escuta (indicador de atividade do microfone)

**Resposta em áudio (texto → fala):** Gemini 2.5 Flash TTS + Web Audio API
- Voz: Aoede (português), com prosódia natural
- Formato: PCM 16-bit, 24 kHz, mono
- Textos divididos em fragmentos de até 200 caracteres, gerados em paralelo e reproduzidos em sequência para minimizar latência percebida
- Pré-processamento afetivo: remove artefatos de markdown, converte valores monetários para linguagem falada (`R$ 1.234,56` → "mil duzentos e trinta e quatro reais e cinquenta e seis centavos") e percentuais para forma oral natural
- Ativado automaticamente quando a entrada foi por microfone; o usuário pode desativar pelo controle de volume no cabeçalho

A escolha por síntese de voz via API de IA — em vez da Web Speech Synthesis nativa — resulta em uma resposta audível com qualidade e naturalidade significativamente superior, reduzindo a sensação de frieza típica de sistemas automatizados.

### Acessibilidade

| Recurso | Implementação |
|---|---|
| Tamanho de fonte | 5 níveis (14px a 22px), aplicados no elemento `<html>` |
| Escala de cinza | Classe `a11y-grayscale` |
| Alto contraste | Fundo preto, texto branco |
| Inverter cores | `a11y-invert` com re-inversão automática de imagens |
| VLibras | Widget oficial do governo, controlado por Pinia |
| Skip link | `<a href="#main-content">` visível ao Tab |
| Alvos de toque | Mínimo 44×44px (WCAG 2.5.5) |
| ARIA | `aria-label` em todos os elementos interativos sem texto visível |
| Estados de toggle | `aria-pressed` nos botões de alternância |
| Regiões dinâmicas | `aria-live="polite"` em regiões de conteúdo variável |
| Persistência | Preferências salvas em `localStorage` |

Conformidade alvo: WCAG 2.1 Nível AA e eMAG 3.1.

### Pesquisa de satisfação — Medição afetiva por página

O componente `SatisfactionSurvey` é o mecanismo de **medição de estado afetivo** do portal. Ao coletar a avaliação do cidadão imediatamente após a interação com cada seção, o sistema captura a resposta emocional ao conteúdo e à usabilidade antes que ela se dissolva — dado relevante para ciclos de melhoria centrados no usuário.

A escala de 1 a 5 estrelas funciona como um instrumento de autorrelato de afeto, amplamente utilizado em Computação Afetiva para medir valência (positivo/negativo) de forma simples e culturalmente universal. O campo de comentário livre complementa com dados qualitativos sobre a experiência.

- Avaliação de 1 a 5 estrelas (Muito ruim → Excelente)
- Comentário opcional (até 200 caracteres)
- Uma avaliação por página por sessão
- Toast de confirmação após envio, com transição suave
- Dados armazenados em memória de sessão via Pinia
- Páginas instrumentadas: Home, Busca Inteligente, Despesas, Remuneração, Página não encontrada

---

## Estratégia de dados

O portal oficial é server-side rendered (PHP/Laravel) e não possui REST API funcional. Apenas o endpoint de autocomplete de fornecedores estava operacional durante o hackathon.

**Solução adotada:** dados mockados em `src/data/mock/*.json` com estrutura idêntica à que a API retornaria.

| Arquivo | Conteúdo |
|---|---|
| `despesas.json` | Despesas por função, resumo anual, registros individuais |
| `servidores.json` | Total de servidores por vínculo, dados individuais |
| `contratos.json` | Contratos por situação e modalidade |
| `receitas.json` | Receitas por natureza, previsão vs. arrecadado |
| `fornecedores.json` | Formato exato do endpoint real (com `.trim()` aplicado) |

A flag `USE_REAL_API` em `src/services/portalApi.ts` permite transição imediata para a API real quando disponível.

---

## Estrutura do projeto

```
src/
├── components/
│   ├── AccessibilityBar.vue      # barra de acessibilidade
│   ├── AppHeader.vue             # cabeçalho com menu mobile
│   ├── AppFooter.vue             # rodapé institucional
│   ├── HeroSearch.vue            # busca inteligente com dropdown de sugestões
│   ├── QuickAccessCards.vue      # atalhos de 1 clique
│   ├── TransparencyNumbers.vue   # painel de números do estado
│   ├── MostAccessedServices.vue  # serviços mais acessados
│   ├── InstitutionalLogos.vue    # logos da Rede Transparência MA
│   └── SatisfactionSurvey.vue   # pesquisa de satisfação por página
├── composables/
│   ├── useSpeechRecognition.ts   # Web Speech API (fala para texto)
│   └── useGeminiTTS.ts           # Gemini TTS + Web Audio API (texto para fala)
├── data/
│   ├── mock/                     # dados simulados por categoria
│   └── thesaurus/
│       └── termosAgente.ts       # glossário, intenções e filtros do sistema
├── router/
│   └── index.ts
├── services/
│   ├── geminiAgent.ts            # integração Gemini: prompt, parsing e dados
│   └── portalApi.ts              # acesso aos dados (mock ou API real)
├── stores/
│   ├── accessibility.ts          # preferências de acessibilidade
│   └── satisfaction.ts           # avaliações de usabilidade por sessão
└── views/
    ├── HomeView.vue
    ├── BuscaInteligenteView.vue  # assistente de IA com voz
    ├── DespesasView.vue
    ├── RemuneracaoView.vue
    ├── PessoalView.vue
    └── NotFoundView.vue
```

---

## Configuração

### Pré-requisitos

- Node.js 20.19 ou superior
- Chave de API do Google Gemini (gratuita com limites no AI Studio)

### Instalação

```sh
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```
VITE_GEMINI_API_KEY=sua_chave_aqui
```

A mesma chave é usada para o assistente de chat (Gemini 2.5 Flash) e para a síntese de voz (Gemini 2.5 Flash TTS).

### Desenvolvimento

```sh
npm run dev
```

### Build para produção

```sh
npm run build
```

### Verificação de tipos

```sh
npm run type-check
```

---

## Base legal e normativa

- Lei nº 12.527/2011 — Lei de Acesso à Informação (LAI)
- Decreto Federal nº 7.724/2012 — Regulamentação da LAI
- eMAG 3.1 — Modelo de Acessibilidade em Governo Eletrônico (MP/SLTI)
- WCAG 2.1 Nível AA — Web Content Accessibility Guidelines (W3C)
- PNTP 2025 — Programa Nacional de Transparência Pública (CGU/Atricon/TCU)
- IN nº 001/2025 — Maranhão Transparente (base do Tesauro de Transparência v2.2)

---

*Hackathon da Transparência — Abril de 2026*
