<script setup lang="ts">
interface AccessCard {
  label: string
  icon: string
  href: string
  color: string
  description: string
}

const cards: AccessCard[] = [
  { label: 'Despesas', icon: 'pi pi-chart-bar', href: '#despesas', color: 'text-blue-600', description: 'Gastos do Estado' },
  { label: 'Receitas', icon: 'pi pi-money-bill', href: '#receitas', color: 'text-green-600', description: 'Arrecadação pública' },
  { label: 'Servidores', icon: 'pi pi-users', href: '#servidores', color: 'text-blue-500', description: 'Folha de pagamento' },
  { label: 'Contratos', icon: 'pi pi-file', href: '#contratos', color: 'text-indigo-600', description: 'Contratos vigentes' },
  { label: 'Licitações', icon: 'pi pi-search', href: '#licitacoes', color: 'text-cyan-600', description: 'Processos licitatórios' },
  { label: 'Convênios', icon: 'pi pi-link', href: '#convenios', color: 'text-teal-600', description: 'Parcerias e repasses' },
  { label: 'Obras', icon: 'pi pi-building', href: '#obras', color: 'text-orange-500', description: 'Obras e investimentos' },
  { label: 'Legislação', icon: 'pi pi-book', href: '#legislacao', color: 'text-purple-600', description: 'Leis e normas' },
]
</script>

<template>
  <section class="py-4 px-4 sm:py-8" aria-label="Acesso rápido às informações">
    <div class="container">
      <div class="bg-white rounded-2xl shadow-md border border-gray-300 p-3 sm:p-6">
        <!--
          Mobile: 2 colunas (ícone nítido)
          sm+:    8 colunas (uma linha)
        -->
        <div class="grid grid-cols-2 sm:grid-cols-8 gap-1 sm:gap-2">
          <a
            v-for="card in cards"
            :key="card.label"
            :href="card.href"
            class="flex flex-col items-center gap-2 sm:gap-2 p-3 sm:p-4 rounded-xl border border-transparent hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-all group text-center min-h-[100px] sm:min-h-[auto]"
            :aria-label="`${card.label} — ${card.description}`"
          >
            <div class="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-white group-hover:ring-2 group-hover:ring-blue-300 transition-all shadow-sm flex-shrink-0">
              <i :class="[card.icon, card.color]" class="text-2xl sm:text-xl" aria-hidden="true" />
            </div>
            <span class="text-sm sm:text-xs font-semibold text-gray-700 group-hover:text-blue-700 transition-colors leading-tight">
              {{ card.label }}
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
