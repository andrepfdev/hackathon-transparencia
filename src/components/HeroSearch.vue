<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const quickSearches = ['Mais buscados', 'Salários', 'Licitações', 'Obras']

function onSearch() {
  if (!searchQuery.value.trim()) return
  // TODO: integrar com API do portal
  console.log('Buscando:', searchQuery.value)
}
</script>

<template>
  <section class="bg-gray-50 border-b border-gray-200 py-12 px-4">
    <div class="container text-center">
      <h1 class="text-2xl md:text-3xl font-bold text-[#1a3a6e] mb-2">
        O que você procura no Portal?
      </h1>
      <p class="text-gray-500 text-sm mb-6">
        Use termos simples. Ex: salário de servidores, obras na minha cidade,<br class="hidden md:block" />
        contratos de merenda.
      </p>

      <!-- Barra de busca -->
      <form class="flex items-center max-w-xl mx-auto mb-4 shadow-md rounded-lg overflow-hidden" @submit.prevent="onSearch">
        <label for="hero-search" class="sr-only">Buscar informações no Portal</label>
        <div class="flex-1 flex items-center bg-white px-4 py-3">
          <i class="pi pi-search text-gray-400 mr-3 flex-shrink-0" aria-hidden="true" />
          <input
            id="hero-search"
            v-model="searchQuery"
            type="search"
            placeholder="Digite aqui o que deseja encontrar..."
            class="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            autocomplete="off"
          />
        </div>
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 text-sm transition-colors flex-shrink-0"
        >
          Buscar
        </button>
      </form>

      <!-- Buscas rápidas -->
      <div class="flex items-center justify-center gap-2 flex-wrap">
        <span class="text-xs text-gray-400">Populares:</span>
        <button
          v-for="term in quickSearches"
          :key="term"
          class="text-xs text-blue-600 hover:text-blue-800 hover:underline border border-blue-200 rounded-full px-3 py-1 bg-white transition-colors"
          @click="searchQuery = term; onSearch()"
        >
          {{ term }}
        </button>
      </div>
    </div>
  </section>
</template>
