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
  <section class="py-10 px-4 bg-gray-50" aria-labelledby="services-heading">
    <div class="container">
      <div class="text-center mb-8">
        <h2 id="services-heading" class="text-2xl font-bold text-[#1a3a6e] mb-2">
          Serviços Mais Acessados
        </h2>
        <p class="text-gray-500 text-sm">
          Acesse de forma rápida e clara as informações mais procuradas pelos cidadãos maranhenses.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          v-for="service in services"
          :key="service.title"
          :href="service.href"
          class="group bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all relative overflow-hidden"
          :class="service.featured ? 'border-blue-100 bg-blue-50' : ''"
        >
          <div class="flex items-start justify-between mb-4">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="service.featured ? 'bg-blue-100' : 'bg-gray-50 group-hover:bg-blue-50'"
            >
              <i :class="service.icon" class="text-blue-600 text-lg" aria-hidden="true" />
            </div>
            <i class="pi pi-arrow-right text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" aria-hidden="true" />
          </div>

          <h3 class="font-semibold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">
            {{ service.title }}
          </h3>
          <p class="text-xs text-gray-500 leading-relaxed">
            {{ service.description }}
          </p>
        </a>
      </div>
    </div>
  </section>
</template>
