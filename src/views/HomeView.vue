<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import HeroSearch from '@/components/HeroSearch.vue'
import QuickAccessCards from '@/components/QuickAccessCards.vue'
import TransparencyNumbers from '@/components/TransparencyNumbers.vue'
import MostAccessedServices from '@/components/MostAccessedServices.vue'
import InstitutionalLogos from '@/components/InstitutionalLogos.vue'
import CidadeTransparencia from '@/components/CidadeTransparencia.vue'
import AppFooter from '@/components/AppFooter.vue'
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
  </div>
</template>
