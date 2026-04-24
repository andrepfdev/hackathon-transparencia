# Dossiê de Novas Fragilidades — Portal da Transparência MA
### Segunda Auditoria Técnica | 19 de abril de 2026

> [!IMPORTANT]
> Este documento complementa o dossiê anterior. As fragilidades já catalogadas (SVG overflow, Wordcloud, botões genéricos, jargões, banner above-the-fold, alto contraste quebrado, Swagger instável) **não são repetidas aqui**. Apenas achados **novos** estão registrados.

---

## 🔴 BLOCO 1 — Violação da "Regra dos Cliques" (LAI / WCAG)

A **Lei de Acesso à Informação (Lei nº 12.527/2011)** e o **Decreto Federal nº 7.724/2012** determinam que portais de transparência devem garantir acesso à informação de forma **direta e sem barreiras desnecessárias**. O CGI.br e a CGU orientam que dados primários (despesas, contratos, folha) devem ser acessíveis em **no máximo 3 cliques** a partir da página inicial.

### Mapa de Cliques Atual (Portal MA)

| Informação desejada | Caminho atual | Nº de cliques |
|---|---|---|
| "Quanto o Estado gastou com saúde este mês?" | Home → Explore → Despesas → preencher 5+ filtros → Pesquisar | **5–7 cliques** |
| "Qual o salário de um servidor?" | Home → Jornadas → Remuneração → (submenu) → filtros | **4–5 cliques** |
| "Quais contratos foram firmados?" | Home → Explore → Contratos → filtros → Pesquisar | **4–5 cliques** |
| "Ver uma licitação específica" | Home → Explore → Licitações → filtros → resultado | **5–6 cliques** |
| "Acessar Dados Abertos" | Home → "Dados Abertos" (menu topo) → site externo | **2 cliques + abandono** |

> [!CAUTION]
> **Nenhuma** das consultas primárias é alcançável em ≤ 3 cliques. Isso é uma **não conformidade com o espírito da LAI** e com as recomendações do PNTP (Programa Nacional de Transparência Pública — o mesmo que concedeu o Selo Diamante 2025).

### Por que isso acontece?

1. **Dupla camada de menu**: o portal tem dois sistemas de menu distintos e desconexos — o menu de topo (Jornadas, Busca & Mais procurados, Vídeo & Informações) e o menu lateral com ícones, que são duplicatas parciais entre si.
2. **O botão "Explore" é obrigatório**: toda consulta de dados passa obrigatoriamente pelo botão genérico "Explore", criando uma barreira desnecessária.
3. **Formulários de múltiplos passos**: os formulários de busca possuem até **5 seções numeradas** de filtros que o usuário precisa compreender antes de ver qualquer dado.

### Solução proposta para o protótipo
Substituir a arquitetura atual por **Cards de Consulta Rápida** na home, cada um pré-configurado com os filtros do ano atual:
```
[Card] Despesas do Estado 2026  →  1 clique → resultado imediato
[Card] Folha de Pagamento        →  1 clique → resultado imediato  
[Card] Contratos Ativos          →  1 clique → resultado imediato
```

---

## 🔴 BLOCO 2 — Fragilidades de API (Testadas em 19/04/2026)

### Status Real dos Endpoints

| Endpoint | Status HTTP | Tempo | Observação |
|---|---|---|---|
| `/app/v2/despesas/fornecedoresContratantes?search={termo}` | ✅ **200 OK** | ~3,6s | Funciona, mas **lento** para autocompletar |
| `/app/v2/despesas/exportar?tipo=csv&ano=2024` | ❌ **500 ERROR** | 1,3s | **Erro de servidor** — dados não exportáveis |
| `/api/v2/despesas?ano=2024` (Swagger legado) | ❌ **404** | 0,6s | Rota não existe mais |
| `dados.ma.gov.br/api/action/datastore_search` (CKAN) | ⚠️ **Instável** | — | Retornou JSON inválido no teste |
| `/app/v2/receitas/unidades?search=` | ❌ **404** | 0,6s | Rota não existe |
| `/app/v2/remuneracao/exportar?tipo=csv&ano=2024` | ❌ **404** | 0,6s | Rota não existe |
| `/app/v2/licitacoes` | ⚠️ **Retorna HTML** | 1,8s | Rota retorna a SPA, não JSON |
| `/app/v2/contratos` | ⚠️ **Retorna HTML** | — | Idem — rota de SPA, não API |

### Achados críticos
- **A exportação de CSV de despesas está completamente quebrada** (HTTP 500). Um cidadão ou jornalista que tenta baixar dados de 2024 recebe um erro de servidor.
- **O autocomplete de fornecedores está funcional** mas retorna nomes com padding de espaços em branco excessivo (`"MARIA DIVINA BARBOSA DA SILVA                    "`), indicando dados sem sanitização no retorno.
- **Ausência de CORS headers** no autocomplete — qualquer aplicação externa pode consumir esses dados sem restrição.

---

## 🟠 BLOCO 3 — Arquitetura Dual de Menus (Inconsistência Sistêmica)

**Onde:** Toda a interface interna do portal (seção "Explore")

O portal mantém **dois sistemas de navegação sobrepostos e incoerentes**:
- **Menu de Topo** (homepage): Jornadas | Busca & Mais Procurados | Vídeo & Informações | Presença do Estado | Outros Portais | Dados Abertos
- **Menu Interno** (dentro do "Explore"): Despesas | Receitas | Pessoal + Diárias | Remuneração | Transferências | Extraorçamentário | Licitações | Contratos | Obras | Adiantamentos | Emendas Parlamentares | Ordem Cronológica

**Impacto:** O usuário perde completamente a referência de onde está. Ao entrar em "Explore → Despesas", o menu de topo desaparece e é substituído pelo menu de dados. Não há indicação clara de que o usuário está numa subseção.

![Formulário de Despesas com 5 seções numeradas e menu interno diferente](/home/andre/HACKATHON/auditoria_2/screenshots/despesas_form.png)

---

## 🟠 BLOCO 4 — Formulários com Excesso de Campos (Barreira de Entrada)

**Onde:** `/app/v2/despesas`, `/app/v2/receitas`, `/app/v2/pessoal`

O formulário de **Despesas** exige que o usuário compreenda e preencha até **5 seções numeradas**:
1. Período (com 3 modos: Ano / Período / Últimos dias)
2. Visualização (por UG, por Função, etc.)
3. Outros filtros (Pagos / Não Pagos / Todos)
4. Outras Informações
5. Dados gerais (Unidade, Categoria, Natureza, Função, Programa, Fornecedor, Subfunção, Ação)

O formulário de **Receitas** exige "Natureza da Receita" e "Por UGs" sem qualquer tooltip explicativo.

**Impacto (LAI):** Um cidadão comum que quer apenas ver "quanto o estado gastou com saúde em março" precisa descobrir por si só três conceitos técnicos sem auxílio.

![Receitas com jargão "Natureza da receita" e "Por UGs"](/home/andre/HACKATHON/auditoria_2/screenshots/receitas_form.png)

---

## 🟠 BLOCO 5 — Mapa "Presença do Estado" com Tiles em Branco

**Onde:** Seção "Presença do Estado" na página inicial

O mapa interativo (Leaflet.js) carrega os controles e a legenda, mas os **tiles do mapa ficam em branco** (verde sólido sem renderização das ruas/regiões). O mapa é tecnicamente inicializado mas os dados cartográficos não carregam.

![Mapa com tiles em branco — apenas fundo verde sólido sem ruas](/home/andre/HACKATHON/auditoria_2/screenshots/mapa_presenca.png)

**Causa provável:** Tile server externo bloqueado ou com rate limiting (possivelmente OpenStreetMap sem chave de API).
**Impacto:** Cidadão não consegue localizar geograficamente hospitais, escolas, bombeiros e defensorias no seu município.

---

## 🟠 BLOCO 6 — Busca Global Retorna "1000 resultados" Sem Relevância

**Onde:** `/pesquisa-avancada?query=saude`

A busca por "saude" retorna **"Encontrado 1000 resultado(s)"** — um número que parece ser o limite máximo hardcoded, não a contagem real. Os primeiros resultados são páginas institucionais (EMSERH, PES), não dados de despesas ou contratos relacionados à saúde.

![Busca por "saude" retorna 1000 resultados genéricos sem filtros úteis](/home/andre/HACKATHON/auditoria_2/screenshots/busca_global.png)

**Fragilidades específicas observadas:**
- O campo "buscar por: Ano Atual" é quase invisível (texto branco sobre fundo branco)
- Os filtros `#estatico`, `#remuneracao`, `#contrato` não têm labels descritivos para o cidadão
- Nenhum resultado mostra valores monetários associados — apenas títulos de páginas
- Não há paginação visível — apenas scroll infinito

---

## 🟡 BLOCO 7 — Dupla Identidade Visual (Dois Design Systems Conflitantes)

**O que:** O portal usa duas paletas completamente distintas sem transição lógica:
- **Homepage**: fundo azul-acinzentado fotográfico + cards coloridos (azul, laranja, verde, vermelho) 
- **Seção interna (Explore)**: banner vermelho escuro + formulários cinza/branco

O usuário percebe visualmente que "entrou em outro site" ao clicar em "Explore". Isso não é branding consistente — é **ausência de design system unificado**.

---

## 🟡 BLOCO 8 — Cabeçalho de Segurança Ausente (CSP Mínimo)

**Teste realizado via curl:**
```
HTTP Header: content-security-policy: upgrade-insecure-requests  (único header de segurança)
```

Estão **ausentes**:
- `X-Frame-Options` → vulnerável a clickjacking
- `X-Content-Type-Options` → MIME sniffing não bloqueado
- `Referrer-Policy` → vaza URL em navegação
- `Permissions-Policy` → câmera/mic/geolocalização não restritos

**Relevância para o Hackathon:** Seu protótipo pode demonstrar que uma solução cidadã pode ser **mais segura** que o portal oficial.

---

## 🟡 BLOCO 9 — Sidebar com Ícones Sem Labels (WCAG Nível A violado)

**Onde:** Sidebar esquerda em todas as páginas internas

A sidebar contém ~12 ícones de navegação sem nenhum texto descritivo. Um usuário com deficiência visual usando leitor de tela não consegue identificar o destino dos links. Não há `aria-label` nos ícones.

**WCAG 2.1 violado:** Critério 1.1.1 (Conteúdo Não-Textual) — Nível A (o mais básico de todos).

---

## 🟡 BLOCO 10 — Nomes de Fornecedores com Padding Excessivo na API

**Endpoint:** `fornecedoresContratantes?search=maria`

**Exemplo de retorno:**
```json
{
  "label": "MARIA DIVINA BARBOSA DA SILVA                                                                     ",
  "doc": "00003792624362"
}
```

Os nomes retornam com dezenas de espaços de padding fixo. Isso indica dados vindo diretamente de campo `CHAR(n)` de banco de dados legado sem `TRIM()`.

**Impacto direto no protótipo:** se consumido sem tratamento, os nomes aparecerão truncados ou mal formatados. Solução simples: `label.trim()` no JavaScript.

---

## 🟡 BLOCO 11 — Ausência de Estado "Sem Resultados" nos Formulários

**Onde:** Formulários de Despesas, Receitas, Pessoal

Quando uma combinação de filtros não retorna dados, a tabela simplesmente fica vazia — sem mensagem de "Nenhum resultado encontrado". O usuário não sabe se o sistema travou, se os dados não existem ou se preencheu algo errado.

---

## ✅ BLOCO 12 — O Que Funciona (Recursos a Aproveitar no Protótipo)

| Recurso | Status | Como usar |
|---|---|---|
| Autocomplete de fornecedores | ✅ 200 OK (~3,6s) | Barra de pesquisa cidadã em tempo real |
| Menu interno de dados (11 categorias) | ✅ Funcional | Mapeie como cards na home |
| Breadcrumb | ✅ Presente | "Página Principal / Explore / Despesas" |
| Badge "Dados até: 18/04/2026" | ✅ Presente | Mostra atualização dos dados |
| Estrutura de formulários em seções | ✅ Lógica boa | Simplifique com defaults inteligentes |

---

## 📐 Proposta de Arquitetura para ≤ 3 Cliques (Conformidade LAI)

```
HOME
├── [Busca inteligente] — 1 campo, autocomplete em tempo real (usa API existente)
├── [Cards de Acesso Rápido] — dados pré-filtrados para ano atual
│   ├── 💰 Despesas 2026          →  resultado imediato (1 clique)
│   ├── 👥 Folha de Pagamento     →  resultado imediato (1 clique)
│   ├── 📋 Contratos Ativos       →  resultado imediato (1 clique)
│   ├── 🏗️ Obras em andamento     →  resultado imediato (1 clique)
│   └── 📊 Emendas Parlamentares  →  resultado imediato (1 clique)
└── [Refinar resultado] — filtros opcionais com tooltips explicativos (2º clique)
```

**Fluxo ideal (2–3 cliques para dado concreto):**
1. Usuário chega na home → vê cards claros com valores totais visíveis
2. Clica em "Despesas 2026" → vê tabela com dados do ano atual já carregados
3. Clica em filtro "Saúde" → vê dados filtrados com linguagem simples

---

*Auditoria realizada em 19/04/2026 com navegação real no portal e testes de curl nos endpoints.*
