<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import { filtrarServidores } from '@/services/portalApi'
import type { ServidorFiltros, ServidoresResponse } from '@/services/types/servidores'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const resultado = ref<ServidoresResponse | null>(null)
const pesquisado = ref(false)

// --- Opções de filtro ---
const anos = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]
const meses = [
  { valor: 'all', label: 'Todos' },
  { valor: '01', label: 'Janeiro' },
  { valor: '02', label: 'Fevereiro' },
  { valor: '03', label: 'Março' },
  { valor: '04', label: 'Abril' },
  { valor: '05', label: 'Maio' },
  { valor: '06', label: 'Junho' },
  { valor: '07', label: 'Julho' },
  { valor: '08', label: 'Agosto' },
  { valor: '09', label: 'Setembro' },
  { valor: '10', label: 'Outubro' },
  { valor: '11', label: 'Novembro' },
  { valor: '12', label: 'Dezembro' },
]
const orgaos = [
  { codigo: 'all', nome: 'Todos' },
  { codigo: '110101', nome: 'SEAD - SECRETARIA DE ESTADO DE ADMINISTRAÇÃO' },
  { codigo: '110109', nome: 'SEAP - SECRETARIA DE ESTADO DE ADMINISTRAÇÃO PENITENCIÁRIA' },
  { codigo: '110201', nome: 'SES - SECRETARIA DE ESTADO DA SAUDE' },
  { codigo: '110301', nome: 'SEDUC - SECRETARIA DE ESTADO DA EDUCACAO' },
  { codigo: '110401', nome: 'SEFAZ - SECRETARIA DE ESTADO DA FAZENDA' },
  { codigo: '110501', nome: 'SEPLAN - SECRETARIA DE ESTADO DE PLANEJAMENTO ORCAMENTO' },
  { codigo: '110601', nome: 'SEGEP - SECRETARIA DE ESTADO DE GESTAO E PREVIDENCIA' },
  { codigo: '110701', nome: 'SEGOV - SECRETARIA DE ESTADO DE GOVERNO' },
  { codigo: '110801', nome: 'SECAP - SECRETARIA DE ESTADO DE COMUNICAÇÃO E ARTICULAÇÃO POLÍTICA' },
  { codigo: '110901', nome: 'STC - SECRETARIA DE ESTADO DE TRANSPARENCIA E CONTROLE' },
  { codigo: '111001', nome: 'SEMA - SECRETARIA DE ESTADO DE MEIO AMBIENTE E RECURSOS NATURAIS' },
  { codigo: '120101', nome: 'SSP - SECRETARIA DE ESTADO DA SEGURANCA PUBLICA' },
  { codigo: '120201', nome: 'PMMA - POLICIA MILITAR DO MARANHAO' },
  { codigo: '120301', nome: 'CBMMA - CORPO DE BOMBEIROS' },
  { codigo: '130101', nome: 'SINFRA - SECRETARIA DE ESTADO DA INFRA-ESTRUTURA' },
  { codigo: '130201', nome: 'SAF - SECRETARIA DE ESTADO DE AGRICULTURA FAMILIAR' },
  { codigo: '130301', nome: 'SAGRIMA - SECRETARIA DE ESTADO DE AGRICULTURA, PECUARIA E PESCA' },
  { codigo: '140101', nome: 'PGE - PROCURADORIA GERAL DO ESTADO' },
  { codigo: '150101', nome: 'SEDES - SECRETARIA ESTADO DESENVOLVIMENTO SOCIAL' },
  { codigo: '150201', nome: 'SEDEL - SECRETARIA DE ESTADO DE ESPORTE E LAZER' },
  { codigo: '160101', nome: 'SECMA - SECRETARIA DE ESTADO DE CULTURA' },
  { codigo: '160201', nome: 'SECTUR - SECRETARIA DE ESTADO DA CULTURA E TURISMO' },
  { codigo: '170101', nome: 'SECTI - SECRETARIA DE ESTADO CIENCIA,TECNOLOGIA,ENS.SUP.E DES.TECNOLOGICO' },
  { codigo: '180101', nome: 'SEMED - SECRETARIA MUNICIPAL DE EDUCACAO' },
  { codigo: '190101', nome: 'DETRAN - DEPARTAMENTO ESTADUAL DE TRÂNSITO' },
  { codigo: '190201', nome: 'IEMA - INSTITUTO ESTADUAL DE EDUCACAO, CIENCIA E TECNOLOGIA' },
  { codigo: '190301', nome: 'UEMA - UNIVERSIDADE ESTADUAL DO MARANHÃO' },
  { codigo: '190401', nome: 'IPREV - INSTITUTO PREVEDENCIÁRIO DOS SERVIDORES DO ESTADO' },
  { codigo: '190501', nome: 'ITERMA - INSTITUTO DE COLONIZAÇÃO E TERRAS DO MARANHÃO' },
  { codigo: '190601', nome: 'JUCEMA - JUNTA COMERCIAL DO MARANHÃO' },
  { codigo: '190701', nome: 'FMRB - FUNDAÇÃO DA MEMÓRIA REPUBLICANA' },
  { codigo: '190801', nome: 'FNL - FUNDACO NICE LOBAO' },
  { codigo: '190901', nome: 'FAPEMA - FUNDACAO DE AMPARO A PESQUISA E DES.TECNOLOGICO DO MARANHAO' },
  { codigo: '191001', nome: 'INVESTE MA - INVEST MARANHÃO' },
  { codigo: '191101', nome: 'SEPA - Secretaria de Estado da Pesca e Aquicultura' },
  { codigo: '191201', nome: 'SEMU - SECRETARIA DE ESTADO DA MULHER' },
  { codigo: '191301', nome: 'SEPID - SECRETARIA ESTADO DAS CIDADES E DESENVOLVIMENTO URBANO' },
  { codigo: '191401', nome: 'SEDIHPOP - SECRETARIA DE ESTADO DE DIREITOS HUMANOS E PARTICIPAÇÃO POPULAR' },
  { codigo: '191501', nome: 'SETRES - SECRETARIA DE ESTADO DO TRABALHO E DA ECONOMIA SOLIDÁRIA' },
  { codigo: '191601', nome: 'SEINC - SECRETARIA DE ESTADO DE INDÚSTRIA, COMÉRCIO E ENERGIA' },
  { codigo: '191701', nome: 'SEPE - SECRETARIA DE ESTADO DE PROGRAMAS ESTRATÉGICO' },
  { codigo: '191801', nome: 'SERIDF - Secretaria de Representação Institucional no Distrito Federal' },
  { codigo: '191901', nome: 'CCL - COMIISSÃO CENTRAL DE LICITACAO' },
  { codigo: '192001', nome: 'AGEM - AGENCIA METROPOLITANA' },
  { codigo: '192101', nome: 'AGERP - AGENCIA EST.DE PESQUISA AGROPECUARIA E EXTENS.RURAL MARANHAO' },
  { codigo: '192201', nome: 'ATI - AG EST TECNOLOGIA INFORMACAO' },
  { codigo: '192301', nome: 'EMARHP - EMPRESA MARANHENSE DE RECURSOS HUMANOS E NEGOCIOS PUBLICOS' },
  { codigo: '192401', nome: 'FUND EGMA - FUNDAÇÃO ESCOLA DE GOVERNO' },
  { codigo: '192501', nome: 'IMESC - INST.MARANHENSE DE ESTUDO SOCIOECONOMICO E CARTOGRAFICO' },
  { codigo: '192601', nome: 'INMEQ - INSTITUTO DE METROLOGIA E QUALIDADE INDUSTRIAL DO MARANHÃO' },
  { codigo: '192701', nome: 'MAPA - MARANHÃO PARCERIAS' },
  { codigo: '192801', nome: 'MOB - AGENCIA DE MOBILIDADE URBANA' },
  { codigo: '192901', nome: 'PROCON - PROCON' },
  { codigo: '193001', nome: 'SETUR - SECRETARIA ESTADO DO TURISMO' },
  { codigo: '193101', nome: 'ZPE MARANH - Zona de Processamento de Exportação do Maranhão' },
  { codigo: '193201', nome: 'UEMASUL - UEMASUL' },
  { codigo: '193301', nome: 'CORPO BOMBEIRO - CORPO DE BOMBEIRO' },
  { codigo: '193401', nome: 'CONTRATO/SEEDUC - CONTRATO DA SECRETARIA DE ESTADO DA EDUCACAO' },
  { codigo: '193501', nome: 'CONTRATO/PMMA - CONTRATO/PMMA' },
  { codigo: '193601', nome: 'CONTRATO/DETRAN - CONTRATO/DETRAN' },
  { codigo: '193701', nome: 'CONTRATO/CBMMA - CONTRATO/CBMMA' },
  { codigo: '193801', nome: 'CONTRATO/SEGEP - CONTRATO/SEGEP' },
  { codigo: '193901', nome: 'CONTRATO/SEJAP - CONTRATO/SEJAP' },
  { codigo: '194001', nome: 'SEEDUC-CONTR-II - SEEDUC CONTRATADO-II' },
  { codigo: '194101', nome: 'UEMA-CONTRATADO - UEMA - CONTRATADO' },
  { codigo: '194201', nome: 'UEMASUL/CONTRAT - UEMASUL/CONTRATADOS' },
  { codigo: '194301', nome: 'GOV.APOSENTADOS - GOVERNO DO MARANHAO APOSENTADOS' },
  { codigo: '194401', nome: 'GOV.MIL.REFORMA - GOVERNO MILITAR REFORMADO' },
  { codigo: '194501', nome: 'PENSÃO PREVID. - PENSAO PREVIDENCIARIA' },
  { codigo: '194601', nome: 'PENS.ESPECIAIS - PENSOES ESPECIAIS' },
  { codigo: '194701', nome: 'CASA CIVIL - CASA CIVIL' },
  { codigo: '194801', nome: 'CONT.EDUC.INDIG - CONTRATO EDUCACAO INDIGENA' },
  { codigo: '194901', nome: 'PMMA - CIVIL - SERVIDORES CIVIS' },
  { codigo: '195001', nome: 'AGED - AGENCIA ESTADUAL DE DEFESA AGROPECUARIA DO MARANHÃO' },
  { codigo: '195101', nome: 'AGEMLESTE - AGENCIA EXC MET LESTE MARANHENSE' },
  { codigo: '195201', nome: 'AGEMSUL - AGENCIA EXC MET SUD MARANHENSE' },
  { codigo: '195301', nome: 'SECOM - SEC EST COMUNICACAO SOCIAL' },
]
// --- Estado do formulário ---
const filtros = ref<ServidorFiltros>({
  ano: new Date().getFullYear(),
  mes: 'all',
  nome: '',
  orgao: 'all',
  cargo: '',
  vinculo: 'all',
  situacao: 'all',
  municipio: 'all',
  pagina: 1,
})

// --- Toggle para alternar entre Nome e Órgão ---
const filtroNomeAtivo = ref(true)
const filtroOrgaoAtivo = computed({
  get: () => !filtroNomeAtivo.value,
  set: (v) => {
    filtroNomeAtivo.value = !v
    erroNome.value = false // Limpa erro ao alternar
  },
})

// --- Validação: Nome obrigatório quando toggle "Nome do servidor" está ativo ---
const erroNome = ref(false)
const nomeObrigatorio = computed(() => filtroNomeAtivo.value && !(filtros.value.nome || '').trim())

// --- Controles da tabela ---
const buscaTabela = ref('')
const itensPorPagina = ref('10')
const ordenarPor = ref('Nome')
const ordemDir = ref('Decrescente')

// --- Chips de filtros ativos ---
const filtrosAtivos = computed(() => {
  const chips: { label: string; valor: string; campo: keyof ServidorFiltros | 'ano' }[] = []
  if (filtros.value.ano) chips.push({ label: 'Ano', valor: String(filtros.value.ano), campo: 'ano' })
  if (filtros.value.orgao && filtros.value.orgao !== 'all') {
    const org = orgaos.find((o) => o.codigo === filtros.value.orgao)
    chips.push({ label: 'Unidade', valor: org?.nome ?? filtros.value.orgao, campo: 'orgao' })
  }
  if (filtros.value.mes && filtros.value.mes !== 'all') {
    const mes = meses.find((m) => m.valor === filtros.value.mes)
    chips.push({ label: 'Mês', valor: mes?.label ?? filtros.value.mes, campo: 'mes' })
  }
  if (filtros.value.nome) chips.push({ label: 'Nome', valor: filtros.value.nome, campo: 'nome' })
  return chips
})

function removerFiltro(campo: keyof ServidorFiltros | 'ano') {
  if (campo === 'nome' || campo === 'cargo') (filtros.value as Record<string, unknown>)[campo] = ''
  else if (campo === 'ano') (filtros.value as Record<string, unknown>)[campo] = new Date().getFullYear()
  else (filtros.value as Record<string, unknown>)[campo] = 'all'
  aplicarFiltros()
}

// --- Lógica de URL ---
function fromQuery() {
  const q = route.query
  filtros.value = {
    ano: q.ano ? Number(q.ano) : 2025,
    mes: (q.mes as string) || 'all',
    nome: (q.nome as string) || '',
    orgao: (q.orgao as string) || 'all',
    cargo: (q.cargo as string) || '',
    vinculo: (q.vinculo as string) || 'all',
    situacao: (q.situacao as string) || 'all',
    municipio: (q.municipio as string) || 'all',
    pagina: q.pagina ? Number(q.pagina) : 1,
  }
}

function toQuery() {
  const f = filtros.value
  return {
    ano: String(f.ano ?? 2025),
    mes: f.mes || 'all',
    nome: f.nome || '',
    orgao: f.orgao || 'all',
    cargo: f.cargo || '',
    vinculo: f.vinculo || 'all',
    situacao: f.situacao || 'all',
    municipio: f.municipio || 'all',
    pagina: String(f.pagina ?? 1),
  }
}

// --- Lógica de dados ---
async function buscar() {
  loading.value = true
  try {
    resultado.value = await filtrarServidores(filtros.value)
  } finally {
    loading.value = false
  }
}

function aplicarFiltros() {
  // Validação: nome é obrigatório quando toggle "Nome do servidor" está ativo
  if (filtroNomeAtivo.value && !(filtros.value.nome || '').trim()) {
    erroNome.value = true
    return
  }
  erroNome.value = false
  filtros.value.pagina = 1
  pesquisado.value = true
  router.push({ query: toQuery() })
  buscar()
}

function limparFiltros() {
  filtros.value = {
    ano: new Date().getFullYear(),
    mes: 'all',
    nome: '',
    orgao: 'all',
    cargo: '',
    vinculo: 'all',
    situacao: 'all',
    municipio: 'all',
    pagina: 1,
  }
  filtroNomeAtivo.value = true
  pesquisado.value = false
  resultado.value = null
  router.push({ query: {} })
}

function irPagina(p: number) {
  filtros.value.pagina = p
  router.push({ query: toQuery() })
  buscar()
}

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
    (s) =>
      s.nome.toLowerCase().includes(q) ||
      s.orgao.toLowerCase().includes(q) ||
      s.cargo.toLowerCase().includes(q) ||
      s.matricula.toLowerCase().includes(q),
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

// --- Exportação ---
function exportarCSV() {
  if (!resultado.value) return
  const dados = dadosFiltradosBusca.value
  const headers = ['Matrícula', 'Nome', 'Cargo', 'Órgão', 'Rem. Bruta (R$)', 'Descontos (R$)', 'Rem. Líquida (R$)']
  const linhas = dados.map((s) => [
    s.matricula,
    `"${s.nome}"`,
    `"${s.cargo}"`,
    `"${s.orgao}"`,
    s.remuneracao_bruta.toFixed(2).replace('.', ','),
    s.descontos.toFixed(2).replace('.', ','),
    s.remuneracao_liquida.toFixed(2).replace('.', ','),
  ])
  const csv = [headers, ...linhas].map((r) => r.join(';')).join('\n')
  const blob = new Blob(['' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `remuneracao-ma-${filtros.value.ano ?? 2025}.csv`
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
        <span class="text-gray-800 font-medium" aria-current="page">Remuneração</span>
      </div>
    </div>

    <main id="main-content" class="flex-1">
      <div class="container mx-auto px-4 py-6 space-y-6">

        <!-- Título -->
        <div>
          <h1 class="text-2xl font-bold text-red-700">Remuneração de Servidores</h1>
          <p class="text-sm text-gray-600 mt-1">
            Preencha os campos, seguindo a ordem e faça a pesquisa.
            <span class="ml-3 text-xs text-gray-400">
              Dados até: {{ resultado?.meta.atualizado_em ?? '—' }}
            </span>
          </p>
        </div>

        <!-- Formulário de filtros -->
        <form class="bg-white border border-gray-200 rounded-lg p-5" @submit.prevent="aplicarFiltros" novalidate>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- 1. Período -->
            <div>
              <h3 class="text-sm font-semibold text-gray-700 mb-3">1. Período</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Ano</label>
                  <select
                    v-model="filtros.ano"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Mês</label>
                  <select
                    v-model="filtros.mes"
                    class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <option v-for="m in meses" :key="m.valor" :value="m.valor">{{ m.label }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 2. Filtros -->
            <div class="lg:col-span-2">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">2. Filtros</h3>
              
              <!-- Toggle entre Nome e Órgão -->
              <div class="flex items-center gap-4 mb-4">
                <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <ToggleSwitch v-model="filtroNomeAtivo" :binary="true" aria-label="Filtrar por nome" />
                  <span class="text-gray-700">Nome do servidor</span>
                </label>
                <span class="text-gray-300">|</span>
                <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <ToggleSwitch v-model="filtroOrgaoAtivo" :binary="true" aria-label="Filtrar por órgão" />
                  <span class="text-gray-700">Por órgão</span>
                </label>
              </div>

              <!-- Campo Nome -->
              <div v-if="filtroNomeAtivo" class="max-w-md">
                <label class="block text-xs text-gray-600 mb-1">
                  Nome do servidor (sem acentuação)
                  <span class="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  v-model="filtros.nome"
                  placeholder="Digite o nome..."
                  :class="[
                    'w-full border rounded px-2 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-blue-600',
                    erroNome ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  ]"
                  @input="erroNome = false"
                />
                <p v-if="erroNome" class="text-red-600 text-xs mt-1">Campo obrigatório para consulta por nome</p>
              </div>

              <!-- Campo Órgão -->
              <div v-if="!filtroNomeAtivo" class="max-w-md">
                <label class="block text-xs text-gray-600 mb-1">Unidade</label>
                <select
                  v-model="filtros.orgao"
                  class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <option v-for="o in orgaos" :key="o.codigo" :value="o.codigo">{{ o.nome }}</option>
                </select>
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

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col justify-center items-center py-16" role="status" aria-live="polite">
          <i class="pi pi-spin pi-spinner text-4xl text-red-600 mb-3" aria-hidden="true"></i>
          <span class="text-gray-600 text-sm">Carregando dados...</span>
        </div>

        <!-- Resultados -->
        <section v-if="!loading && resultado" aria-label="Resultados da consulta">

          <!-- Filtros ativos -->
          <div v-if="filtrosAtivos.length" class="flex flex-wrap items-center gap-2 mb-4">
            <span class="text-sm text-gray-600">Filtros ativos:</span>
            <button
              v-for="chip in filtrosAtivos"
              :key="chip.campo"
              type="button"
              class="flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-1.5 hover:bg-red-100 transition-colors"
              @click="removerFiltro(chip.campo)"
              :aria-label="`Remover filtro ${chip.label}: ${chip.valor}`"
            >
              <span class="font-medium">{{ chip.label }}:</span>
              <span>{{ chip.valor }}</span>
              <i class="pi pi-times text-xs" aria-hidden="true"></i>
            </button>
          </div>

          <!-- Cards de resumo (estilo portal) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div class="bg-red-700 text-white rounded-lg p-4 text-center">
              <p class="text-sm font-semibold uppercase tracking-wide opacity-90">Total da Folha</p>
              <p class="text-xl font-bold mt-1">
                {{ resultado ? formatBRL(resultado.resumo.total_folha) : '—' }}
              </p>
              <p class="text-xs opacity-70 mt-0.5">pagamento mensal</p>
            </div>
            <div class="bg-red-700 text-white rounded-lg p-4 text-center">
              <p class="text-sm font-semibold uppercase tracking-wide opacity-90">Média Salarial</p>
              <p class="text-xl font-bold mt-1">
                {{ resultado ? formatBRL(resultado.resumo.media_salarial) : '—' }}
              </p>
              <p class="text-xs opacity-70 mt-0.5">remuneração líquida</p>
            </div>
            <div class="bg-red-700 text-white rounded-lg p-4 text-center">
              <p class="text-sm font-semibold uppercase tracking-wide opacity-90">Servidores</p>
              <p class="text-xl font-bold mt-1">
                {{ resultado ? resultado.resumo.total_servidores.toLocaleString('pt-BR') : '—' }}
              </p>
              <p class="text-xs opacity-70 mt-0.5">no cadastro</p>
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
                <option>Nome</option>
                <option>Órgão</option>
                <option>Rem. Bruta</option>
                <option>Rem. Líquida</option>
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
              <span class="text-sm">Carregando remuneração...</span>
            </div>

            <!-- Sem resultados -->
            <div
              v-else-if="dadosFiltradosBusca.length === 0"
              class="py-14 flex flex-col items-center gap-2 text-gray-400"
              role="status"
            >
              <i class="pi pi-search text-3xl" aria-hidden="true"></i>
              <p class="text-sm">Nenhuma remuneração encontrada com os filtros selecionados.</p>
            </div>

            <div v-else>
            <!-- Tabela Desktop -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full text-sm" aria-label="Remuneração de servidores do Estado do Maranhão">
                <thead class="bg-gray-50 text-xs text-gray-500 border-b border-gray-200">
                  <tr>
                    <th scope="col" class="px-4 py-3 text-left font-semibold">Nome</th>
                    <th scope="col" class="px-4 py-3 text-left font-semibold">Cargo</th>
                    <th scope="col" class="px-4 py-3 text-left font-semibold">Órgão</th>
                    <th scope="col" class="px-4 py-3 text-right font-semibold text-amber-700">Rem. Bruta</th>
                    <th scope="col" class="px-4 py-3 text-right font-semibold text-red-700">Descontos</th>
                    <th scope="col" class="px-4 py-3 text-right font-semibold text-green-700">Rem. Líquida</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="item in dadosFiltradosBusca"
                    :key="item.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-4 py-3 font-medium text-gray-800">{{ item.nome }}</td>
                    <td class="px-4 py-3 text-gray-600">{{ item.cargo }}</td>
                    <td class="px-4 py-3 text-gray-700 max-w-[180px]">
                      <span class="line-clamp-2 leading-snug" :title="item.orgao">{{ item.orgao }}</span>
                    </td>
                    <td class="px-4 py-3 text-right text-amber-700 font-medium whitespace-nowrap tabular-nums">
                      {{ formatBRL(item.remuneracao_bruta) }}
                    </td>
                    <td class="px-4 py-3 text-right text-red-700 font-medium whitespace-nowrap tabular-nums">
                      {{ formatBRL(item.descontos) }}
                    </td>
                    <td class="px-4 py-3 text-right text-green-700 font-medium whitespace-nowrap tabular-nums">
                      {{ formatBRL(item.remuneracao_liquida) }}
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
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Nome</div>
                  <div class="px-3 py-2 text-xs text-gray-700 font-medium">{{ item.nome }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Cargo</div>
                  <div class="px-3 py-2 text-xs text-gray-700">{{ item.cargo }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Órgão</div>
                  <div class="px-3 py-2 text-xs text-gray-700 leading-snug">{{ item.orgao }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-amber-700">Rem. Bruta</div>
                  <div class="px-3 py-2 text-xs text-amber-700 font-semibold tabular-nums">{{ formatBRL(item.remuneracao_bruta) }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-red-700">Descontos</div>
                  <div class="px-3 py-2 text-xs text-red-700 font-semibold tabular-nums">{{ formatBRL(item.descontos) }}</div>
                </div>
                <div class="grid grid-cols-[2fr_3fr] divide-x divide-gray-100 border-t border-gray-100">
                  <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-green-700">Rem. Líquida</div>
                  <div class="px-3 py-2 text-xs text-green-700 font-semibold tabular-nums">{{ formatBRL(item.remuneracao_liquida) }}</div>
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

        <!-- Estado vazio (após pesquisa sem resultados) -->
        <div
          v-if="!loading && pesquisado && resultado && totalRecords === 0"
          class="flex flex-col items-center justify-center py-20 text-center"
          role="status"
        >
          <i class="pi pi-search text-5xl text-gray-300 mb-4" aria-hidden="true"></i>
          <p class="text-gray-600 font-medium text-lg">Nenhum servidor encontrado</p>
          <p class="text-gray-500 text-sm mt-2">Tente ajustar os filtros da sua pesquisa.</p>
        </div>

        <!-- Estado inicial (antes da primeira pesquisa) -->
        <div
          v-if="!loading && !pesquisado"
          class="flex flex-col items-center justify-center py-20 text-center"
          role="status"
        >
          <i class="pi pi-users text-5xl text-gray-200 mb-4" aria-hidden="true"></i>
          <p class="text-gray-500 text-base">Selecione os filtros e clique em <strong class="text-gray-700">Pesquisar</strong> para consultar.</p>
        </div>

      </div>
    </main>

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
