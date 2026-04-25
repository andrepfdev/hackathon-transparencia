/**
 * Glossário de termos do Portal da Transparência MA para uso como contexto do Gemini.
 * Baseado no Thesaurus oficial do hackathon (.claude/desafio-hackathon/).
 */

export const TERMOS_TECNICOS: Record<string, string> = {
  'natureza da receita': 'de onde vem o dinheiro',
  'natureza de despesa': 'tipo de gasto',
  'unidade gestora': 'secretaria ou órgão responsável',
  'ug': 'secretaria ou órgão responsável',
  'empenho': 'compromisso de pagamento',
  'liquidação': 'confirmação de entrega do serviço',
  'extraorçamentário': 'pagamento fora do orçamento anual',
  'subfunção': 'área de atuação',
  'cnpj do fornecedor': 'empresa contratada',
  'modalidade licitatória': 'como a compra foi feita',
  'estatutário': 'concursado (efetivo)',
  'comissionado': 'cargo de confiança',
  'temporário': 'contrato temporário',
  'fonte de recurso': 'origem do dinheiro usado',
  'programa': 'programa de governo',
  'ação': 'atividade do programa',
  'função': 'área de política pública',
  'categoria econômica': 'natureza do gasto (custeio ou investimento)',
  'pago': 'pagamento realizado',
  'pendente': 'aguardando pagamento',
  'cancelado': 'pagamento cancelado',
  'remuneração bruta': 'salário antes dos descontos',
  'remuneração líquida': 'salário após os descontos',
  'valor empenhado': 'valor comprometido',
  'valor liquidado': 'valor com serviço confirmado',
  'valor pago': 'valor efetivamente pago',
  'fpe': 'repasse federal ao Maranhão',
  'icms': 'imposto sobre compras e serviços',
  'ipva': 'imposto sobre veículos',
  'itcd': 'imposto sobre herança e doações',
  'pregão eletrônico': 'compra feita pela internet com competição de preços',
  'dispensa de licitação': 'compra direta sem concorrência (valor pequeno ou urgência)',
  'concorrência pública': 'licitação para contratos de grande valor',
  'tomada de preços': 'licitação para contratos de médio valor',
  'contrato administrativo': 'acordo formal entre governo e empresa',
  'vigência': 'período de validade do contrato',
}

// Frases e palavras que indicam cada tipo de consulta
export const INTENCOES = {
  despesas: [
    'gastos', 'despesas', 'pagamentos', 'empenhos', 'quanto foi gasto',
    'quanto gastou', 'gasto com', 'pagou', 'quanto pagou', 'despendeu',
    'orçamento executado', 'valor pago', 'investimento', 'custo',
  ],
  servidores: [
    'servidores', 'funcionários', 'servidores públicos', 'salários',
    'remuneração', 'salário', 'quanto ganha', 'quanto ganham',
    'quadro de pessoal', 'efetivos', 'concursados', 'comissionados',
    'cargos', 'trabalhadores', 'empregados públicos', 'pessoal',
    'folha de pagamento', 'contracheque', 'rendimento',
  ],
  contratos: [
    'contratos', 'licitações', 'licitação', 'compras', 'empresas contratadas',
    'fornecedores', 'contratação', 'pregão', 'concorrência', 'dispensa',
    'objeto', 'modalidade', 'vigência', 'acordo', 'empresa',
  ],
  receitas: [
    'receitas', 'arrecadação', 'arrecadou', 'de onde vem o dinheiro',
    'impostos', 'tributos', 'receita', 'fpe', 'icms', 'quanto arrecadou',
    'entrada de dinheiro', 'previsão', 'previsto', 'orçamento de receita',
  ],
} as const

// Filtros disponíveis por categoria de dados
export const CAMPOS_FILTRO = {
  despesas: {
    ano: 'ano do orçamento (ex: 2024, 2025)',
    funcao: 'área de política pública (ex: Saúde, Educação, Segurança)',
    natureza: 'tipo de gasto',
    ug: 'código da secretaria/órgão',
    fornecedor: 'nome ou CNPJ da empresa',
    situacao: 'Pago | Pendente | Cancelado',
    subfuncao: 'subárea de atuação',
    acao: 'atividade específica do programa',
    fonte: 'origem do recurso',
    programa: 'programa de governo',
    categoria: 'categoria econômica',
  },
  servidores: {
    ano: 'ano de referência',
    mes: 'mês de referência',
    nome: 'nome do servidor',
    orgao: 'órgão ou secretaria',
    cargo: 'cargo ou função',
    vinculo: 'Estatutário | Comissionado | Temporário',
    situacao: 'Ativo | Inativo | Aposentado',
    municipio: 'município de exercício',
  },
  contratos: {
    ano: 'ano de assinatura',
    situacao: 'Vigente | Encerrado | Suspenso',
    modalidade: 'como a compra foi feita',
  },
  receitas: {
    ano: 'ano de referência',
  },
} as const

// Funções do orçamento (valores reais dos mocks)
export const FUNCOES_ORCAMENTO = [
  { codigo: '10', nome: 'Saúde', sinonimos: ['saúde', 'hospital', 'médico', 'medicamento', 'sus'] },
  { codigo: '12', nome: 'Educação', sinonimos: ['educação', 'escola', 'ensino', 'professor', 'aluno'] },
  { codigo: '06', nome: 'Segurança Pública', sinonimos: ['segurança', 'polícia', 'pm', 'policia'] },
  { codigo: '08', nome: 'Assistência Social', sinonimos: ['assistência', 'social', 'cras', 'vulnerável'] },
  { codigo: '15', nome: 'Urbanismo', sinonimos: ['urbanismo', 'obras', 'infraestrutura', 'cidade'] },
  { codigo: '26', nome: 'Transporte', sinonimos: ['transporte', 'estrada', 'rodovia', 'ônibus'] },
  { codigo: '04', nome: 'Administração', sinonimos: ['administração', 'gestão', 'governo'] },
  { codigo: '20', nome: 'Agricultura', sinonimos: ['agricultura', 'agro', 'campo', 'rural'] },
]

export type TipoIntencao = keyof typeof INTENCOES
