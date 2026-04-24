/**
 * Camada de acesso a dados do Portal da Transparência MA.
 *
 * A API oficial (transparencia.ma.gov.br) é server-side rendered (PHP/Laravel):
 * - Dados chegam embutidos no HTML, não via REST puro
 * - Único endpoint JSON real: /app/v2/despesas/fornecedoresContratantes?search=
 * - Demais endpoints retornam 500/404 — usamos mocks compatíveis com o formato esperado
 *
 * Estrutura dos mocks: src/data/mock/*.json
 * Quando a API real estiver disponível, substitua as importações por fetch() mantendo
 * as mesmas interfaces TypeScript abaixo.
 */

import type { DespesasResponse } from './types/despesas'
import type { ServidoresResponse } from './types/servidores'
import type { ContratosResponse } from './types/contratos'
import type { ReceitasResponse } from './types/receitas'
import type { Fornecedor } from './types/fornecedor'

import mockDespesas from '@/data/mock/despesas.json'
import mockServidores from '@/data/mock/servidores.json'
import mockContratos from '@/data/mock/contratos.json'
import mockReceitas from '@/data/mock/receitas.json'
import mockFornecedores from '@/data/mock/fornecedores.json'

const BASE_URL = 'https://www.transparencia.ma.gov.br'
const USE_REAL_API = false // mude para true quando os endpoints estiverem funcionando

function simulateDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getDespesas(ano = 2025, pagina = 1): Promise<DespesasResponse> {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/app/v2/despesas?ano=${ano}&page=${pagina}`, {
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    })
    return res.json()
  }
  await simulateDelay()
  return mockDespesas as DespesasResponse
}

export async function getServidores(ano = 2025, pagina = 1): Promise<ServidoresResponse> {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/app/v2/pessoal/remuneracao?ano=${ano}&page=${pagina}`, {
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    })
    return res.json()
  }
  await simulateDelay()
  return mockServidores as ServidoresResponse
}

export async function getContratos(ano = 2025, pagina = 1): Promise<ContratosResponse> {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/app/v2/contratos?ano=${ano}&page=${pagina}`, {
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    })
    return res.json()
  }
  await simulateDelay()
  return mockContratos as ContratosResponse
}

export async function getReceitas(ano = 2025): Promise<ReceitasResponse> {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/app/v2/receitas?ano=${ano}`, {
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    })
    return res.json()
  }
  await simulateDelay()
  return mockReceitas as ReceitasResponse
}

/**
 * Autocomplete de fornecedores — único endpoint real funcionando.
 * Retorna: [{id_value, label, doc}]
 * Nota: label retorna com padding CHAR(n) do banco — sempre aplicar .trim()
 */
export async function buscarFornecedores(termo: string): Promise<Fornecedor[]> {
  if (!termo || termo.length < 2) return []

  if (USE_REAL_API) {
    try {
      const res = await fetch(
        `${BASE_URL}/app/v2/despesas/fornecedoresContratantes?search=${encodeURIComponent(termo)}`,
        { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } },
      )
      const data: Fornecedor[] = await res.json()
      return data.map((f) => ({ ...f, label: f.label.trim() }))
    } catch {
      // fallback para mock se a API falhar
    }
  }

  await simulateDelay(200)
  const q = termo.toLowerCase()
  return (mockFornecedores as Fornecedor[])
    .filter((f) => f.label.toLowerCase().includes(q))
    .map((f) => ({ ...f, label: f.label.trim() }))
    .slice(0, 10)
}
