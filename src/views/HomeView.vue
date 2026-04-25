<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import HeroSearch from '@/components/HeroSearch.vue'
import QuickAccessCards from '@/components/QuickAccessCards.vue'
import TransparencyNumbers from '@/components/TransparencyNumbers.vue'
import MostAccessedServices from '@/components/MostAccessedServices.vue'
import InstitutionalLogos from '@/components/InstitutionalLogos.vue'
import CidadeTransparencia from '@/components/CidadeTransparencia.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader />
    <main id="main-content" tabindex="-1" class="outline-none">
      <HeroSearch />
      <QuickAccessCards />
      <TransparencyNumbers />
      <MostAccessedServices />
      <InstitutionalLogos />
      <CidadeTransparencia />
    </main>
    <AppFooter />

    <!-- Botão flutuante: Assistente IA -->
    <button
      type="button"
      class="fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:right-6"
      aria-label="Abrir assistente de busca inteligente"
      @click="router.push('/busca-inteligente')"
    >
      <i class="pi pi-sparkles text-base" aria-hidden="true" />
      <span class="text-sm font-medium">Pergunte ao assistente</span>
    </button>
  </div>
</template>
