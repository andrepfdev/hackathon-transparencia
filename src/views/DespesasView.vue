<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import SatisfactionSurvey from '@/components/SatisfactionSurvey.vue'
import Checkbox from 'primevue/checkbox'
import ToggleSwitch from 'primevue/toggleswitch'
import { filtrarDespesas, type DespesaFiltros } from '@/services/portalApi'
import type { DespesasResponse } from '@/services/types/despesas'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const resultado = ref<DespesasResponse | null>(null)

// --- Opções de filtro ---
const anos = [2026, 2025, 2024, 2023, 2022]
const diasOpcoes = ['7 dias', '15 dias', '30 dias', '60 dias', '90 dias']
const visualizacaoOpcoes = [
  'Unidade Gestora - UG',
  'Função',
  'Natureza das despesas',
  'Subfunção',
  'Programa',
  'Ação',
  'Fornecedor/Credor',
]
const outraInfoOpcoes = [
  'Ordens Bancárias por Lote: Lista de Beneficiários',
  'Convênios: Lista de Convênios',
  'Diárias: Lista de Beneficiários',
]
const ugs = [
  { codigo: 'all', nome: 'Todos' },
  { codigo: '10101', nome: '10101 - ALEMA - Assembleia Legislativa do Maranhão' },
  { codigo: '20101', nome: '20101 - Tribunal de Contas do Estado' },
  { codigo: '40101', nome: '40101 - Tribunal de Justiça do Estado' },
  { codigo: '110201', nome: '110201 - Secretaria de Saúde do Estado' },
  { codigo: '110301', nome: '110301 - Secretaria de Educação' },
  { codigo: '110401', nome: '110401 - Secretaria de Segurança Pública' },
  { codigo: '110501', nome: '110501 - Secretaria de Infraestrutura e Habitação' },
  { codigo: '110601', nome: '110601 - Secretaria de Administração' },
  { codigo: '110701', nome: '110701 - Secretaria de Desenvolvimento Social' },
  { codigo: '110801', nome: '110801 - Secretaria de Agricultura, Pecuária e Pesca' },
]
const categorias = ['Todas', '3 - Despesas Correntes', '4 - Despesas de Capital']
const naturezas = ['Todos', 'Material de Consumo', 'Equipamentos e Material Permanente', 'Obras e Instalações', 'Outros Serviços de Terceiros - PJ', 'Outros Serviços de Terceiros - PF', 'Transferências a Instituições Privadas sem Fins Lucrativos']
const funcoes = ['Todos', 'Saúde', 'Educação', 'Segurança Pública', 'Urbanismo', 'Administração', 'Transporte', 'Assistência Social', 'Agricultura']
const subfuncoes = ['Todos', 'Atenção Básica', 'Assistência Hospitalar e Ambulatorial', 'Vigilância Sanitária', 'Ensino Fundamental', 'Ensino Médio', 'Educação de Jovens e Adultos', 'Policiamento', 'Defesa Civil', 'Administração Geral', 'Judiciária', 'Controle Externo', 'Infraestrutura Urbana', 'Saneamento Básico', 'Transporte Rodoviário', 'Extensão Rural', 'Assistência à Criança e ao Adolescente']
const acoes = ['Todos', '1001 - Construção, Ampliação e Revitalização de Vias Urbanas', '1002 - Construção, Ampliação e Reforma de Escolas Estaduais', '1010 - Construção, Pavimentação e Restauração de Rodovias', '1020 - Obras de Saneamento Básico e Drenagem', '2001 - Manutenção das Atividades Administrativas e Gerenciais', '2025 - Atendimento Ambulatorial, Emergencial e Hospitalar', '2026 - Vigilância em Saúde', '2030 - Manutenção e Desenvolvimento do Ensino Fundamental', '2031 - Manutenção e Desenvolvimento do Ensino Médio', '2035 - Apoio à Educação de Jovens e Adultos', '2051 - Modernização e Manutenção da Estrutura de Controle', '2060 - Modernização e Manutenção da Estrutura Judiciária', '2080 - Reaparelhamento e Modernização das Forças de Segurança', '2090 - Apoio às Entidades Assistenciais e Comunitárias', '2100 - Fomento à Produção Agropecuária']
const fontes = ['Todas', '100 - Recursos Próprios', '150 - Transferências da União - SUS', '151 - Transferências da União - FUNDEB', '200 - Recursos Vinculados', '210 - Royalties e Participações Especiais']
const programas = ['Todos', 'Atenção à Saúde', 'Educação de Qualidade', 'Segurança com Cidadania', 'Obras e Urbanização', 'Gestão Legislativa', 'Fortalecimento do Controle Externo', 'Modernização do Poder Judiciário', 'Melhoria da Malha Viária', 'Gestão dos Recursos Públicos', 'Saneamento Ambiental e Habitação', 'Proteção Social Básica', 'Desenvolvimento do Agronegócio Maranhense']

// --- Estado do formulário ---
const periodoTipo = ref<'ano' | 'periodo' | 'dias'>('ano')
const ultimosDias = ref('30 dias')
const dataInicio = ref('')
const dataFim = ref('')
const visualizacao = ref('Unidade Gestora - UG')
const outraInfo = ref('')

const filtros = ref<DespesaFiltros>({
  ano: 2025,
  funcao: 'all',
  natureza: 'all',
  ug: 'all',
  fornecedor: '',
  situacao: 'all',
  subfuncao: 'all',
  acao: 'all',
  fonte: 'all',
  programa: 'all',
  categoria: 'all',
  pagina: 1,
})

// --- Modo de consulta ---
const modoConsulta = ref<'simplificado' | 'avancado'>('simplificado')
const modoSimplificado = computed({
  get: () => modoConsulta.value === 'simplificado',
  set: (v) => { if (v) modoConsulta.value = 'simplificado' },
})
const modoAvancado = computed({
  get: () => modoConsulta.value === 'avancado',
  set: (v) => { if (v) modoConsulta.value = 'avancado' },
})

// --- ToggleSwitches exclusivos: Período ---
const periodoAno = computed({
  get: () => periodoTipo.value === 'ano',
  set: (v) => { if (v) periodoTipo.value = 'ano' },
})
const periodoPeriodo = computed({
  get: () => periodoTipo.value === 'periodo',
  set: (v) => { if (v) periodoTipo.value = 'periodo' },
})
const periodoDias = computed({
  get: () => periodoTipo.value === 'dias',
  set: (v) => { if (v) periodoTipo.value = 'dias' },
})

// --- ToggleSwitches exclusivos: Situação ---
const sitTodos = computed({
  get: () => filtros.value.situacao === 'all',
  set: (v) => { if (v) filtros.value.situacao = 'all' },
})
const sitPagos = computed({
  get: () => filtros.value.situacao === 'Pago',
  set: (v) => { if (v) filtros.value.situacao = 'Pago' },
})
const sitNaoPagos = computed({
  get: () => filtros.value.situacao === 'Pendente',
  set: (v) => { if (v) filtros.value.situacao = 'Pendente' },
})

// --- Controles da tabela ---
const buscaTabela = ref('')
const itensPorPagina = ref('10')
const ordenarPor = ref('Data')
const ordemDir = ref('Decrescente')

// --- Chips de filtros utilizados ---
const ugNome = computed(() => ugs.find((u) => u.codigo === filtros.value.ug)?.nome.split(' - ').slice(1).join(' - ') || 'Todos')

const filtrosAtivos = computed(() => {
  const chips: { label: string; valor: string; campo: keyof DespesaFiltros }[] = []
  if (filtros.value.ug && filtros.value.ug !== 'all') chips.push({ label: 'Unidade', valor: ugNome.value, campo: 'ug' })
  if (filtros.value.funcao && filtros.value.funcao !== 'all') chips.push({ label: 'Função', valor: filtros.value.funcao, campo: 'funcao' })
  if (filtros.value.natureza && filtros.value.natureza !== 'all') chips.push({ label: 'Natureza', valor: filtros.value.natureza, campo: 'natureza' })
  if (filtros.value.categoria && filtros.value.categoria !== 'all') chips.push({ label: 'Categoria', valor: filtros.value.categoria, campo: 'categoria' })
  if (filtros.value.programa && filtros.value.programa !== 'all') chips.push({ label: 'Programa', valor: filtros.value.programa, campo: 'programa' })
  if (filtros.value.subfuncao && filtros.value.subfuncao !== 'all') chips.push({ label: 'Subfunção', valor: filtros.value.subfuncao, campo: 'subfuncao' })
  if (filtros.value.acao && filtros.value.acao !== 'all') chips.push({ label: 'Ação', valor: filtros.value.acao, campo: 'acao' })
  if (filtros.value.fonte && filtros.value.fonte !== 'all') chips.push({ label: 'Fonte', valor: filtros.value.fonte, campo: 'fonte' })
  if (filtros.value.fornecedor) chips.push({ label: 'Fornecedor', valor: filtros.value.fornecedor, campo: 'fornecedor' })
  return chips
})

function removerFiltro(campo: keyof DespesaFiltros) {
  if (campo === 'fornecedor') filtros.value.fornecedor = ''
  else (filtros.value as Record<string, unknown>)[campo] = 'all'
  aplicarFiltros()
}

// --- Lógica de dados ---
function fromQuery() {
  const q = route.query
  filtros.value = {
    ano: q.ano ? Number(q.ano) : 2025,
    funcao: (q.funcao as string) || 'all',
    natureza: (q.natureza_despesas as string) || 'all',
    situacao: mapSituacaoFromUrl(q.filtros_pagos_n as string),
    fornecedor: (q.fornecedor_credor as string) || '',
    ug: (q.ug as string) || 'all',
    subfuncao: (q.subfuncao as string) || 'all',
    acao: (q.acao as string) || 'all',
    fonte: (q.fonte as string) || 'all',
    programa: (q.programa as string) || 'all',
    categoria: (q.categoria_despesas as string) || 'all',
    pagina: q.pagina ? Number(q.pagina) : 1,
  }
  if (q.ver_periodo === 'periodo') periodoTipo.value = 'periodo'
  else if (q.ver_periodo === 'dias') periodoTipo.value = 'dias'
  else periodoTipo.value = 'ano'
  if (q.de) dataInicio.value = q.de as string
  if (q.ate) dataFim.value = q.ate as string
  if (q.vizualizacao) visualizacao.value = q.vizualizacao as string
}

function mapSituacaoFromUrl(v: string | undefined): string {
  if (!v || v === 'selecao_pagos_e_naoPagos') return 'all'
  if (v === 'selecao_pagos') return 'Pago'
  if (v === 'selecao_nao_pagos') return 'Pendente'
  return v
}

function mapSituacaoToUrl(s: string): string {
  if (!s || s === 'all') return 'selecao_pagos_e_naoPagos'
  if (s === 'Pago') return 'selecao_pagos'
  if (s === 'Pendente') return 'selecao_nao_pagos'
  return s
}

function toQuery() {
  const f = filtros.value
  return {
    ver_periodo: periodoTipo.value,
    ano: String(f.ano ?? 2025),
    de: dataInicio.value,
    ate: dataFim.value,
    vizualizacao: visualizacao.value,
    filtros_pagos_n: mapSituacaoToUrl(f.situacao ?? 'all'),
    ug: f.ug || 'all',
    categoria_despesas: f.categoria || 'all',
    natureza_despesas: f.natureza || 'all',
    funcao: f.funcao || 'all',
    programa: f.programa || 'all',
    fornecedor_credor: f.fornecedor || '',
    subfuncao: f.subfuncao || 'all',
    acao: f.acao || 'all',
    fonte: f.fonte || 'all',
    pagina: String(f.pagina ?? 1),
  }
}

const pesquisado = ref(false)

async function buscar() {
  loading.value = true
  try {
    resultado.value = await filtrarDespesas(filtros.value)
  } finally {
    loading.value = false
  }
}

function aplicarFiltros() {
  filtros.value.pagina = 1
  pesquisado.value = true
  router.push({ query: toQuery() })
  buscar()
}

function limparFiltros() {
  filtros.value = {
    ano: 2025,
    funcao: 'all',
    natureza: 'all',
    ug: 'all',
    fornecedor: '',
    situacao: 'all',
    subfuncao: 'all',
    acao: 'all',
    fonte: 'all',
    programa: 'all',
    categoria: 'all',
    pagina: 1,
  }
  periodoTipo.value = 'ano'
  dataInicio.value = ''
  dataFim.value = ''
  visualizacao.value = 'Unidade Gestora - UG'
  pesquisado.value = false
  resultado.value = null
  router.push({ query: {} })
}

function irPagina(p: number) {
  filtros.value.pagina = p
  router.push({ query: toQuery() })
  buscar()
}

// Só sincroniza o formulário com a URL (back/forward do browser), sem buscar
watch(() => route.query, () => { fromQuery() })
onMounted(() => { fromQuery() })

// --- Computed ---
const totalPages = computed(() => resultado.value?.meta.total_paginas ?? 1)
const currentPage = computed(() => resultado.value?.meta.pagina_atual ?? 1)
const totalRecords = computed(() => resultado.value?.meta.total_registros ?? 0)

const dadosFiltradosBusca = computed(() => {
  if (!resultado.value) return []
  const q = buscaTabela.value.toLowerCase().trim()
  if (!q) return resultado.value.data
  return resultado.value.data.filter(
    (d) =>
      d.numero_empenho.toLowerCase().includes(q) ||
      d.unidade_gestora.toLowerCase().includes(q) ||
      d.fornecedor_nome.toLowerCase().includes(q) ||
      d.funcao.toLowerCase().includes(q),
  )
})

const paginasVisiveis = computed(() => {
  const total = totalPages.value
  const atual = currentPage.value
  const inicio = Math.max(1, atual - 2)
  const fim = Math.min(total, atual + 2)
  const paginas: number[] = []
  for (let i = inicio; i <= fim; i++) paginas.push(i)
  return paginas
})

// --- Utilitários ---
function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

function formatDate(d: string) {
  if (!d) return '-'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

function situacaoBadge(s: string) {
  if (s === 'Pago') return 'bg-green-100 text-green-800'
  if (s === 'Pendente') return 'bg-yellow-100 text-yellow-800'
  if (s === 'Cancelado') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-700'
}

// --- Exportação ---
function exportarCSV() {
  if (!resultado.value) return
  const dados = dadosFiltradosBusca.value
  const headers = ['Nº Documento', 'Data', 'Unidade Gestora', 'Fornecedor', 'CNPJ/CPF', 'Função', 'Subfunção', 'Programa', 'Ação', 'Natureza', 'Reservado (R$)', 'Confirmado (R$)', 'Pago (R$)', 'Situação']
  const linhas = dados.map((d) => [
    d.numero_empenho,
    d.data_empenho,
    `"${d.unidade_gestora}"`,
    `"${d.fornecedor_nome}"`,
    d.fornecedor_doc,
    d.funcao,
    d.subfuncao,
    `"${d.programa}"`,
    `"${d.acao}"`,
    `"${d.natureza}"`,
    d.valor_empenhado.toFixed(2).replace('.', ','),
    d.valor_liquidado.toFixed(2).replace('.', ','),
    d.valor_pago.toFixed(2).replace('.', ','),
    d.situacao,
  ])
  const csv = [headers, ...linhas].map((r) => r.join(';')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `despesas-ma-${filtros.value.ano ?? 2025}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function exportarXLS() {
  alert('Exportação em XLS será disponibilizada em breve.')
}

function exportarPDF() {
  window.print()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 print:bg-white">
    <AppHeader class="print:hidden" />

    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200 print:hidden">
      <div class="container mx-auto px-4 py-3 text-sm text-gray-500">
        <router-link to="/" class="hover:text-blue-700 hover:underline">Página Principal</router-link>
        <span class="mx-2" aria-hidden="true">/</span>
        <span>Explore</span>
        <span class="mx-2" aria-hidden="true">/</span>
        <span class="text-gray-800 font-medium" aria-current="page">Despesas</span>
      </div>
    </div>

    <main id="main-content" class="flex-1">
      <div class="container mx-auto px-4 py-6 space-y-6">

        <!-- Título -->
        <div>
          <h1 class="text-2xl font-bold text-red-700">Despesas</h1>
          <p class="text-sm text-gray-600 mt-1">
            Preencha os campos, seguindo a ordem e faça a pesquisa.
            <span class="ml-3 text-xs text-gray-400">
              Dados até: {{ resultado?.meta.atualizado_em ? formatDate(resultado.meta.atualizado_em) : '—' }}
            </span>
          </p>
        </div>

        <!-- Formulário de filtros -->
        <form class="bg-white border border-gray-200 rounded-lg p-5" @submit.prevent="aplicarFiltros" novalidate>
          <!-- Seletor de modo -->
          <div class="flex items-center gap-5 mb-6">
            <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
              <Checkbox v-model="modoSimplificado" :binary="true" aria-label="Consulta Simplificada" />
              Consulta Simplificada
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
              <Checkbox v-model="modoAvancado" :binary="true" aria-label="Consulta Avançada" />
              Consulta Avançada
            </label>
          </div>

          <!-- Consulta Simplificada -->
          <div v-if="modoConsulta === 'simplificado'" class="flex flex-col gap-4 max-w-md">
            <!-- Período -->
            <div>
              <label class="block text-xs text-gray-600 mb-2">Período</label>
              <div class="flex flex-wrap gap-4 mb-3">
                <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <ToggleSwitch v-model="periodoAno" aria-label="Ver por Ano" />
                  Ano
                </label>
                <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <ToggleSwitch v-model="periodoPeriodo" aria-label="Ver por Período" />
                  Período
                </label>
                <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <ToggleSwitch v-model="periodoDias" aria-label="Ver por Últimos dias" />
                  Últimos dias
                </label>
              </div>
              <div v-if="periodoTipo === 'ano'">
                <label class="block text-xs text-gray-600 mb-1">Ano</label>
                <select
                  v-model="filtros.ano"
                  class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>
              <div v-else-if="periodoTipo === 'dias'">
                <label class="block text-xs text-gray-600 mb-1">Últimos dias</label>
                <select
                  v-model="ultimosDias"
                  class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <option v-for="d in diasOpcoes" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
              <div v-else-if="periodoTipo === 'periodo'" class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Data inicial</label>
                  <input
                    type="date"
                    v-model="dataInicio"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-blue-600"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Data final</label>
                  <input
                    type="date"
                    v-model="dataFim"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-blue-600"
                  />
                </div>
              </div>
            </div>
            <!-- Unidade Gestora -->
            <div>
              <label class="block text-xs text-gray-600 mb-1">Visualizar por</label>
              <select
                  v-model="visualizacao"
                  class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <option v-for="v in visualizacaoOpcoes" :key="v" :value="v">{{ v }}</option>
                </select>
            </div>
            <!-- Situação -->
            <div>
              <label class="block text-xs text-gray-600 mb-2">Situação</label>
              <div class="flex flex-wrap gap-4">
                <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <ToggleSwitch v-model="sitTodos" aria-label="Mostrar todos" />
                  Todos
                </label>
                <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <ToggleSwitch v-model="sitPagos" aria-label="Mostrar apenas pagos" />
                  Pagos
                </label>
                <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <ToggleSwitch v-model="sitNaoPagos" aria-label="Mostrar apenas não pagos" />
                  Não Pagos
                </label>
              </div>
            </div>
          </div>

          <!-- Consulta Avançada -->
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-0">

            <!-- Coluna esquerda: seções 1–4 -->
            <div class="space-y-6">

              <!-- 1. Período -->
              <fieldset>
                <legend class="text-sm font-semibold text-gray-700 mb-3">1. Período</legend>
                <p class="text-xs text-gray-500 mb-2">Ver busca por:</p>
                <div class="flex flex-wrap gap-5 mb-3">
                  <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <ToggleSwitch v-model="periodoAno" aria-label="Ver por Ano" />
                    Ano
                  </label>
                  <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <ToggleSwitch v-model="periodoPeriodo" aria-label="Ver por Período" />
                    Período
                  </label>
                  <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <ToggleSwitch v-model="periodoDias" aria-label="Ver por Últimos dias" />
                    Últimos dias
                  </label>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div v-if="periodoTipo === 'ano'">
                    <label class="block text-xs text-gray-600 mb-1">Ano</label>
                    <select
                      v-model="filtros.ano"
                      class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
                    </select>
                  </div>
                  <div v-if="periodoTipo === 'dias'">
                    <label class="block text-xs text-gray-600 mb-1">Últimos dias</label>
                    <select
                      v-model="ultimosDias"
                      class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      <option v-for="d in diasOpcoes" :key="d" :value="d">{{ d }}</option>
                    </select>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label class="block text-xs text-gray-600 mb-1">Escolha a data inicial</label>
                    <input
                      type="date"
                      v-model="dataInicio"
                      class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600 mb-1">Data final</label>
                    <input
                      type="date"
                      v-model="dataFim"
                      class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-blue-600"
                    />
                  </div>
                </div>
              </fieldset>

              <!-- 2. Visualização -->
              <fieldset>
                <legend class="text-sm font-semibold text-gray-700 mb-3">2. Visualização</legend>
                <label class="block text-xs text-gray-600 mb-1">Visualizar por</label>
                <select
                  v-model="visualizacao"
                  class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <option v-for="v in visualizacaoOpcoes" :key="v" :value="v">{{ v }}</option>
                </select>
              </fieldset>

              <!-- 3. Outros filtros -->
              <fieldset>
                <legend class="text-sm font-semibold text-gray-700 mb-3">3. Outros filtros</legend>
                <div class="flex flex-wrap gap-5">
                  <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <ToggleSwitch v-model="sitPagos" aria-label="Mostrar apenas pagos" />
                    Pagos
                  </label>
                  <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <ToggleSwitch v-model="sitNaoPagos" aria-label="Mostrar apenas não pagos" />
                    Não Pagos
                  </label>
                  <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <ToggleSwitch v-model="sitTodos" aria-label="Mostrar todos" />
                    Todos
                  </label>
                </div>
              </fieldset>

              <!-- 4. Outras Informações -->
              <fieldset>
                <legend class="text-sm font-semibold text-gray-700 mb-3">4. Outras Informações</legend>
                <select
                  v-model="outraInfo"
                  class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <option value="">Selecione...</option>
                  <option v-for="o in outraInfoOpcoes" :key="o" :value="o">{{ o }}</option>
                </select>
              </fieldset>
            </div>

            <!-- Coluna direita: seção 5 -->
            <div>
              <p class="text-sm font-semibold text-gray-700 mb-3">5. Dados gerais</p>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Unidade</label>
                  <select
                    v-model="filtros.ug"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <option v-for="u in ugs" :key="u.codigo" :value="u.codigo">{{ u.nome }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Categoria das despesas</label>
                  <select
                    v-model="filtros.categoria"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <option value="all">Todas</option>
                    <option v-for="c in categorias.slice(1)" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Natureza das despesas</label>
                  <select
                    v-model="filtros.natureza"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <option value="all">Todos</option>
                    <option v-for="n in naturezas.slice(1)" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Função</label>
                  <select
                    v-model="filtros.funcao"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <option value="all">Todos</option>
                    <option v-for="f in funcoes.slice(1)" :key="f" :value="f">{{ f }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Programa</label>
                  <select
                    v-model="filtros.programa"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <option value="all">Todos</option>
                    <option v-for="p in programas.slice(1)" :key="p" :value="p">{{ p }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Fornecedor / Credor</label>
                  <input
                    type="text"
                    v-model="filtros.fornecedor"
                    placeholder="Nome ou CNPJ..."
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-blue-600"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Subfunção</label>
                  <select
                    v-model="filtros.subfuncao"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <option value="all">Todos</option>
                    <option v-for="s in subfuncoes.slice(1)" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Ação</label>
                  <select
                    v-model="filtros.acao"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <option value="all">Todos</option>
                    <option v-for="a in acoes.slice(1)" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Fonte</label>
                  <select
                    v-model="filtros.fonte"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <option value="all">Todas</option>
                    <option v-for="f in fontes.slice(1)" :key="f" :value="f">{{ f }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Botões de ação -->
          <div class="grid grid-cols-2 gap-3 mt-6">
            <button
              type="submit"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold rounded py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-red-600"
              :disabled="loading"
            >
              {{ loading ? 'Pesquisando...' : 'Pesquisar' }}
            </button>
            <button
              type="button"
              class="bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-gray-500"
              @click="limparFiltros"
            >
              Limpar pesquisa
            </button>
          </div>
        </form>

        <!-- Resultado da pesquisa -->
        <section v-if="pesquisado" aria-label="Resultado da pesquisa" aria-live="polite">
          <h2 class="text-lg font-bold text-gray-800 mb-3">Resultado da pesquisa</h2>

          <!-- Filtros utilizados -->
          <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-4">
            <p class="text-xs font-semibold text-gray-500 mb-2">Filtros utilizados</p>
            <div class="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600">
              <span>Visualização: <strong class="text-red-700">{{ visualizacao }}</strong></span>
              <span>Ação: <strong>{{ filtros.acao === 'all' ? 'todos' : filtros.acao }}</strong></span>
              <span>SubFunção: <strong>{{ filtros.subfuncao === 'all' ? 'todos' : filtros.subfuncao }}</strong></span>
              <span>Fornecedor: <strong>{{ filtros.fornecedor || 'Não cadastrado' }}</strong></span>
            </div>
            <div class="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600 mt-1">
              <span class="flex items-center gap-1">
                Unidade:
                <strong class="flex items-center gap-1">
                  {{ ugNome }}
                  <button
                    v-if="filtros.ug !== 'all'"
                    class="text-red-600 hover:text-red-800 font-bold"
                    aria-label="Remover filtro de unidade"
                    @click="removerFiltro('ug')"
                  >×</button>
                </strong>
              </span>
              <span>Natureza: <strong>{{ filtros.natureza === 'all' ? 'todos' : filtros.natureza }}</strong></span>
              <span>Função: <strong>{{ filtros.funcao === 'all' ? 'todos' : filtros.funcao }}</strong></span>
              <span>Programa: <strong>{{ filtros.programa === 'all' ? 'todos' : filtros.programa }}</strong></span>
              <span>Fonte: <strong>{{ filtros.fonte === 'all' ? 'todas' : filtros.fonte }}</strong></span>
            </div>
            <!-- Chips de filtros ativos removíveis -->
            <div v-if="filtrosAtivos.length > 0" class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="chip in filtrosAtivos"
                :key="chip.campo"
                class="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 rounded-full px-2 py-0.5 text-xs"
              >
                {{ chip.label }}: {{ chip.valor }}
                <button
                  class="hover:text-red-900 font-bold"
                  :aria-label="`Remover filtro ${chip.label}`"
                  @click="removerFiltro(chip.campo)"
                >×</button>
              </span>
            </div>
          </div>

          <!-- Cards de resumo (estilo portal) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div class="bg-red-700 text-white rounded-lg p-4 text-center">
              <p class="text-sm font-semibold uppercase tracking-wide opacity-90">Reservado</p>
              <p class="text-xl font-bold mt-1">
                {{ resultado ? formatBRL(resultado.resumo.total_empenhado) : '—' }}
              </p>
              <p class="text-xs opacity-70 mt-0.5">Empenho</p>
            </div>
            <div class="bg-red-700 text-white rounded-lg p-4 text-center">
              <p class="text-sm font-semibold uppercase tracking-wide opacity-90">Confirmado</p>
              <p class="text-xl font-bold mt-1">
                {{ resultado ? formatBRL(resultado.resumo.total_liquidado) : '—' }}
              </p>
              <p class="text-xs opacity-70 mt-0.5">Liquidação</p>
            </div>
            <div class="bg-red-700 text-white rounded-lg p-4 text-center">
              <p class="text-sm font-semibold uppercase tracking-wide opacity-90">Pago</p>
              <p class="text-xl font-bold mt-1">
                {{ resultado ? formatBRL(resultado.resumo.total_pago) : '—' }}
              </p>
              <p class="text-xs opacity-70 mt-0.5">Pagamento</p>
            </div>
          </div>

          <!-- Controles da tabela + exportação -->
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div class="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-100 text-sm print:hidden">
              <label class="text-gray-600 text-xs">Exibir</label>
              <select
                v-model="itensPorPagina"
                class="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <label class="text-gray-600 text-xs ml-1">Ordenar</label>
              <select
                v-model="ordenarPor"
                class="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
              >
                <option>Data</option>
                <option>Unidade Gestora</option>
                <option>Reservado</option>
                <option>Pago</option>
              </select>
              <select
                v-model="ordemDir"
                class="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
              >
                <option>Crescente</option>
                <option>Decrescente</option>
              </select>
              <input
                v-model="buscaTabela"
                type="text"
                placeholder="Busca resultados..."
                class="border border-gray-300 rounded px-2 py-1 text-xs flex-1 min-w-[120px]"
                aria-label="Buscar dentro dos resultados"
              />
              <div class="flex gap-1 ml-auto">
                <button
                  class="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 font-medium"
                  title="Exportar XLS"
                  @click="exportarXLS"
                >
                  XLS
                </button>
                <button
                  class="px-2 py-1 text-xs border border-green-600 text-green-700 rounded hover:bg-green-50 font-medium"
                  title="Exportar CSV"
                  @click="exportarCSV"
                >
                  CSV
                </button>
                <button
                  class="px-2 py-1 text-xs border border-red-600 text-red-700 rounded hover:bg-red-50 font-medium"
                  title="Imprimir / Exportar PDF"
                  @click="exportarPDF"
                >
                  PDF
                </button>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="py-16 flex flex-col items-center gap-3 text-gray-400" aria-busy="true">
              <svg class="animate-spin w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span class="text-sm">Carregando despesas...</span>
            </div>

            <!-- Sem resultados -->
            <div
              v-else-if="dadosFiltradosBusca.length === 0"
              class="py-14 flex flex-col items-center gap-2 text-gray-400"
              role="status"
            >
              <i class="pi pi-search text-3xl" aria-hidden="true"></i>
              <p class="text-sm">Nenhuma despesa encontrada com os filtros selecionados.</p>
            </div>

            <!-- Tabela desktop (md+) e cards mobile, dentro do mesmo v-else -->
            <div v-else>
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full text-sm" aria-label="Despesas do Estado do Maranhão">
                <thead class="bg-gray-50 text-xs text-gray-500 border-b border-gray-200">
                  <tr>
                    <th scope="col" class="px-4 py-3 text-left whitespace-nowrap font-semibold">Nº Documento</th>
                    <th scope="col" class="px-4 py-3 text-left whitespace-nowrap font-semibold">Data</th>
                    <th scope="col" class="px-4 py-3 text-left font-semibold">Unidade Gestora</th>
                    <th scope="col" class="px-4 py-3 text-left font-semibold">Fornecedor / Credor</th>
                    <th scope="col" class="px-4 py-3 text-left whitespace-nowrap font-semibold">Função</th>
                    <th scope="col" class="px-4 py-3 text-right whitespace-nowrap font-semibold text-amber-700">Reservado</th>
                    <th scope="col" class="px-4 py-3 text-right whitespace-nowrap font-semibold text-blue-700">Confirmado</th>
                    <th scope="col" class="px-4 py-3 text-right whitespace-nowrap font-semibold text-green-700">Pago</th>
                    <th scope="col" class="px-4 py-3 text-center font-semibold">Situação</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="item in dadosFiltradosBusca"
                    :key="item.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{{ item.numero_empenho }}</td>
                    <td class="px-4 py-3 text-gray-600 whitespace-nowrap">{{ formatDate(item.data_empenho) }}</td>
                    <td class="px-4 py-3 text-gray-700 max-w-[180px]">
                      <span class="line-clamp-2 leading-snug" :title="item.unidade_gestora">{{ item.unidade_gestora }}</span>
                    </td>
                    <td class="px-4 py-3 text-gray-700 max-w-[180px]">
                      <span class="line-clamp-2 leading-snug" :title="item.fornecedor_nome">{{ item.fornecedor_nome }}</span>
                      <span class="block text-xs text-gray-400 font-mono">{{ item.fornecedor_doc }}</span>
                    </td>
                    <td class="px-4 py-3 text-gray-600 whitespace-nowrap">{{ item.funcao }}</td>
                    <td class="px-4 py-3 text-right text-amber-700 font-medium whitespace-nowrap tabular-nums">
                      {{ formatBRL(item.valor_empenhado) }}
                    </td>
                    <td class="px-4 py-3 text-right text-blue-700 font-medium whitespace-nowrap tabular-nums">
                      {{ formatBRL(item.valor_liquidado) }}
                    </td>
                    <td class="px-4 py-3 text-right text-green-700 font-medium whitespace-nowrap tabular-nums">
                      {{ formatBRL(item.valor_pago) }}
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span
                        class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                        :class="situacaoBadge(item.situacao)"
                      >{{ item.situacao }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Cards mobile (< md) -->
            <div class="md:hidden space-y-3 p-3">
              <div
                v-for="item in dadosFiltradosBusca"
                :key="item.id"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Nº Documento</div>
                  <div class="px-3 py-2 text-xs font-mono text-red-700 font-semibold">{{ item.numero_empenho }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Data</div>
                  <div class="px-3 py-2 text-xs text-gray-700">{{ formatDate(item.data_empenho) }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Unidade</div>
                  <div class="px-3 py-2 text-xs text-gray-700 leading-snug">{{ item.unidade_gestora }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Fornecedor</div>
                  <div class="px-3 py-2 text-xs text-gray-700 leading-snug">
                    {{ item.fornecedor_nome }}
                    <span class="block text-gray-400 font-mono">{{ item.fornecedor_doc }}</span>
                  </div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Função</div>
                  <div class="px-3 py-2 text-xs text-gray-700">{{ item.funcao }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-amber-700">Reservado</div>
                  <div class="px-3 py-2 text-xs text-amber-700 font-semibold tabular-nums">{{ formatBRL(item.valor_empenhado) }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-blue-700">Confirmado</div>
                  <div class="px-3 py-2 text-xs text-blue-700 font-semibold tabular-nums">{{ formatBRL(item.valor_liquidado) }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-green-700">Pago</div>
                  <div class="px-3 py-2 text-xs text-green-700 font-semibold tabular-nums">{{ formatBRL(item.valor_pago) }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Situação</div>
                  <div class="px-3 py-2 text-xs flex items-center">
                    <span
                      class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="situacaoBadge(item.situacao)"
                    >{{ item.situacao }}</span>
                  </div>
                </div>
              </div>
            </div>
            </div>

            <!-- Paginação -->
            <div
              v-if="!loading && totalPages > 1"
              class="px-4 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 print:hidden"
            >
              <p class="text-xs text-gray-500">
                Página {{ currentPage }} de {{ totalPages }} · {{ totalRecords.toLocaleString('pt-BR') }} registros
              </p>
              <nav aria-label="Paginação" class="flex items-center gap-1">
                <button
                  class="px-3 py-1.5 rounded text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="currentPage <= 1"
                  aria-label="Página anterior"
                  @click="irPagina(currentPage - 1)"
                >‹</button>
                <button
                  v-for="p in paginasVisiveis"
                  :key="p"
                  class="px-3 py-1.5 rounded text-sm border transition-colors"
                  :class="p === currentPage ? 'bg-red-600 text-white border-red-600 font-semibold' : 'border-gray-200 hover:bg-gray-50'"
                  :aria-label="`Página ${p}`"
                  :aria-current="p === currentPage ? 'page' : undefined"
                  @click="irPagina(p)"
                >{{ p }}</button>
                <button
                  class="px-3 py-1.5 rounded text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="currentPage >= totalPages"
                  aria-label="Próxima página"
                  @click="irPagina(currentPage + 1)"
                >›</button>
              </nav>
            </div>
          </div>
        </section>
      </div>
    </main>

    <SatisfactionSurvey />
    <AppFooter class="print:hidden" />
  </div>
</template>

<style scoped>
@media print {
  .container { max-width: 100%; padding: 0; }
}

:deep(.p-toggleswitch) {
  --p-toggleswitch-width: 2rem;
  --p-toggleswitch-height: 1.1rem;
  --p-toggleswitch-handle-width: 0.85rem;
  --p-toggleswitch-handle-height: 0.85rem;
  --p-toggleswitch-checked-background: #dc2626;
  --p-toggleswitch-checked-hover-background: #b91c1c;
  --p-toggleswitch-checked-border-color: #dc2626;
  --p-toggleswitch-checked-hover-border-color: #b91c1c;
}

:deep(.p-toggleswitch-checked .p-toggleswitch-slider) {
  background: #dc2626e5 !important;
}

:deep(.p-toggleswitch-checked:hover .p-toggleswitch-slider) {
  background: #b91c1cde !important;
}

:deep(.p-checkbox) {
  --p-checkbox-checked-background: #dc2626;
  --p-checkbox-checked-border-color: #dc2626;
  --p-checkbox-checked-hover-background: #b91c1c;
  --p-checkbox-checked-hover-border-color: #b91c1c;
  --p-checkbox-hover-border-color: #dc2626;
  --p-checkbox-focus-ring-color: #dc2626;
  --p-checkbox-shadow: 0 0 0 2px #dc262640;
}

:deep(.p-checkbox .p-checkbox-box) {
  border-color: #dc2626 !important;
}

:deep(.p-checkbox.p-checkbox-checked .p-checkbox-box) {
  background: #dc2626 !important;
  border-color: #dc2626 !important;
}

:deep(.p-checkbox:not(.p-disabled) .p-checkbox-box:hover),
:deep(.p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box) {
  border-color: #b91c1c !important;
  background: #b91c1c !important;
}
</style>
