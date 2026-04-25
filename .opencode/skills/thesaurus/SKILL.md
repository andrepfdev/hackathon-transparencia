---
name: thesaurus
description: "Aplica o Thesaurus do Hackathon da Transparência para substituir jargões técnicos por linguagem cidadã. Ativa ao nomear labels, placeholders, tooltips, títulos de seção, mensagens de erro, ou ao revisar qualquer texto visível ao usuário final. Também ativa ao mencionar UG, empenho, liquidação, natureza de receita, extraorçamentário, modalidade ou subfunção."
---

# Thesaurus — Linguagem Cidadã

**Princípio:** se o cidadão precisar de formação em contabilidade pública para entender
um rótulo de interface, o rótulo está errado.

Fonte oficial: `.claude/desafio-hackathon/Thesaurus para o Hackathon da Transparência.xlsx`

---

## Substituições obrigatórias

### Despesas

| Termo técnico | Linguagem cidadã | Contexto |
|---|---|---|
| Empenho | Compromisso de pagamento | Primeiro passo da despesa |
| Liquidação | Confirmação de entrega | Serviço/bem recebido |
| Pagamento | Pagamento realizado | Dinheiro saiu da conta |
| Unidade Gestora (UG) | Secretaria ou órgão responsável | Quem gastou |
| Natureza da Despesa | Tipo de gasto | O que foi comprado |
| Categoria Econômica | Classificação do gasto | — |
| Subfunção | Área de atuação | Dentro de Saúde, Educação... |
| Programa | Programa do governo | — |
| Ação | Atividade do governo | — |
| Fonte de Recurso | De onde veio o dinheiro | Federal, estadual, próprio... |
| CNPJ do fornecedor | Empresa contratada | — |
| CPF do credor | Pessoa que recebeu | — |
| Situação: Liquidado | Serviço confirmado | — |
| Situação: Pago | Pago | — |
| Situação: Empenhado | Comprometido | — |

### Receitas

| Termo técnico | Linguagem cidadã |
|---|---|
| Natureza da Receita | De onde vem o dinheiro |
| Receita Tributária | Impostos e taxas |
| Receita Patrimonial | Rendimentos do patrimônio público |
| Transferências Correntes | Dinheiro recebido do governo federal |
| Receitas de Capital | Dinheiro de empréstimos e vendas |
| FPE | Repasse federal ao Maranhão |
| ICMS | Imposto sobre compras e serviços |
| IPVA | Imposto sobre veículos |
| Previsão | Valor esperado para o ano |
| Arrecadação | Valor já recebido |

### Pessoal / Servidores

| Termo técnico | Linguagem cidadã |
|---|---|
| Remuneração | Salário |
| Remuneração Bruta | Salário bruto |
| Remuneração Líquida | Salário recebido |
| Estatutário | Concursado (efetivo) |
| Comissionado | Cargo de confiança |
| Temporário | Contrato temporário |
| Gratificação | Adicional salarial |
| Subsídio | Remuneração de cargos de alto nível |
| Unidade de Lotação | Local de trabalho |
| Órgão de Exercício | Secretaria onde trabalha |

### Contratos e Licitações

| Termo técnico | Linguagem cidadã |
|---|---|
| Modalidade Licitatória | Como a compra foi feita |
| Pregão Eletrônico | Leilão eletrônico (menor preço) |
| Concorrência | Licitação aberta para grandes compras |
| Dispensa de Licitação | Contratação direta (casos especiais) |
| Inexigibilidade | Fornecedor único no mercado |
| Objeto do Contrato | O que foi contratado |
| Vigência | Prazo do contrato |
| Aditivo | Prorrogação ou mudança no contrato |

### Outros

| Termo técnico | Linguagem cidadã |
|---|---|
| Extraorçamentário | Pagamento fora do orçamento anual |
| Convênio | Parceria com repasse de recursos |
| Transferência | Repasse de dinheiro |
| Emenda Parlamentar | Verba indicada por vereador/deputado |
| Obra em execução | Obra em andamento |
| Licitação em andamento | Compra sendo processada |

---

## Como aplicar em componentes Vue

### Labels de formulário
```html
<!-- ❌ Técnico -->
<label for="natureza">Natureza da Receita</label>

<!-- ✅ Cidadão -->
<label for="natureza">De onde vem o dinheiro</label>
<p class="text-xs text-gray-400">Categoria da arrecadação</p>
```

### Títulos de cards
```html
<!-- ❌ Técnico -->
<h3>Empenhos do Período</h3>

<!-- ✅ Cidadão -->
<h3>Compromissos de Pagamento</h3>
<p class="text-xs text-gray-400">Gastos autorizados no período</p>
```

### Valores de tabela com badge
```html
<!-- Status com cor + texto (nunca só cor) -->
<span
  :class="{
    'bg-green-100 text-green-800': item.situacao === 'Pago',
    'bg-yellow-100 text-yellow-800': item.situacao === 'Empenhado',
    'bg-blue-100 text-blue-800': item.situacao === 'Liquidado',
  }"
  class="text-xs font-medium px-2 py-0.5 rounded-full"
>
  {{
    item.situacao === 'Empenhado' ? 'Comprometido' :
    item.situacao === 'Liquidado' ? 'Serviço confirmado' :
    'Pago'
  }}
</span>
```

### Tooltips explicativos
```html
<div class="flex items-center gap-1">
  <span>Empenho</span>
  <button
    type="button"
    aria-label="O que é empenho?"
    title="Primeiro passo: o governo compromete a verba antes de pagar"
    class="text-gray-400 hover:text-blue-600"
  >
    <i class="pi pi-info-circle text-xs" aria-hidden="true" />
  </button>
</div>
```

---

## Regra de dupla camada (avançado)

Para filtros técnicos que precisam existir, exiba o nome cidadão em destaque e o técnico em escala menor:

```html
<option value="10">
  Saúde  ·  <span class="text-gray-400 text-xs">(Função 10)</span>
</option>
```

---

## Armadilhas

- Nunca usar siglas sozinhas: `UG`, `FPE`, `ICMS` — sempre explicar ao lado.
- Nunca usar "Visualizar" ou "Consultar" para botões de ação — usar o que o cidadão vai ver: "Ver despesas", "Ver salários".
- Nunca usar "Pesquisa Avançada" como label de seção — usar "Filtrar resultados".
- Evitar "Dados Abertos" sem explicação — usar "Baixar os dados completos (CSV/JSON)".
