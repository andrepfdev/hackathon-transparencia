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

  // Funções orçamentárias (nome + sinônimos)
  for (const f of FUNCOES_ORCAMENTO) {
    const nomes = [normalizar(f.nome), ...f.sinonimos.map(normalizar)]
    if (nomes.some(n => n.includes(q) || q.includes(n))) {
      add({ titulo: `Despesas com ${f.nome}`, descricao: `Gastos do governo na área de ${f.nome}`, rota: '/despesas', categoria: 'despesas' }, `func-${f.nome}`)
    }
  }

  // Intenções por keywords (coloquiais e técnicos)
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

  // Termos técnicos do glossário → linguagem cidadã
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

  // Fallback: assistente de IA
  resultado.push({
    titulo: `Perguntar sobre "${query.trim()}"`,
    descricao: 'Consulta em linguagem natural com o assistente de IA',
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
</script>

<template>
  <section
    class="relative border-b border-gray-800 py-12 px-4 md:py-20"
    style="background-image: url('/img/cultura_maranhao.webp'); background-size: cover; background-position: center;"
  >
    <!-- overlay escuro -->
    <div class="absolute inset-0 bg-black/53" aria-hidden="true" />

    <div class="relative container text-center">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight drop-shadow-md">
        O que você procura no Portal?
      </h1>
      <p class="text-blue-100 text-sm mb-6 max-w-md mx-auto drop-shadow">
        Use termos simples. Ex: salário de servidores, obras na minha cidade, contratos de merenda.
      </p>

      <!-- Campo de busca com dropdown -->
      <div class="relative max-w-xl mx-auto mb-4">
        <div
          class="flex items-stretch rounded-xl border border-gray-300 shadow-md bg-white overflow-visible
                 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.2)] transition-all"
        >
          <label for="hero-search" class="sr-only">Buscar informações no Portal</label>
          <form class="flex flex-1 items-center px-4" @submit.prevent="onSearch">
            <i class="pi pi-search text-gray-400 mr-3 flex-shrink-0 text-sm" aria-hidden="true" />
            <input
              id="hero-search"
              v-model="searchQuery"
              type="text"
              placeholder="Digite o que deseja encontrar..."
              class="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent py-3.5 focus:outline-none"
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
            class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 sm:px-7 py-3.5 text-sm transition-colors flex-shrink-0 flex items-center gap-1.5 rounded-r-xl"
            @click="onSearch"
          >
            <i class="pi pi-search text-xs" aria-hidden="true" />
            Buscar
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
            class="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-left"
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

      <div class="flex items-center justify-center gap-2 flex-wrap">
        <span class="text-xs text-blue-200">Populares:</span>
        <button
          v-for="term in quickSearches"
          :key="term"
          class="text-xs text-white hover:text-white border border-white/30 hover:border-white/60 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors min-h-[36px]"
          @click="searchTerm(term)"
        >
          {{ term }}
        </button>
      </div>
    </div>
  </section>
</template>
