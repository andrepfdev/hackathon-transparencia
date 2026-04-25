export interface ReceitaItem {
  id: number
  data: string
  natureza: string
  natureza_cidadao: string
  descricao: string
  descricao_cidadao: string
  orgao: string
  valor: number
}

export interface ReceitaPorNatureza {
  codigo: string
  nome: string
  nome_cidadao: string
  valor_previsto: number
  valor_arrecadado: number
  percentual: number
}

export interface ReceitasResponse {
  meta: {
    endpoint: string
    ano: number
    atualizado_em: string
    total_registros: number
  }
  resumo: {
    total_previsto: number
    total_arrecadado: number
    percentual_execucao: number
    moeda: string
  }
  por_natureza: ReceitaPorNatureza[]
  data: ReceitaItem[]
}
