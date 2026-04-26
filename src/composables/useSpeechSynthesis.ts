import { ref } from 'vue'

// Seleciona a melhor voz pt-BR disponível, preferindo Google
function escolherVoz(): SpeechSynthesisVoice | null {
  const vozes = window.speechSynthesis.getVoices()
  const ptBR = vozes.filter((v) => v.lang === 'pt-BR' || v.lang === 'pt_BR')
  return (
    ptBR.find((v) => v.name.toLowerCase().includes('google')) ??
    ptBR.find((v) => !v.localService) ?? // voz online tende a ser melhor
    ptBR[0] ??
    null
  )
}

// Converte número inteiro em palavras para pt-BR (até bilhões)
function inteiroParaPalavras(n: number): string {
  if (n === 0) return 'zero'

  const bilhoes = Math.floor(n / 1_000_000_000)
  const resto1 = n % 1_000_000_000
  const milhoes = Math.floor(resto1 / 1_000_000)
  const resto2 = resto1 % 1_000_000
  const mil = Math.floor(resto2 / 1_000)
  const unidades = resto2 % 1_000

  const partes: string[] = []
  if (bilhoes === 1) partes.push('1 bilhão')
  else if (bilhoes > 1) partes.push(`${bilhoes} bilhões`)

  if (milhoes === 1) partes.push('1 milhão')
  else if (milhoes > 1) partes.push(`${milhoes} milhões`)

  if (mil > 0) partes.push(`${mil} mil`)
  if (unidades > 0) partes.push(String(unidades))

  return partes.join(', ')
}

// Converte "R$ 10.897.234.567,89" → "10 bilhões, 897 milhões, 234 mil e 567 reais e 89 centavos"
function moedaParaFala(match: string): string {
  const semSimbolo = match.replace(/R\$\s*/, '').trim()
  const [intStr = '', centStr = '00'] = semSimbolo.split(',')
  const intNum = parseInt(intStr.replace(/\./g, ''), 10)
  const centNum = parseInt(centStr.padEnd(2, '0').slice(0, 2), 10)

  if (isNaN(intNum)) return match

  let resultado = inteiroParaPalavras(intNum)
  resultado += intNum === 1 ? ' real' : ' reais'
  if (centNum > 0) resultado += ` e ${centNum} centavo${centNum > 1 ? 's' : ''}`

  return resultado
}

// Pré-processa o texto para tornar a leitura natural
function prepararParaFala(text: string): string {
  return text
    // Remove markdown
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/#+\s/g, '')
    .replace(/📊/g, '')
    // Converte valores monetários ANTES de qualquer outra limpeza
    .replace(/R\$\s*[\d.]+(?:,\d{2})?/g, moedaParaFala)
    // Percentuais: "85%" → "85 por cento"
    .replace(/(\d+(?:,\d+)?)\s*%/g, '$1 por cento')
    // Números com separador de milhar soltos (ex: "1.234 registros")
    .replace(/\b(\d{1,3}(?:\.\d{3})+)\b/g, (m) => m.replace(/\./g, ''))
    // Normaliza espaços
    .replace(/\s+/g, ' ')
    .trim()
}

export function useSpeechSynthesis() {
  const isSpeaking = ref(false)
  const isEnabled = ref(true)

  // Pré-carrega as vozes (Chrome carrega de forma assíncrona)
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
  }

  function speak(text: string) {
    if (!isEnabled.value || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const cleanText = prepararParaFala(text)
    if (!cleanText) return

    // Divide por sentenças para evitar limite do browser e melhorar naturalidade
    const chunks = cleanText.match(/[^.!?\n]+[.!?\n]*/g) ?? [cleanText]
    let index = 0
    const voz = escolherVoz()

    function speakNext() {
      if (index >= chunks.length || !isEnabled.value) {
        isSpeaking.value = false
        return
      }

      const chunk = (chunks[index] ?? '').trim()
      if (!chunk) {
        index++
        speakNext()
        return
      }

      const utterance = new SpeechSynthesisUtterance(chunk)
      utterance.lang = 'pt-BR'
      utterance.rate = 1.2   // mais vivo
      utterance.pitch = 1.05 // levemente mais agudo — soa mais natural
      if (voz) utterance.voice = voz

      if (index === 0) utterance.onstart = () => { isSpeaking.value = true }

      utterance.onend = () => { index++; speakNext() }
      utterance.onerror = () => { isSpeaking.value = false }

      window.speechSynthesis.speak(utterance)
    }

    speakNext()
  }

  function stop() {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
  }

  function toggle() {
    isEnabled.value = !isEnabled.value
    if (!isEnabled.value) stop()
  }

  return { isSpeaking, isEnabled, speak, stop, toggle }
}
