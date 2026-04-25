<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { enviarMensagem } from '@/services/geminiAgent'
import type { MensagemHistorico } from '@/services/geminiAgent'

const router = useRouter()

interface Mensagem {
  id: number
  role: 'user' | 'agent'
  texto: string
  linkDetalhe?: string
  linkLabel?: string
  carregando?: boolean
}

const SUGESTOES = [
  'Quanto a Saúde gastou em 2025?',
  'Quantos servidores públicos existem?',
  'Quais contratos estão vigentes?',
  'De onde vem o dinheiro do MA?',
]

const mensagens = ref<Mensagem[]>([
  {
    id: 0,
    role: 'agent',
    texto:
      'Olá! Sou o assistente de transparência do Maranhão. Posso ajudar você a consultar despesas, servidores públicos, contratos e receitas do estado. Como posso ajudar?',
  },
])

const inputTexto = ref('')
const carregando = ref(false)
const areaRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
let proximoId = 1

const historico = ref<MensagemHistorico[]>([])

function rolarParaBaixo() {
  nextTick(() => {
    if (areaRef.value) {
      areaRef.value.scrollTop = areaRef.value.scrollHeight
    }
  })
}

function ajustarAlturaInput() {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

const LINKS_DETALHE: Record<string, string> = {
  '/despesas': 'Ver despesas detalhadas →',
  '/servidores': 'Ver servidores públicos →',
  '/contratos': 'Ver contratos →',
  '/receitas': 'Ver receitas →',
}

async function enviar(textoOverride?: string) {
  const texto = (textoOverride ?? inputTexto.value).trim()
  if (!texto || carregando.value) return

  inputTexto.value = ''
  if (inputRef.value) inputRef.value.style.height = 'auto'

  const idUsuario = proximoId++
  mensagens.value.push({ id: idUsuario, role: 'user', texto })
  rolarParaBaixo()

  const idAgente = proximoId++
  mensagens.value.push({ id: idAgente, role: 'agent', texto: '', carregando: true })
  carregando.value = true
  rolarParaBaixo()

  const resposta = await enviarMensagem(texto, historico.value)

  historico.value.push({ role: 'user', text: texto })
  historico.value.push({ role: 'assistant', text: resposta.mensagem })
  // mantém histórico enxuto (últimas 10 trocas)
  if (historico.value.length > 20) historico.value = historico.value.slice(-20)

  const idx = mensagens.value.findIndex((m) => m.id === idAgente)
  if (idx !== -1) {
    mensagens.value[idx] = {
      id: idAgente,
      role: 'agent',
      texto: resposta.mensagem,
      carregando: false,
      linkDetalhe: resposta.linkDetalhe ?? undefined,
      linkLabel: resposta.linkDetalhe ? LINKS_DETALHE[resposta.linkDetalhe] : undefined,
    }
  }

  carregando.value = false
  rolarParaBaixo()
  inputRef.value?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    enviar()
  }
}

function navegarDetalhe(link: string) {
  router.push(link)
}

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50">
    <AppHeader />

    <main id="main-content" tabindex="-1" class="flex flex-1 flex-col">
      <!-- Cabeçalho da página -->
      <div class="border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div class="mx-auto flex max-w-3xl items-center gap-3 pt-4">
          <button
            type="button"
            class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            aria-label="Voltar para a página anterior"
            @click="router.back()"
          >
            <i class="pi pi-arrow-left text-lg" aria-hidden="true" />
          </button>
          <div class="flex items-center gap-2">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700"
              aria-hidden="true"
            >
              <i class="pi pi-sparkles text-sm" />
            </span>
            <div>
              <h1 class="text-base font-semibold text-gray-900">Assistente de Transparência</h1>
              <p class="text-xs text-gray-500">Powered by Gemini · dados do MA</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Área de mensagens -->
      <div
        ref="areaRef"
        role="log"
        aria-label="Conversa com o assistente"
        aria-live="polite"
        class="flex-1 overflow-y-auto px-4 py-12 sm:px-6"
      >
        <div class="mx-auto max-w-3xl space-y-4">
          <template v-for="msg in mensagens" :key="msg.id">
            <!-- Mensagem do agente -->
            <div v-if="msg.role === 'agent'" class="flex items-start gap-3">
              <span
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700"
                aria-hidden="true"
              >
                <i class="pi pi-sparkles text-sm" />
              </span>
              <div class="flex flex-col gap-2">
                <!-- Bolha de carregando -->
                <div
                  v-if="msg.carregando"
                  class="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100"
                  aria-label="Assistente está respondendo"
                >
                  <div class="flex gap-1.5">
                    <span class="animate-bounce h-2 w-2 rounded-full bg-gray-400 [animation-delay:0ms]" />
                    <span class="animate-bounce h-2 w-2 rounded-full bg-gray-400 [animation-delay:150ms]" />
                    <span class="animate-bounce h-2 w-2 rounded-full bg-gray-400 [animation-delay:300ms]" />
                  </div>
                </div>
                <!-- Bolha com texto -->
                <div
                  v-else
                  class="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100"
                >
                  <p class="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{{ msg.texto }}</p>
                </div>
                <!-- Botão de ver detalhes -->
                <button
                  v-if="msg.linkDetalhe && !msg.carregando"
                  type="button"
                  class="inline-flex min-h-[44px] items-center gap-1.5 self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  @click="navegarDetalhe(msg.linkDetalhe!)"
                >
                  {{ msg.linkLabel }}
                  <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                </button>
              </div>
            </div>

            <!-- Mensagem do usuário -->
            <div v-else class="flex items-start justify-end gap-3">
              <div
                class="max-w-[80%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 shadow-sm"
              >
                <p class="whitespace-pre-wrap text-sm leading-relaxed text-white">{{ msg.texto }}</p>
              </div>
              <span
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600"
                aria-hidden="true"
              >
                <i class="pi pi-user text-sm" />
              </span>
            </div>
          </template>
        </div>
      </div>

      <!-- Sugestões rápidas (só quando vazia ou 1 msg) -->
      <div
        v-if="mensagens.length <= 1"
        class="border-t border-gray-100 bg-white px-4 py-3 sm:px-6"
      >
        <div class="mx-auto max-w-3xl">
          <p class="mb-2 text-xs font-medium text-gray-500">Sugestões:</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="sugestao in SUGESTOES"
              :key="sugestao"
              type="button"
              class="min-h-[36px] rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              @click="enviar(sugestao)"
            >
              {{ sugestao }}
            </button>
          </div>
        </div>
      </div>

      <!-- Input de mensagem -->
      <div class="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div class="mx-auto flex max-w-3xl items-end gap-2">
          <div class="relative flex-1">
            <textarea
              ref="inputRef"
              v-model="inputTexto"
              rows="1"
              placeholder="Digite sua pergunta sobre os dados do MA..."
              aria-label="Digite sua pergunta"
              class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              style="min-height: 44px; max-height: 120px"
              :disabled="carregando"
              @input="ajustarAlturaInput"
              @keydown="onKeydown"
            />
          </div>
          <button
            type="button"
            class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
            aria-label="Enviar pergunta"
            :disabled="carregando || !inputTexto.trim()"
            @click="enviar()"
          >
            <i class="pi pi-send text-sm" aria-hidden="true" />
          </button>
        </div>
        <p class="mx-auto mt-1.5 max-w-3xl text-center text-xs text-gray-400">
          Os dados exibidos são simulados para fins de demonstração.
        </p>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
