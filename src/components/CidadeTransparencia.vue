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
      <div class="bg-gradient-to-br from-[#1a3a6e] to-[#0f2447] rounded-2xl overflow-hidden shadow-lg">
        <div class="flex flex-col md:flex-row items-stretch">

          <!-- Lado esquerdo: texto + form -->
          <div class="flex-1 p-7 md:p-10">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-1 h-5 bg-[#c0392b] rounded-full" aria-hidden="true" />
              <p class="text-xs font-bold uppercase tracking-widest text-blue-300">Rede de Transparência Municipal</p>
            </div>
            <h2 id="cidade-heading" class="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
              E a transparência na sua cidade, como está?
            </h2>
            <p class="text-blue-200 text-sm mb-6 max-w-md leading-relaxed">
              Selecione um município do Maranhão e consulte o portal de transparência local. Fonte: FAMEM.
            </p>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select
                v-model="municipioSelecionado"
                class="flex-1 sm:max-w-xs border-0 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                aria-label="Selecione um município"
              >
                <option value="" disabled>Selecione um município...</option>
                <option v-for="municipio in municipios" :key="municipio.nome" :value="municipio.nome">
                  {{ municipio.nome }}
                </option>
              </select>

              <button
                type="button"
                class="flex items-center justify-center gap-2 text-sm font-bold px-6 py-3 rounded-xl transition-all duration-200"
                :class="municipioSelecionado
                  ? 'bg-[#c0392b] hover:bg-[#a93226] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'"
                :disabled="!municipioSelecionado"
                @click="acessarPortal"
              >
                <i class="pi pi-external-link" aria-hidden="true" />
                Acessar Portal
              </button>
            </div>
          </div>

          <!-- Lado direito: bússola decorativa (apenas md+) -->
          <div
            class="hidden md:flex items-center justify-center w-48 bg-white/5 border-l border-white/10 flex-shrink-0"
            aria-hidden="true"
          >
            <img src="/img/bussola.gif" alt="" class="w-24 h-24 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
