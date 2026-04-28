<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Service {
  title: string
  description: string
  icon: string
  href: string
  badge?: string
  badgeColor?: string
}

const services: Service[] = [
  {
    title: 'Despesas',
    description: 'Veja onde e como o governo está gastando o dinheiro público por secretaria, função e fornecedor.',
    icon: 'pi pi-chart-bar',
    href: '/despesas',
    badge: 'Mais acessado',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Remuneração de Servidores',
    description: 'Consulte salários, descontos e remuneração líquida dos funcionários públicos estaduais.',
    icon: 'pi pi-chart-line',
    href: '/remuneracao',
    badge: 'Atualizado',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    title: 'Quadro de Pessoal',
    description: 'Conheça o quadro de servidores: cargo, órgão, vínculo e situação funcional.',
    icon: 'pi pi-users',
    href: '/pessoal',
  },
  {
    title: 'Contratos & Licitações',
    description: 'Acompanhe as compras e contratações de serviços e obras realizadas pelo estado.',
    icon: 'pi pi-file-edit',
    href: '#contratos',
  },
  {
    title: 'Receitas do Estado',
    description: 'Entenda de onde vem o dinheiro arrecadado: impostos, transferências e outras fontes.',
    icon: 'pi pi-money-bill',
    href: '#receitas',
  },
  {
    title: 'Assistente IA',
    description: 'Faça perguntas em linguagem natural e obtenha respostas sobre os dados do portal.',
    icon: 'pi pi-sparkles',
    href: '/busca-inteligente',
    badge: 'Novo',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
]
</script>

<template>
  <section class="py-10 px-4 bg-gray-50 border-t border-gray-100" aria-labelledby="services-heading">
    <div class="container">
      <div class="flex items-end justify-between mb-7">
        <div>
          <h2 id="services-heading" class="text-xl font-bold text-[#1a3a6e]">Serviços em Destaque</h2>
          <p class="text-sm text-gray-400 mt-0.5">Os mais consultados pelos cidadãos maranhenses</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <component
          :is="service.href.startsWith('/') ? RouterLink : 'a'"
          v-for="service in services"
          :key="service.title"
          v-bind="service.href.startsWith('/') ? { to: service.href } : { href: service.href }"
          class="group flex flex-col bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-11 h-11 rounded-xl bg-[#1a3a6e]/8 flex items-center justify-center group-hover:bg-[#1a3a6e]/15 transition-colors">
              <i :class="service.icon" class="text-xl text-[#1a3a6e]" aria-hidden="true" />
            </div>
            <span
              v-if="service.badge"
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              :class="service.badgeColor"
            >
              {{ service.badge }}
            </span>
          </div>

          <h3 class="font-bold text-gray-800 group-hover:text-[#1a3a6e] transition-colors text-sm leading-snug mb-2">
            {{ service.title }}
          </h3>
          <p class="text-xs text-gray-500 leading-relaxed flex-1">
            {{ service.description }}
          </p>

          <div class="flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
            <span>Acessar</span>
            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
          </div>
        </component>
      </div>
    </div>
  </section>
</template>
