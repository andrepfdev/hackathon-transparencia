---
name: mock-data
description: "Gerencia dados mockados e a camada de serviço do portal. Ativa ao trabalhar com src/services/, src/data/mock/, portalApi.ts, ou ao integrar dados de despesas, receitas, servidores, contratos ou fornecedores. Inclui os tipos TypeScript de cada recurso e a estratégia de fallback."
---

# Dados e Serviços — Portal da Transparência MA

## Contexto da API oficial

O portal `transparencia.ma.gov.br` é server-side rendered (PHP/Laravel).
**Não possui REST API** — dados chegam renderizados no HTML.

**Único endpoint JSON funcionando:**
```
GET /app/v2/despesas/fornecedoresContratantes?search={termo}
→ [{id_value: string, label: string, doc: string}]
```
⚠️ `label` retorna com padding `CHAR(n)` — sempre `label.trim()`.

Todos os demais endpoints retornam HTML, 404 ou 500.

---

## Camada de serviço (`src/services/portalApi.ts`)

### Flag de alternância
```typescript
const USE_REAL_API = false  // true quando a API real funcionar
```

### Funções disponíveis
```typescript
import {
  getDespesas,       // (ano?, pagina?) → DespesasResponse
  getServidores,     // (ano?, pagina?) → ServidoresResponse
  getContratos,      // (ano?, pagina?) → ContratosResponse
  getReceitas,       // (ano?) → ReceitasResponse
  buscarFornecedores // (termo) → Fornecedor[]  ← endpoint real!
} from '@/services/portalApi'
```

### Uso em componente
```typescript
import { ref, onMounted } from 'vue'
import { getDespesas } from '@/services/portalApi'
import type { DespesasResponse } from '@/services/types/despesas'

const dados = ref<DespesasResponse | null>(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    dados.value = await getDespesas(2025)
  } finally {
    loading.value = false
  }
})
```

---

## Estrutura dos mocks

### `src/data/mock/despesas.json`
```json
{
  "meta": { "ano": 2025, "total_registros": 142380, "pagina_atual": 1 },
  "resumo": {
    "total_empenhado": 14823450000.00,
    "total_liquidado": 13201000000.00,
    "total_pago": 12540000000.00
  },
  "por_funcao": [
    { "codigo": "10", "nome": "Saúde", "nome_cidadao": "Saúde", "valor_pago": 4388400000, "percentual": 35 }
  ],
  "data": [
    {
      "id": 1,
      "numero_empenho": "2025NE000001",
      "unidade_gestora": "Secretaria de Saúde do Estado",
      "fornecedor_nome": "CIRURGICA FERNANDES COMERCIO DE MATERIAIS LTDA",
      "fornecedor_doc": "60921336000105",
      "funcao": "Saúde",
      "natureza": "Material de Consumo",
      "valor_pago": 285000.00,
      "situacao": "Pago"
    }
  ]
}
```

### `src/data/mock/servidores.json`
```json
{
  "resumo": {
    "total_servidores": 84500,
    "por_vinculo": [
      { "vinculo": "Estatutário", "nome_cidadao": "Concursado", "quantidade": 52390, "percentual": 62 }
    ]
  },
  "data": [
    {
      "nome": "ANA CARLA SILVA",
      "orgao": "Secretaria de Saúde do Estado",
      "cargo": "Médico",
      "vinculo": "Estatutário",
      "remuneracao_bruta": 12800.00,
      "remuneracao_liquida": 9984.00
    }
  ]
}
```

### `src/data/mock/fornecedores.json`
Formato exato do endpoint real:
```json
[
  { "id_value": "01857610000179", "label": "CONSTRUTORA CONEL", "doc": "01857610000179" }
]
```

---

## Tipos TypeScript

```typescript
// src/services/types/despesas.ts
export interface DespesaItem {
  id: number
  numero_empenho: string
  ano: number
  data_empenho: string
  unidade_gestora: string
  unidade_gestora_codigo: string
  fornecedor_nome: string
  fornecedor_doc: string
  funcao: string
  subfuncao: string
  natureza: string
  valor_empenhado: number
  valor_liquidado: number
  valor_pago: number
  situacao: 'Pago' | 'Pendente' | 'Cancelado'
}

export interface DespesasResponse {
  meta: { ano: number; total_registros: number; pagina_atual: number; total_paginas: number }
  resumo: { total_empenhado: number; total_liquidado: number; total_pago: number }
  por_funcao: { codigo: string; nome: string; nome_cidadao: string; valor_pago: number; percentual: number }[]
  data: DespesaItem[]
}
```

---

## Adicionar novo recurso ao mock

1. Criar `src/data/mock/{recurso}.json` com estrutura `{meta, resumo, data[]}`.
2. Criar `src/services/types/{recurso}.ts` com a interface TypeScript.
3. Adicionar função `get{Recurso}()` em `portalApi.ts` seguindo o padrão existente.
4. Adicionar campo `nome_cidadao` em paralelo ao nome técnico em todos os objetos.

---

## Formatação de valores monetários

```typescript
function formatCurrency(value: number): string {
  if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(1).replace('.', ',')}B`
  if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(1).replace('.', ',')}M`
  if (value >= 1e3) return `R$ ${(value / 1e3).toFixed(0)}k`
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
```

---

## Armadilhas

- Nunca mostrar o nome técnico sem o equivalente cidadão (`nome_cidadao`).
- Nunca usar `label` de fornecedor sem `.trim()`.
- Nunca criar endpoint Express — os mocks são JSONs estáticos importados no build.
- Nunca usar `as any` no retorno dos mocks — sempre tipar com as interfaces.
