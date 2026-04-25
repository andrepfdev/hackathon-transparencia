<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const quickSearches = ['Salários', 'Licitações', 'Obras', 'Contratos']

function onSearch() {
  if (!searchQuery.value.trim()) return
  console.log('Buscando:', searchQuery.value)
}

function searchTerm(term: string) {
  searchQuery.value = term
  onSearch()
}
</script>

<template>
  <section
    class="relative border-b border-gray-800 py-12 px-4 md:py-20 overflow-hidden"
    style="background-image: url('/img/cultura_maranhao.webp'); background-size: cover; background-position: center;"
  >
    <!-- overlay escuro -->
    <div class="absolute inset-0 bg-black/55" aria-hidden="true" />

    <div class="relative container text-center">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight drop-shadow-md">
        O que você procura no Portal?
      </h1>
      <p class="text-blue-100 text-sm mb-6 max-w-md mx-auto drop-shadow">
        Use termos simples. Ex: salário de servidores, obras na minha cidade, contratos de merenda.
      </p>

      <!-- Wrapper externo: cuida da borda, ring e cantos arredondados -->
      <div
        class="flex items-stretch max-w-xl mx-auto mb-4 rounded-xl border border-gray-300 shadow-md bg-white overflow-hidden
               focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.2)] transition-all"
      >
        <label for="hero-search" class="sr-only">Buscar informações no Portal</label>
        <form class="flex flex-1 items-center px-4" @submit.prevent="onSearch">
          <i class="pi pi-search text-gray-400 mr-3 flex-shrink-0 text-sm" aria-hidden="true" />
          <input
            id="hero-search"
            v-model="searchQuery"
            type="text"
            placeholder="Digite o que deseja encontrar..."
            class="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent py-3.5"
            autocomplete="off"
            enterkeyhint="search"
          />
        </form>
        <button
          type="button"
          class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 sm:px-7 py-3.5 text-sm transition-colors flex-shrink-0 flex items-center gap-1.5"
          @click="onSearch"
        >
          <i class="pi pi-search text-xs" aria-hidden="true" />
          Buscar
        </button>
      </div>

      <div class="flex items-center justify-center gap-2 flex-wrap">
        <span class="text-xs text-blue-200">Populares:</span>
        <button
          v-for="term in quickSearches"
          :key="term"
          class="text-xs text-white hover:text-white border border-white/30 hover:border-white/60 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors min-h-[36px]"
          @click="searchTerm(term)"
        >
          {{ term }}
        </button>
      </div>
    </div>
  </section>
</template>
