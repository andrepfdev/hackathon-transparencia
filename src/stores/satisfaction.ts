import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Avaliacao {
  pagina: string
  nota: number
  mensagem?: string
  timestamp: number
}

export const useSatisfactionStore = defineStore('satisfaction', () => {
  // Lista de avaliações da sessão atual
  const avaliacoes = ref<Avaliacao[]>([])

  // Verifica se uma página já foi avaliada
  function jaAvaliou(pagina: string): boolean {
    return avaliacoes.value.some(a => a.pagina === pagina)
  }

  // Registra uma nova avaliação
  function registrarAvaliacao(pagina: string, nota: number, mensagem?: string) {
    // Remove avaliação anterior da mesma página (se existir)
    avaliacoes.value = avaliacoes.value.filter(a => a.pagina !== pagina)
    
    // Adiciona nova avaliação
    avaliacoes.value.push({
      pagina,
      nota,
      mensagem: mensagem?.trim() || undefined,
      timestamp: Date.now(),
    })
  }

  // Obtém avaliação de uma página específica
  function getAvaliacao(pagina: string): Avaliacao | undefined {
    return avaliacoes.value.find(a => a.pagina === pagina)
  }

  // Estatísticas gerais da sessão
  const mediaGeral = computed(() => {
    if (avaliacoes.value.length === 0) return 0
    const soma = avaliacoes.value.reduce((acc, a) => acc + a.nota, 0)
    return soma / avaliacoes.value.length
  })

  const totalAvaliacoes = computed(() => avaliacoes.value.length)

  return {
    avaliacoes,
    jaAvaliou,
    registrarAvaliacao,
    getAvaliacao,
    mediaGeral,
    totalAvaliacoes,
  }
})
