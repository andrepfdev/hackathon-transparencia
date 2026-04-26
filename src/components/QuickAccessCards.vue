<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface AccessCard {
  label: string
  icon: string
  href: string
  description: string
}

const cards: AccessCard[] = [
  { label: 'Despesas', icon: 'pi pi-chart-bar', href: '/despesas', description: 'Gastos do Estado' },
  { label: 'Receitas', icon: 'pi pi-money-bill', href: '#receitas', description: 'Arrecadação pública' },
  { label: 'Pessoal + Diárias', icon: 'pi pi-users', href: '/pessoal', description: 'Quadro de pessoal do Estado' },
  { label: 'Remuneração', icon: 'pi pi-chart-line', href: '/remuneracao', description: 'Remuneração de servidores' },
  { label: 'Transferências', icon: 'pi pi-arrows-h', href: '#transferencias', description: 'Repasses e transferências' },
  { label: 'Extraorçamentário', icon: 'pi pi-database', href: '#extraorcamentario', description: 'Recursos extraorçamentários' },
  { label: 'Licitações', icon: 'pi pi-search', href: '#licitacoes', description: 'Processos licitatórios' },
  { label: 'Contratos', icon: 'pi pi-file', href: '#contratos', description: 'Contratos vigentes' },
  { label: 'Obras', icon: 'pi pi-building', href: '#obras', description: 'Obras e investimentos' },
  { label: 'Adiantamentos', icon: 'pi pi-credit-card', href: '#adiantamentos', description: 'Adiantamentos e suprimentos' },
  { label: 'Emendas Parlamentares', icon: 'pi pi-bookmark', href: '#emendas', description: 'Emendas parlamentares' },
  { label: 'Ordem Cronológica', icon: 'pi pi-calendar', href: '#ordem-cronologica', description: 'Pagamentos em ordem cronológica' },
  { label: 'Convênios', icon: 'pi pi-link', href: '#convenios', description: 'Parcerias e repasses' },
  { label: 'Legislação', icon: 'pi pi-book', href: '#legislacao', description: 'Leis e normas' },
]
</script>

<template>
  <section class="bg-white py-4 px-4 sm:py-8" aria-label="Acesso rápido às informações">
    <div class="container">
      <div class="p-3 sm:p-6">
        <!--
          Mobile: 2 colunas (ícone nítido)
          sm+:    8 colunas (uma linha)
        -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-2">
          <component
            :is="card.href.startsWith('/') ? RouterLink : 'a'"
            v-for="card in cards"
            :key="card.label"
            v-bind="card.href.startsWith('/') ? { to: card.href } : { href: card.href }"
            class="flex flex-col items-center gap-2 sm:gap-2 p-3 sm:p-4 rounded-xl border border-transparent hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-all group text-center min-h-[100px] sm:min-h-[auto]"
            :aria-label="`${card.label} — ${card.description}`"
          >
            <div class="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-white group-hover:ring-2 group-hover:ring-blue-300 transition-all shadow-sm flex-shrink-0">
              <i :class="[card.icon]" class="text-2xl sm:text-xl text-blue-600" aria-hidden="true" />
            </div>
            <span class="text-sm sm:text-xs font-semibold text-gray-700 group-hover:text-blue-700 transition-colors leading-tight">
              {{ card.label }}
            </span>
          </component>
        </div>
      </div>
    </div>
  </section>
</template>
