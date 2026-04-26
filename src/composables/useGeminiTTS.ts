import { ref } from 'vue'

const GEMINI_TTS_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent'

// ── Constantes ───────────────────────────────────────────────────────────────

const MAX_CHARS_PER_RESPONSE = 500
const MAX_CHARS_PER_CHUNK = 200

// ── Pré-processamento de texto ───────────────────────────────────────────────

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

function moedaParaFala(match: string): string {
  const semSimbolo = match.replace(/R\$/, '').trim()
  const [intStr = '', centStr = '00'] = semSimbolo.split(',')
  const intNum = parseInt(intStr.replace(/[^0-9]/g, ''), 10)
  const centNum = parseInt(centStr.padEnd(2, '0').slice(0, 2), 10)
  if (isNaN(intNum)) return match
  const usaDe = intNum >= 1_000_000
  let resultado = inteiroParaPalavras(intNum)
  resultado += intNum === 1 ? ' real' : usaDe ? ' de reais' : ' reais'
  if (centNum > 0) resultado += ` e ${centNum} centavo${centNum > 1 ? 's' : ''}`
  return resultado
}

function prepararParaFala(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/#+\s/g, '')
    .replace(/📊/g, '')
    .replace(/R\$[\s ]*[\d.,\s ]*\d,\d{2}/g, moedaParaFala)
    .replace(/(\d+(?:,\d+)?)\s*%/g, '$1 por cento')
    .replace(/\b(\d{1,3}(?:\.\d{3})+)\b/g, (m) => m.replace(/\./g, ''))
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Chunking de texto ────────────────────────────────────────────────────────

function splitIntoChunks(text: string): string[] {
  // Primeiro, truncar se exceder o limite máximo
  let processedText = text
  if (text.length > MAX_CHARS_PER_RESPONSE) {
    // Encontrar o último ponto final antes do limite
    const lastPeriodIndex = text.lastIndexOf('.', MAX_CHARS_PER_RESPONSE)
    const lastExclamationIndex = text.lastIndexOf('!', MAX_CHARS_PER_RESPONSE)
    const lastQuestionIndex = text.lastIndexOf('?', MAX_CHARS_PER_RESPONSE)
    
    const cutIndex = Math.max(lastPeriodIndex, lastExclamationIndex, lastQuestionIndex)
    
    if (cutIndex > MAX_CHARS_PER_RESPONSE * 0.5) {
      processedText = text.slice(0, cutIndex + 1) + ' Consulte o texto para mais detalhes.'
    } else {
      // Se não encontrou um bom ponto de corte, cortar no limite
      processedText = text.slice(0, MAX_CHARS_PER_RESPONSE) + '... Consulte o texto para mais detalhes.'
    }
  }
  
  const chunks: string[] = []
  const sentences = processedText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [processedText]
  
  let currentChunk = ''
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim()
    if (!trimmedSentence) continue
    
    // Se a sentença sozinha já é grande demais, dividir por vírgulas
    if (trimmedSentence.length > MAX_CHARS_PER_CHUNK) {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = ''
      }
      
      const parts = trimmedSentence.split(/,\s*/)
      for (const part of parts) {
        if ((currentChunk + part).length > MAX_CHARS_PER_CHUNK) {
          if (currentChunk) chunks.push(currentChunk.trim())
          currentChunk = part
        } else {
          currentChunk += (currentChunk ? ', ' : '') + part
        }
      }
    } else if ((currentChunk + ' ' + trimmedSentence).length > MAX_CHARS_PER_CHUNK) {
      if (currentChunk) chunks.push(currentChunk.trim())
      currentChunk = trimmedSentence
    } else {
      currentChunk += (currentChunk ? ' ' : '') + trimmedSentence
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim())
  
  return chunks.filter(chunk => chunk.length > 0)
}

// ── Composable ────────────────────────────────────────────────────────────────

export function useGeminiTTS() {
  const isSpeaking = ref(false)
  const isLoadingAudio = ref(false)
  const isEnabled = ref(true)

  let audioCtx: AudioContext | null = null
  let currentSource: AudioBufferSourceNode | null = null
  let audioQueue: AudioBuffer[] = []
  let abortController: AbortController | null = null

  function getCtx(): AudioContext {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContext()
    }
    return audioCtx
  }

  async function generateAudioChunk(chunkText: string, signal: AbortSignal): Promise<AudioBuffer | null> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
    if (!apiKey) return null

    try {
      const response = await fetch(`${GEMINI_TTS_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: chunkText }] }],
          generationConfig: {
            response_modalities: ['AUDIO'],
            speech_config: {
              voice_config: {
                prebuilt_voice_config: { voice_name: 'Aoede' },
              },
            },
          },
        }),
        signal,
      })

      if (!response.ok) {
        console.error('Gemini TTS error:', await response.text())
        return null
      }

      const json = await response.json()
      const inlineData = json.candidates?.[0]?.content?.parts?.[0]?.inlineData
      if (!inlineData?.data) return null

      // Decodifica base64 → PCM 16-bit signed little-endian @ 24000 Hz mono
      const binary = atob(inlineData.data)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

      const ctx = getCtx()
      if (ctx.state === 'suspended') await ctx.resume()

      const numSamples = bytes.length / 2
      const buffer = ctx.createBuffer(1, numSamples, 24000)
      const channel = buffer.getChannelData(0)
      const view = new DataView(bytes.buffer)
      for (let i = 0; i < numSamples; i++) {
        channel[i] = view.getInt16(i * 2, true) / 32768
      }

      return buffer
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Requisição foi abortada, isso é esperado quando o usuário interrompe
        return null
      }
      console.error('Gemini TTS chunk error:', err)
      return null
    }
  }

  function playNextInQueue() {
    if (audioQueue.length === 0) {
      isSpeaking.value = false
      return
    }

    const buffer = audioQueue.shift()
    if (!buffer) {
      playNextInQueue()
      return
    }

    const ctx = getCtx()
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(ctx.destination)
    
    source.onended = () => {
      playNextInQueue()
    }
    
    currentSource = source
    isSpeaking.value = true
    source.start()
  }

  async function speak(text: string) {
    if (!isEnabled.value) return

    stop()

    const cleanText = prepararParaFala(text)
    if (!cleanText) return

    const chunks = splitIntoChunks(cleanText)
    if (chunks.length === 0) return

    isLoadingAudio.value = true
    abortController = new AbortController()
    const signal = abortController.signal

    try {
      // Gera todos os chunks em paralelo
      const chunkPromises = chunks.map(chunk => generateAudioChunk(chunk, signal))
      const audioBuffers = await Promise.all(chunkPromises)
      
      // Filtra buffers nulos (erros ou abortados)
      audioQueue = audioBuffers.filter((buffer): buffer is AudioBuffer => buffer !== null)
      
      isLoadingAudio.value = false
      
      // Começa a tocar imediatamente (o primeiro chunk já deve estar pronto)
      if (audioQueue.length > 0) {
        playNextInQueue()
      } else {
        isSpeaking.value = false
      }
    } catch (err) {
      console.error('Gemini TTS error:', err)
      isLoadingAudio.value = false
      isSpeaking.value = false
    }
  }

  function stop() {
    // Aborta requisições pendentes
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    
    // Para a reprodução atual
    try { currentSource?.stop() } catch { /* já parou */ }
    currentSource = null
    
    // Limpa a fila
    audioQueue = []
    
    isSpeaking.value = false
    isLoadingAudio.value = false
  }

  function toggle() {
    isEnabled.value = !isEnabled.value
    if (!isEnabled.value) stop()
  }

  return { isSpeaking, isLoadingAudio, isEnabled, speak, stop, toggle }
}
