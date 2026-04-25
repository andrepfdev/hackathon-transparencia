export interface ContratoItem {
  id: number
  numero: string
  objeto: string
  objeto_resumido: string
  fornecedor_nome: string
  fornecedor_doc: string
  orgao: string
  modalidade: string
  modalidade_cidadao: string
  data_inicio: string
  data_fim: string
  valor: number
  situacao: 'Vigente' | 'Encerrado' | 'Suspenso'
}

export interface ContratosResponse {
  meta: {
    endpoint: string
    ano: number
    atualizado_em: string
    total_registros: number
    pagina_atual: number
    total_paginas: number
  }
  resumo: {
    total_contratos: number
    valor_total: number
    por_situacao: { situacao: string; quantidade: number; valor: number }[]
  }
  data: ContratoItem[]
}
