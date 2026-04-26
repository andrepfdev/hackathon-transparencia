<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSatisfactionStore } from '@/stores/satisfaction'

const route = useRoute()
const satisfactionStore = useSatisfactionStore()

const paginaAtual = computed(() => route.name as string || route.path)
const jaEnviou = computed(() => satisfactionStore.jaAvaliou(paginaAtual.value))

const notaSelecionada = ref(0)
const notaHover = ref(0)
const mensagem = ref('')
const enviado = ref(false)
const mostrarToast = ref(false)

const MAX_CARACTERES = 200

const podeEnviar = computed(() => notaSelecionada.value > 0)
const caracteresRestantes = computed(() => MAX_CARACTERES - mensagem.value.length)

function selecionarNota(nota: number) {
  if (!enviado.value) {
    notaSelecionada.value = nota
  }
}

function enviarAvaliacao() {
  if (!podeEnviar.value) return
  
  satisfactionStore.registrarAvaliacao(
    paginaAtual.value,
    notaSelecionada.value,
    mensagem.value
  )
  
  enviado.value = true
  mostrarToast.value = true
  setTimeout(() => { mostrarToast.value = false }, 3500)
}

function getLabelEstrela(nota: number): string {
  const labels: Record<number, string> = {
    1: 'Muito ruim',
    2: 'Ruim',
    3: 'Regular',
    4: 'Bom',
    5: 'Excelente',
  }
  return labels[nota] || ''
}
</script>

<template>
  <section 
    v-if="!jaEnviou"
    class="bg-white border-t border-gray-200 py-8 sm:py-12 px-4"
    aria-labelledby="satisfaction-title"
  >
    <div class="max-w-2xl mx-auto text-center">
      <!-- Título -->
      <h2 
        id="satisfaction-title" 
        class="text-lg sm:text-xl font-semibold text-gray-800 mb-2"
      >
        Como foi sua experiência nesta página?
      </h2>
      <p class="text-sm text-gray-500 mb-6">
        Sua avaliação ajuda a melhorar o portal
      </p>

      <!-- Estado: Formulário -->
      <div v-if="!enviado" class="space-y-6">
        <!-- Estrelas -->
        <div 
          class="flex items-center justify-center gap-2"
          role="radiogroup" 
          aria-label="Avalie de 1 a 5 estrelas"
        >
          <button
            v-for="nota in 5"
            :key="nota"
            type="button"
            class="p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
            :aria-label="`${nota} estrelas - ${getLabelEstrela(nota)}`"
            :aria-checked="notaSelecionada === nota"
            role="radio"
            @mouseenter="notaHover = nota"
            @mouseleave="notaHover = 0"
            @click="selecionarNota(nota)"
          >
            <i
              class="text-2xl sm:text-3xl transition-colors duration-200"
              :class="[
                (notaHover || notaSelecionada) >= nota 
                  ? 'pi pi-star-fill text-yellow-400' 
                  : 'pi pi-star text-gray-300'
              ]"
              aria-hidden="true"
            />
          </button>
        </div>

        <!-- Label da nota selecionada -->
        <p 
          v-if="notaSelecionada > 0" 
          class="text-sm font-medium text-gray-600"
          aria-live="polite"
        >
          {{ getLabelEstrela(notaSelecionada) }}
        </p>

        <!-- Campo de mensagem opcional -->
        <div class="space-y-2">
          <label 
            for="satisfaction-message" 
            class="block text-sm text-gray-600 text-left"
          >
            Comentário (opcional)
          </label>
          <textarea
            id="satisfaction-message"
            v-model="mensagem"
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            :maxlength="MAX_CARACTERES"
            placeholder="Conte-nos como podemos melhorar..."
          />
          <p class="text-xs text-gray-400 text-right">
            {{ caracteresRestantes }} caracteres restantes
          </p>
        </div>

        <!-- Botão enviar -->
        <button
          type="button"
          class="min-h-[44px] px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="[
            podeEnviar 
              ? 'bg-[#1a3a6e] text-white hover:bg-blue-800' 
              : 'bg-gray-200 text-gray-500'
          ]"
          :disabled="!podeEnviar"
          @click="enviarAvaliacao"
        >
          Enviar avaliação
        </button>
      </div>

      <!-- Estado: Agradecimento -->
      <div v-else class="space-y-4">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-2">
          <i class="pi pi-check text-3xl text-green-600" aria-hidden="true" />
        </div>
        <h3 class="text-lg font-semibold text-gray-800">
          Obrigado pela sua avaliação!
        </h3>
        <p class="text-sm text-gray-600">
          Sua opinião é muito importante para continuarmos melhorando.
        </p>
      </div>
    </div>
  </section>

  <!-- Toast de confirmação (fora do v-if/v-else para não quebrar a cadeia) -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="mostrarToast"
        role="status"
        aria-live="polite"
        class="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 rounded-xl bg-green-600 px-5 py-3.5 text-white shadow-lg"
      >
        <i class="pi pi-check-circle text-xl" aria-hidden="true" />
        <span class="text-sm font-medium">Avaliação enviada com sucesso!</span>
      </div>
    </Transition>
  </Teleport>
</template>
