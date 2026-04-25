<script setup lang="ts">
import { ref, computed } from 'vue'
import municipiosData from '@/data/mock/municipios.json'

interface Municipio {
  nome: string
  url: string
}

const municipios: Municipio[] = municipiosData

const municipioSelecionado = ref<string>('')

const urlSelecionada = computed(() => {
  const found = municipios.find((m) => m.nome === municipioSelecionado.value)
  return found?.url ?? ''
})

function acessarPortal() {
  if (urlSelecionada.value) {
    window.open(urlSelecionada.value, '_blank', 'noopener,noreferrer')
  }
}
</script>

<template>
  <section class="py-10 px-4 bg-white border-t border-gray-100" aria-labelledby="cidade-heading">
    <div class="container">
      <h2 id="cidade-heading" class="text-xl font-bold text-[#1a3a6e] mb-2">
        E a Transparência em sua cidade, como está?
      </h2>
      <p class="text-gray-500 text-sm mb-6">
        Quer saber se sua cidade possui portal da transparência? Selecione e consulte.
        <span class="text-gray-400">(Fonte: site da FAMEM)</span>
      </p>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <!-- Ícone bússola -->
        <div
          class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0"
          aria-hidden="true"
        >
          <img src="/img/bussola.gif" alt=""">
        </div>

        <!-- Select de município -->
        <select
          v-model="municipioSelecionado"
          class="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-full sm:w-72 cursor-pointer"
          aria-label="Selecione um município"
        >
          <option value="" disabled>Selecione um município</option>
          <option v-for="municipio in municipios" :key="municipio.nome" :value="municipio.nome">
            {{ municipio.nome }}
          </option>
        </select>

        <!-- Botão acessar portal -->
        <button
          v-if="municipioSelecionado"
          type="button"
          class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
          @click="acessarPortal"
        >
          <i class="pi pi-external-link" aria-hidden="true" />
          Acessar Portal
        </button>
      </div>
    </div>
  </section>
</template>
