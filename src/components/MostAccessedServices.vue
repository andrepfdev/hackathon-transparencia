<script setup lang="ts">
interface Service {
  title: string
  description: string
  icon: string
  href: string
  featured?: boolean
}

const services: Service[] = [
  {
    title: 'Despesas',
    description: 'Veja onde e como o governo está gastando o dinheiro público.',
    icon: 'pi pi-chart-bar',
    href: '#despesas',
  },
  {
    title: 'Contratos & Licitações',
    description: 'Acompanhe as compras e contratações de serviços do estado.',
    icon: 'pi pi-file-edit',
    href: '#contratos',
  },
  {
    title: 'Servidores',
    description: 'Consulte salários, cargos e informações sobre os funcionários públicos.',
    icon: 'pi pi-users',
    href: '#servidores',
  },
  {
    title: 'Receitas',
    description: 'Entenda de onde vem o dinheiro arrecadado pelo governo.',
    icon: 'pi pi-money-bill',
    href: '#receitas',
  },
  {
    title: 'Obras Públicas',
    description: 'Acompanhe o andamento e custos das obras do seu município.',
    icon: 'pi pi-building',
    href: '#obras',
  },
  {
    title: 'Ver todos os serviços',
    description: 'Explore o catálogo completo de informações disponíveis.',
    icon: 'pi pi-th-large',
    href: '#servicos',
    featured: true,
  },
]
</script>

<template>
  <section class="py-8 px-4 md:py-10 bg-gray-50" aria-labelledby="services-heading">
    <div class="container">
      <div class="text-center mb-6 sm:mb-8">
        <h2 id="services-heading" class="text-xl sm:text-2xl font-bold text-[#1a3a6e] mb-2">
          Serviços Mais Acessados
        </h2>
        <p class="text-gray-500 text-sm max-w-md mx-auto">
          Acesse de forma rápida e clara as informações mais procuradas pelos cidadãos maranhenses.
        </p>
      </div>

      <!--
        Mobile:  1 coluna (cards empilhados, fáceis de tocar)
        sm:      2 colunas
        lg:      3 colunas
      -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <a
          v-for="service in services"
          :key="service.title"
          :href="service.href"
          class="group flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-blue-200 active:bg-blue-50 transition-all min-h-[80px]"
          :class="service.featured ? 'border-blue-100 bg-blue-50 sm:col-span-2 lg:col-span-1' : ''"
        >
          <!-- Ícone -->
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            :class="service.featured ? 'bg-blue-100' : 'bg-gray-50 group-hover:bg-blue-50'"
          >
            <i :class="service.icon" class="text-blue-600 text-lg" aria-hidden="true" />
          </div>

          <!-- Texto -->
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors text-sm sm:text-base leading-snug">
              {{ service.title }}
            </h3>
            <p class="text-xs text-gray-500 leading-relaxed mt-0.5">
              {{ service.description }}
            </p>
          </div>

          <!-- Seta -->
          <i
            class="pi pi-arrow-right text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 self-center"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  </section>
</template>
