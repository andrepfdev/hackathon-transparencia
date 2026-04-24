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
  programa: string
  natureza: string
  valor_empenhado: number
  valor_liquidado: number
  valor_pago: number
  situacao: 'Pago' | 'Pendente' | 'Cancelado'
}

export interface DespesasPorFuncao {
  codigo: string
  nome: string
  nome_cidadao: string
  valor_pago: number
  percentual: number
}

export interface DespesasResumo {
  total_empenhado: number
  total_liquidado: number
  total_pago: number
  moeda: string
}

export interface DespesasResponse {
  meta: {
    endpoint: string
    ano: number
    atualizado_em: string
    total_registros: number
    pagina_atual: number
    total_paginas: number
  }
  resumo: DespesasResumo
  por_funcao: DespesasPorFuncao[]
  data: DespesaItem[]
}
