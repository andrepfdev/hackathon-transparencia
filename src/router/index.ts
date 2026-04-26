import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/despesas',
      name: 'despesas',
      component: () => import('@/views/DespesasView.vue'),
    },
    {
      path: '/busca-inteligente',
      name: 'busca-inteligente',
      component: () => import('@/views/BuscaInteligenteView.vue'),
    },
    {
      path: '/remuneracao',
      name: 'remuneracao',
      component: () => import('@/views/RemuneracaoView.vue'),
    },
    {
      path: '/pessoal',
      name: 'pessoal',
      component: () => import('@/views/PessoalView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
