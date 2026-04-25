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
import type { ServidoresResponse, ServidorFiltros } from './types/servidores'
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

export interface DespesaFiltros {
  ano?: number
  funcao?: string
  natureza?: string
  ug?: string
  fornecedor?: string
  situacao?: string
  subfuncao?: string
  acao?: string
  fonte?: string
  programa?: string
  categoria?: string
  pagina?: number
}

const POR_PAGINA = 10

export async function filtrarDespesas(filtros: DespesaFiltros = {}): Promise<DespesasResponse> {
  await simulateDelay(300)

  const { ano, funcao, natureza, ug, fornecedor, situacao, subfuncao, acao, fonte, programa, categoria, pagina = 1 } = filtros

  let itens = (mockDespesas as DespesasResponse).data

  if (ano) itens = itens.filter((d) => d.ano === ano)
  if (funcao && funcao !== 'all') itens = itens.filter((d) => d.funcao === funcao)
  if (natureza && natureza !== 'all') itens = itens.filter((d) => d.natureza === natureza)
  if (ug && ug !== 'all') itens = itens.filter((d) => d.unidade_gestora_codigo === ug)
  if (subfuncao && subfuncao !== 'all') itens = itens.filter((d) => d.subfuncao === subfuncao)
  if (acao && acao !== 'all') itens = itens.filter((d) => d.acao === acao)
  if (fonte && fonte !== 'all') itens = itens.filter((d) => d.fonte === fonte)
  if (programa && programa !== 'all') itens = itens.filter((d) => d.programa === programa)
  if (categoria && categoria !== 'all') itens = itens.filter((d) => d.categoria === categoria)
  if (fornecedor) {
    const q = fornecedor.toLowerCase()
    itens = itens.filter((d) => d.fornecedor_nome.toLowerCase().includes(q))
  }
  if (situacao && situacao !== 'all') itens = itens.filter((d) => d.situacao === situacao)

  const total = itens.length
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * POR_PAGINA
  const dados = itens.slice(inicio, inicio + POR_PAGINA)

  const resumo = (mockDespesas as DespesasResponse).resumo

  return {
    meta: {
      endpoint: '/app/v2/despesas',
      ano: ano ?? (mockDespesas as DespesasResponse).meta.ano,
      atualizado_em: (mockDespesas as DespesasResponse).meta.atualizado_em,
      total_registros: total,
      pagina_atual: paginaAtual,
      total_paginas: totalPaginas,
    },
    resumo,
    por_funcao: (mockDespesas as DespesasResponse).por_funcao,
    data: dados,
  }
}

export async function filtrarServidores(filtros: ServidorFiltros = {}): Promise<ServidoresResponse> {
  await simulateDelay(300)

  const { nome, orgao, cargo, vinculo, situacao, municipio, pagina = 1 } = filtros

  let itens = (mockServidores as ServidoresResponse).data

  if (nome) {
    const q = nome.toLowerCase()
    itens = itens.filter((s) => s.nome.toLowerCase().includes(q))
  }
  if (orgao && orgao !== 'all') {
    itens = itens.filter((s) => s.orgao_codigo === orgao)
  }
  if (cargo) {
    const q = cargo.toLowerCase()
    itens = itens.filter((s) => s.cargo.toLowerCase().includes(q))
  }
  if (vinculo && vinculo !== 'all') itens = itens.filter((s) => s.vinculo === vinculo)
  if (situacao && situacao !== 'all') itens = itens.filter((s) => s.situacao === situacao)
  if (municipio && municipio !== 'all') {
    const q = municipio.toLowerCase()
    itens = itens.filter((s) => s.municipio_exercicio.toLowerCase().includes(q))
  }

  const total = itens.length
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * POR_PAGINA
  const dados = itens.slice(inicio, inicio + POR_PAGINA)

  const resumo = (mockServidores as ServidoresResponse).resumo

  return {
    meta: {
      endpoint: '/app/v2/pessoal/remuneracao',
      ano: filtros.ano ?? (mockServidores as ServidoresResponse).meta.ano,
      mes: filtros.mes ?? (mockServidores as ServidoresResponse).meta.mes,
      atualizado_em: (mockServidores as ServidoresResponse).meta.atualizado_em,
      total_registros: total,
      pagina_atual: paginaAtual,
      total_paginas: totalPaginas,
    },
    resumo,
    data: dados,
  }
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
