<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function voltarParaHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
    <div class="text-center max-w-md pb-12">
      <!-- Ícone de construção -->
      <div class="mb-6">
        <i
          class="pi pi-wrench text-6xl sm:text-7xl text-blue-500"
          aria-hidden="true"
        />
      </div>

      <!-- Código 404 -->
      <h1 class="text-6xl sm:text-7xl font-bold text-[#1a3a6e] mb-4">
        404
      </h1>

      <!-- Mensagem principal -->
      <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Página não encontrada
      </h2>

      <!-- Aviso de protótipo -->
      <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 sm:p-6 mb-6">
        <i
          class="pi pi-info-circle text-blue-500 text-2xl mb-3 block"
          aria-hidden="true"
        />
        <p class="text-base sm:text-lg text-gray-700 leading-relaxed">
          Este é um protótipo, essa página está sendo construída.
        </p>
      </div>

      <!-- Botão para voltar -->
      <button
        class="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 bg-[#1a3a6e] text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
        @click="voltarParaHome"
      >
        <i class="pi pi-home" aria-hidden="true" />
        <span>Voltar para a página inicial</span>
      </button>
    </div>

  </div>
</template>
