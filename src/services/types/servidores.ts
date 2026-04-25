export interface ServidorItem {
  id: number
  matricula: string
  nome: string
  orgao: string
  orgao_codigo: string
  cargo: string
  nivel: string
  vinculo: 'Estatutário' | 'Comissionado' | 'Temporário'
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
    por_vinculo: VinculoResumo[]
  }
  data: ServidorItem[]
}
