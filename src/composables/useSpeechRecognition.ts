import { ref, onUnmounted } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognitionAPI: (new () => any) | undefined =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

export function useSpeechRecognition() {
  const isListening = ref(false)
  const isSupported = ref(!!SpeechRecognitionAPI)
  const interimTranscript = ref('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let recognition: any = null
  let onResultCb: (text: string) => void = () => {}
  let onEndCb: () => void = () => {}
  let onErrorCb: (error: string) => void = () => {}

  function start() {
    if (!isSupported.value || isListening.value || !SpeechRecognitionAPI) return

    recognition = new SpeechRecognitionAPI()
    recognition.lang = 'pt-BR'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => {
      isListening.value = true
      interimTranscript.value = ''
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result?.isFinal) {
          final += result[0]?.transcript ?? ''
        } else {
          interim += result?.[0]?.transcript ?? ''
        }
      }
      interimTranscript.value = interim
      if (final) {
        onResultCb(final.trim())
      }
    }

    recognition.onend = () => {
      isListening.value = false
      interimTranscript.value = ''
      onEndCb()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      isListening.value = false
      interimTranscript.value = ''
      onErrorCb(event.error)
    }

    recognition.start()
  }

  function stop() {
    recognition?.stop()
  }

  function onResult(fn: (text: string) => void) {
    onResultCb = fn
  }

  function onEnd(fn: () => void) {
    onEndCb = fn
  }

  function onError(fn: (error: string) => void) {
    onErrorCb = fn
  }

  onUnmounted(() => {
    recognition?.abort()
  })

  return { isListening, isSupported, interimTranscript, start, stop, onResult, onEnd, onError }
}
