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
  <section class="bg-gray-50 border-b border-gray-200 py-8 px-4 md:py-12">
    <div class="container text-center">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-[#1a3a6e] mb-2 leading-tight">
        O que você procura no Portal?
      </h1>
      <p class="text-gray-500 text-sm mb-6 max-w-md mx-auto">
        Use termos simples. Ex: salário de servidores, obras na minha cidade, contratos de merenda.
      </p>

      <form
        class="flex items-stretch max-w-xl mx-auto mb-4 shadow-md rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-white overflow-hidden"
        @submit.prevent="onSearch"
      >
        <label for="hero-search" class="sr-only">Buscar informações no Portal</label>
        <div class="flex-1 flex items-center px-4">
          <i class="pi pi-search text-gray-400 mr-3 flex-shrink-0 text-sm" aria-hidden="true" />
          <input
            id="hero-search"
            v-model="searchQuery"
            type="text"
            placeholder="Digite o que deseja encontrar..."
            class="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent py-3.5 border-none shadow-none ring-0"
            autocomplete="off"
            enterkeyhint="search"
          />
        </div>
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 sm:px-7 py-3.5 text-sm transition-colors flex-shrink-0"
        >
          <i class="pi pi-search mr-1.5 text-xs" aria-hidden="true" />
          Buscar
        </button>
      </form>

      <div class="flex items-center justify-center gap-2 flex-wrap">
        <span class="text-xs text-gray-400">Populares:</span>
        <button
          v-for="term in quickSearches"
          :key="term"
          class="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded-full px-3 py-1.5 bg-white transition-colors min-h-[36px]"
          @click="searchTerm(term)"
        >
          {{ term }}
        </button>
      </div>
    </div>
  </section>
</template>
