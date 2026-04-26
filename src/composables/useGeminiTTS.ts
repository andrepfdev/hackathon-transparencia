import { ref } from 'vue'

const GEMINI_TTS_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent'

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
    .replace(/R\$[\s  ]*[\d.,\s  ]*\d,\d{2}/g, moedaParaFala)
    .replace(/(\d+(?:,\d+)?)\s*%/g, '$1 por cento')
    .replace(/\b(\d{1,3}(?:\.\d{3})+)\b/g, (m) => m.replace(/\./g, ''))
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Composable ────────────────────────────────────────────────────────────────

export function useGeminiTTS() {
  const isSpeaking = ref(false)
  const isLoadingAudio = ref(false)
  const isEnabled = ref(true)

  let audioCtx: AudioContext | null = null
  let currentSource: AudioBufferSourceNode | null = null

  function getCtx(): AudioContext {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContext()
    }
    return audioCtx
  }

  async function speak(text: string) {
    if (!isEnabled.value) return

    stop()

    const cleanText = prepararParaFala(text)
    if (!cleanText) return

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
    if (!apiKey) return

    isLoadingAudio.value = true

    try {
      const response = await fetch(`${GEMINI_TTS_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: cleanText }] }],
          generationConfig: {
            response_modalities: ['AUDIO'],
            speech_config: {
              voice_config: {
                prebuilt_voice_config: { voice_name: 'Aoede' },
              },
            },
          },
        }),
      })

      if (!response.ok) {
        console.error('Gemini TTS error:', await response.text())
        isLoadingAudio.value = false
        return
      }

      const json = await response.json()
      const inlineData = json.candidates?.[0]?.content?.parts?.[0]?.inlineData
      if (!inlineData?.data) {
        isLoadingAudio.value = false
        return
      }

      // Decodifica base64 → PCM 16-bit signed little-endian @ 24000 Hz mono
      const binary = atob(inlineData.data)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

      const ctx = getCtx()
      // Resume obrigatório em mobile (política de autoplay)
      if (ctx.state === 'suspended') await ctx.resume()

      const numSamples = bytes.length / 2
      const buffer = ctx.createBuffer(1, numSamples, 24000)
      const channel = buffer.getChannelData(0)
      const view = new DataView(bytes.buffer)
      for (let i = 0; i < numSamples; i++) {
        channel[i] = view.getInt16(i * 2, true) / 32768
      }

      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.onended = () => { isSpeaking.value = false }
      currentSource = source
      isLoadingAudio.value = false
      isSpeaking.value = true
      source.start()
    } catch (err) {
      console.error('Gemini TTS error:', err)
      isLoadingAudio.value = false
      isSpeaking.value = false
    }
  }

  function stop() {
    try { currentSource?.stop() } catch { /* já parou */ }
    currentSource = null
    isSpeaking.value = false
    isLoadingAudio.value = false
  }

  function toggle() {
    isEnabled.value = !isEnabled.value
    if (!isEnabled.value) stop()
  }

  return { isSpeaking, isLoadingAudio, isEnabled, speak, stop, toggle }
}
