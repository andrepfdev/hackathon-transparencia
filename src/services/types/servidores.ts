export interface ServidorItem {
  id: number
  matricula: string
  nome: string
  orgao: string
  orgao_codigo: string
  cargo: string
  nivel: string
  vinculo: 'Estatutário' | 'Comissionado' | 'Temporário'
  situacao: 'Ativo' | 'Inativo' | 'Aposentado'
  mes: string
  lotacao: string
  remuneracao_bruta: number
  descontos: number
  remuneracao_liquida: number
  municipio_exercicio: string
}

export interface VinculoResumo {
  vinculo: string
  nome_cidadao: string
  quantidade: number
  percentual: number
}

export interface OrgaoResumo {
  orgao: string
  orgao_codigo: string
  quantidade: number
  total_folha: number
}

export interface ServidoresResponse {
  meta: {
    endpoint: string
    ano: number
    mes: string
    atualizado_em: string
    total_registros: number
    pagina_atual: number
    total_paginas: number
  }
  resumo: {
    total_servidores: number
    total_folha: number
    media_salarial: number
    por_vinculo: VinculoResumo[]
    por_orgao_top5: OrgaoResumo[]
  }
  data: ServidorItem[]
}

export interface ServidorFiltros {
  ano?: number
  mes?: string
  nome?: string
  orgao?: string
  cargo?: string
  vinculo?: string
  situacao?: string
  municipio?: string
  pagina?: number
}
