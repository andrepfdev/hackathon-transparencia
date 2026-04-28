<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { TERMOS_TECNICOS, INTENCOES, FUNCOES_ORCAMENTO } from '@/data/thesaurus/termosAgente'

interface Sugestao {
  titulo: string
  descricao: string
  rota: string
  categoria: 'despesas' | 'servidores' | 'contratos' | 'receitas' | 'assistente'
}

const router = useRouter()
const searchQuery = ref('')
const sugestoes = ref<Sugestao[]>([])
const aberto = ref(false)
const indiceFocado = ref(-1)

const ROTAS_INTENCAO: Record<string, Omit<Sugestao, 'titulo'> & { titulo: string }> = {
  despesas:   { rota: '/despesas',          titulo: 'Despesas do governo',    descricao: 'Gastos públicos por área, secretaria ou fornecedor', categoria: 'despesas'   },
  servidores: { rota: '/remuneracao',        titulo: 'Servidores públicos',    descricao: 'Salários, vínculos e órgãos de atuação',             categoria: 'servidores' },
  contratos:  { rota: '/busca-inteligente',  titulo: 'Contratos e licitações', descricao: 'Acordos firmados com empresas e fornecedores',        categoria: 'contratos'  },
  receitas:   { rota: '/busca-inteligente',  titulo: 'Receitas do estado',     descricao: 'De onde vem o dinheiro arrecadado pelo MA',           categoria: 'receitas'   },
}

const CATEGORIA_POR_TERMO: Record<string, Sugestao['categoria']> = {
  'empenho': 'despesas', 'liquidação': 'despesas', 'valor empenhado': 'despesas',
  'valor liquidado': 'despesas', 'valor pago': 'despesas', 'pago': 'despesas',
  'pendente': 'despesas', 'cancelado': 'despesas', 'natureza de despesa': 'despesas',
  'categoria econômica': 'despesas', 'subfunção': 'despesas', 'fonte de recurso': 'despesas',
  'programa': 'despesas', 'ação': 'despesas', 'função': 'despesas',
  'unidade gestora': 'despesas', 'ug': 'despesas',
  'remuneração bruta': 'servidores', 'remuneração líquida': 'servidores',
  'estatutário': 'servidores', 'comissionado': 'servidores', 'temporário': 'servidores',
  'modalidade licitatória': 'contratos', 'pregão eletrônico': 'contratos',
  'dispensa de licitação': 'contratos', 'concorrência pública': 'contratos',
  'tomada de preços': 'contratos', 'contrato administrativo': 'contratos',
  'vigência': 'contratos', 'cnpj do fornecedor': 'contratos',
  'natureza da receita': 'receitas', 'fpe': 'receitas', 'icms': 'receitas',
  'ipva': 'receitas', 'itcd': 'receitas', 'extraorçamentário': 'receitas',
}

const ROTA_POR_CATEGORIA: Record<Sugestao['categoria'], string> = {
  despesas: '/despesas', servidores: '/remuneracao',
  contratos: '/busca-inteligente', receitas: '/busca-inteligente', assistente: '/busca-inteligente',
}

function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function calcularSugestoes(query: string): Sugestao[] {
  const q = normalizar(query.trim())
  if (q.length < 2) return []

  const resultado: Sugestao[] = []
  const vistos = new Set<string>()

  function add(s: Sugestao, key: string) {
    if (!vistos.has(key)) { vistos.add(key); resultado.push(s) }
  }

  for (const f of FUNCOES_ORCAMENTO) {
    const nomes = [normalizar(f.nome), ...f.sinonimos.map(normalizar)]
    if (nomes.some(n => n.includes(q) || q.includes(n))) {
      add({ titulo: `Despesas com ${f.nome}`, descricao: `Gastos do governo na área de ${f.nome}`, rota: '/despesas', categoria: 'despesas' }, `func-${f.nome}`)
    }
  }

  for (const [intencao, keywords] of Object.entries(INTENCOES)) {
    const matched = (keywords as readonly string[]).some(k => {
      const kn = normalizar(k)
      return kn.includes(q) || q.includes(kn)
    })
    if (matched) {
      const info = ROTAS_INTENCAO[intencao]
      if (info) add({ ...info }, `int-${intencao}`)
    }
  }

  for (const [tecnico, cidadao] of Object.entries(TERMOS_TECNICOS)) {
    if (normalizar(tecnico).includes(q) || normalizar(cidadao).includes(q)) {
      const categoria = CATEGORIA_POR_TERMO[tecnico] ?? 'assistente'
      add({
        titulo: `"${tecnico}" — ${cidadao}`,
        descricao: `Buscar informações sobre ${cidadao}`,
        rota: ROTA_POR_CATEGORIA[categoria],
        categoria,
      }, `termo-${tecnico}`)
    }
  }

  resultado.push({
    titulo: `Perguntar sobre "${query.trim()}"`,
    descricao: 'Consulta conversada, fácil de entender.',
    rota: '/busca-inteligente',
    categoria: 'assistente',
  })

  return resultado.slice(0, 6)
}

watch(searchQuery, (val) => {
  sugestoes.value = calcularSugestoes(val)
  aberto.value = sugestoes.value.length > 0
  indiceFocado.value = -1
})

function navegar(s: Sugestao) {
  const q = searchQuery.value.trim()
  aberto.value = false
  searchQuery.value = ''
  if (s.rota === '/busca-inteligente') {
    router.push({ path: '/busca-inteligente', query: { q } })
  } else {
    router.push(s.rota)
  }
}

function onSearch() {
  if (!searchQuery.value.trim()) return
  const q = searchQuery.value.trim()
  aberto.value = false
  const melhor = calcularSugestoes(q).find(s => s.categoria !== 'assistente' && s.rota !== '/busca-inteligente')
  searchQuery.value = ''
  if (melhor) {
    router.push(melhor.rota)
  } else {
    router.push({ path: '/busca-inteligente', query: { q } })
  }
}

function searchTerm(term: string) {
  searchQuery.value = term
  onSearch()
}

function onKeydown(e: KeyboardEvent) {
  if (!aberto.value) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    indiceFocado.value = Math.min(indiceFocado.value + 1, sugestoes.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    indiceFocado.value = Math.max(indiceFocado.value - 1, -1)
  } else if (e.key === 'Escape') {
    aberto.value = false; indiceFocado.value = -1
  } else if (e.key === 'Enter' && indiceFocado.value >= 0) {
    e.preventDefault()
    const s = sugestoes.value[indiceFocado.value]
    if (s) navegar(s)
  }
}

function onBlur() {
  setTimeout(() => { aberto.value = false; indiceFocado.value = -1 }, 150)
}

const ICONE: Record<Sugestao['categoria'], string> = {
  despesas: 'pi-wallet', servidores: 'pi-users',
  contratos: 'pi-file', receitas: 'pi-chart-bar', assistente: 'pi-sparkles',
}

const BADGE: Record<Sugestao['categoria'], string> = {
  despesas:   'bg-blue-100 text-blue-700',
  servidores: 'bg-green-100 text-green-700',
  contratos:  'bg-orange-100 text-orange-700',
  receitas:   'bg-purple-100 text-purple-700',
  assistente: 'bg-gray-100 text-gray-600',
}

const BADGE_LABEL: Record<Sugestao['categoria'], string> = {
  despesas: 'Despesas', servidores: 'Servidores',
  contratos: 'Contratos', receitas: 'Receitas', assistente: 'Assistente IA',
}

const quickSearches = ['Salários', 'Licitações', 'Obras', 'Contratos']

const stats = [
  { label: 'Servidores ativos', value: '84,5 mil' },
  { label: 'Folha/mês', value: 'R$ 620 mi' },
  { label: 'Despesas em 2025', value: 'R$ 14,4 bi' },
  { label: 'Contratos vigentes', value: '2.847' },
]
</script>

<template>
  <section
    class="relative"
    style="background-image: url('/img/cultura_maranhao.webp'); background-size: cover; background-position: center top;"
  >
    <!-- Gradiente escuro com toque navy -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#0d1f3c]/85 via-black/60 to-[#1a3a6e]/75" aria-hidden="true" />

    <div class="relative container px-4 pt-14 pb-0 md:pt-22">
      <!-- Tagline -->
      <p class="text-center text-xs font-bold uppercase tracking-widest text-red-400 mb-3">
        Portal da Transparência — Estado do Maranhão
      </p>

      <h1 class="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg max-w-2xl mx-auto">
        O que você quer saber sobre o governo?
      </h1>
      <p class="text-center text-blue-200/90 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
        Consulte gastos, servidores, contratos e receitas com transparência total.
      </p>

      <!-- Campo de busca -->
      <div class="relative max-w-2xl mx-auto mb-5">
        <div
          class="flex items-stretch rounded-2xl shadow-2xl bg-white overflow-visible border-2 border-transparent focus-within:border-blue-400 transition-all duration-200"
        >
          <label for="hero-search" class="sr-only">Buscar informações no Portal</label>
          <form class="flex flex-1 items-center px-5" @submit.prevent="onSearch">
            <i class="pi pi-search text-gray-400 mr-3 flex-shrink-0 text-base" aria-hidden="true" />
            <input
              id="hero-search"
              v-model="searchQuery"
              type="text"
              placeholder="Ex: salários, obras, contratos de saúde..."
              class="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent py-4 focus:outline-none"
              autocomplete="off"
              enterkeyhint="search"
              role="combobox"
              :aria-expanded="aberto"
              aria-controls="hero-suggestions"
              aria-autocomplete="list"
              @keydown="onKeydown"
              @blur="onBlur"
              @focus="aberto = sugestoes.length > 0"
            />
          </form>
          <button
            type="button"
            class="bg-[#c0392b] hover:bg-[#a93226] active:bg-[#922b21] text-white font-bold px-6 sm:px-8 py-4 text-sm transition-colors flex-shrink-0 flex items-center gap-2 rounded-r-2xl"
            @click="onSearch"
          >
            <i class="pi pi-search" aria-hidden="true" />
            <span class="hidden sm:inline">Buscar</span>
          </button>
        </div>

        <!-- Dropdown de sugestões -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="-translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="-translate-y-1 opacity-0"
        >
          <ul
            v-if="aberto && sugestoes.length"
            id="hero-suggestions"
            role="listbox"
            class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-left"
          >
            <li
              v-for="(s, i) in sugestoes"
              :key="i"
              role="option"
              :aria-selected="indiceFocado === i"
            >
              <button
                type="button"
                class="w-full flex items-start gap-3 px-4 py-3 transition-colors text-left"
                :class="indiceFocado === i ? 'bg-blue-50' : 'hover:bg-gray-50'"
                @mousedown.prevent="navegar(s)"
                @mouseenter="indiceFocado = i"
              >
                <span
                  class="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  :class="BADGE[s.categoria]"
                >
                  <i :class="`pi ${ICONE[s.categoria]}`" aria-hidden="true" />
                </span>
                <span class="flex-1 min-w-0">
                  <span class="block text-sm font-medium text-gray-800 truncate">{{ s.titulo }}</span>
                  <span class="block text-xs text-gray-500 mt-0.5 truncate">{{ s.descricao }}</span>
                </span>
                <span
                  class="flex-shrink-0 self-center text-xs font-medium px-2 py-0.5 rounded-full"
                  :class="BADGE[s.categoria]"
                >
                  {{ BADGE_LABEL[s.categoria] }}
                </span>
              </button>
            </li>
          </ul>
        </Transition>
      </div>

      <!-- Buscas populares -->
      <div class="flex items-center justify-center gap-2 flex-wrap mb-10">
        <span class="text-xs text-blue-300 font-medium">Populares:</span>
        <button
          v-for="term in quickSearches"
          :key="term"
          class="text-xs text-white border border-white/25 hover:border-white/60 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all min-h-[36px]"
          @click="searchTerm(term)"
        >
          {{ term }}
        </button>
      </div>
    </div>

    <!-- Barra de estatísticas -->
    <div class="relative bg-[#1a3a6e]/90 backdrop-blur-sm border-t border-white/10">
      <div class="container px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="py-4 px-4 text-center"
          >
            <p class="text-white font-bold text-base sm:text-xl tabular-nums leading-none">{{ stat.value }}</p>
            <p class="text-blue-300 text-xs mt-1 leading-snug">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
