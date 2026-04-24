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
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
        <!--
          Mobile: 4 colunas (ícone compacto)
          sm+:    8 colunas (uma linha)
        -->
        <div class="grid grid-cols-4 sm:grid-cols-8 gap-1 sm:gap-2">
          <a
            v-for="card in cards"
            :key="card.label"
            :href="card.href"
            class="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-colors group text-center min-h-[72px] sm:min-h-[auto]"
            :aria-label="`${card.label} — ${card.description}`"
          >
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-white transition-colors shadow-sm flex-shrink-0">
              <i :class="[card.icon, card.color]" class="text-base sm:text-xl" aria-hidden="true" />
            </div>
            <span class="text-[10px] sm:text-xs font-semibold text-gray-700 group-hover:text-blue-700 transition-colors leading-tight">
              {{ card.label }}
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
