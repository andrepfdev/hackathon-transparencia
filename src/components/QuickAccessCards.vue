<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface AccessCard {
  label: string
  icon: string
  href: string
  description: string
  color: string
  iconBg: string
}

const cards: AccessCard[] = [
  { label: 'Despesas',             icon: 'pi pi-chart-bar',    href: '/despesas',          description: 'Gastos do Estado',              color: 'hover:border-blue-400',   iconBg: 'bg-blue-100 text-blue-600'   },
  { label: 'Pessoal',              icon: 'pi pi-users',        href: '/pessoal',           description: 'Quadro de servidores',          color: 'hover:border-purple-400', iconBg: 'bg-purple-100 text-purple-600'},
  { label: 'Remuneração',          icon: 'pi pi-chart-line',   href: '/remuneracao',       description: 'Salários e folha de pagamento', color: 'hover:border-indigo-400', iconBg: 'bg-indigo-100 text-indigo-600'},
  { label: 'Receitas',             icon: 'pi pi-money-bill',   href: '#receitas',          description: 'Arrecadação pública',           color: 'hover:border-green-400',  iconBg: 'bg-green-100 text-green-600' },
  { label: 'Transferências',       icon: 'pi pi-arrows-h',     href: '#transferencias',    description: 'Repasses e transferências',     color: 'hover:border-cyan-400',   iconBg: 'bg-cyan-100 text-cyan-600'   },
  { label: 'Extraorçamentário',    icon: 'pi pi-database',     href: '#extraorcamentario', description: 'Recursos extraorçamentários',   color: 'hover:border-amber-400',  iconBg: 'bg-amber-100 text-amber-600' },
  { label: 'Licitações',           icon: 'pi pi-search',       href: '#licitacoes',        description: 'Processos licitatórios',        color: 'hover:border-orange-400', iconBg: 'bg-orange-100 text-orange-600'},
  { label: 'Contratos',            icon: 'pi pi-file',         href: '#contratos',         description: 'Contratos vigentes',            color: 'hover:border-rose-400',   iconBg: 'bg-rose-100 text-rose-600'   },
  { label: 'Obras',                icon: 'pi pi-building',     href: '#obras',             description: 'Obras e investimentos',         color: 'hover:border-yellow-400', iconBg: 'bg-yellow-100 text-yellow-600'},
  { label: 'Adiantamentos',        icon: 'pi pi-credit-card',  href: '#adiantamentos',     description: 'Adiantamentos e suprimentos',   color: 'hover:border-teal-400',   iconBg: 'bg-teal-100 text-teal-600'   },
  { label: 'Emendas',              icon: 'pi pi-bookmark',     href: '#emendas',           description: 'Emendas parlamentares',         color: 'hover:border-violet-400', iconBg: 'bg-violet-100 text-violet-600'},
  { label: 'Ordem Cronológica',    icon: 'pi pi-calendar',     href: '#ordem-cronologica', description: 'Pagamentos em ordem',           color: 'hover:border-sky-400',    iconBg: 'bg-sky-100 text-sky-600'     },
  { label: 'Convênios',            icon: 'pi pi-link',         href: '#convenios',         description: 'Parcerias e repasses',          color: 'hover:border-pink-400',   iconBg: 'bg-pink-100 text-pink-600'   },
  { label: 'Legislação',           icon: 'pi pi-book',         href: '#legislacao',        description: 'Leis e normas',                 color: 'hover:border-gray-400',   iconBg: 'bg-gray-100 text-gray-600'   },
]
</script>

<template>
  <section class="bg-gray-50 py-8 px-4" aria-label="Acesso rápido às informações">
    <div class="container">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-base font-bold text-[#1a3a6e] uppercase tracking-wide">Acesso Rápido</h2>
        <span class="text-xs text-gray-400">{{ cards.length }} categorias</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <component
          :is="card.href.startsWith('/') ? RouterLink : 'a'"
          v-for="card in cards"
          :key="card.label"
          v-bind="card.href.startsWith('/') ? { to: card.href } : { href: card.href }"
          class="group flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 text-center"
          :class="card.color"
          :aria-label="`${card.label} — ${card.description}`"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            :class="card.iconBg"
          >
            <i :class="card.icon" class="text-xl" aria-hidden="true" />
          </div>
          <span class="text-xs font-semibold text-gray-700 group-hover:text-[#1a3a6e] transition-colors leading-tight text-center">
            {{ card.label }}
          </span>
        </component>
      </div>
    </div>
  </section>
</template>
