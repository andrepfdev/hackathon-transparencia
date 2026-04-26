import { ref } from 'vue'

export function useSpeechSynthesis() {
  const isSpeaking = ref(false)
  const isEnabled = ref(true)

  function stripMarkdown(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/#+\s/g, '')
      .replace(/📊/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function speak(text: string) {
    if (!isEnabled.value || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const cleanText = stripMarkdown(text)
    if (!cleanText) return

    // Divide em chunks para evitar limite do browser
    const chunks = cleanText.match(/[^.!?]+[.!?]*/g) ?? [cleanText]
    let index = 0

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
      utterance.rate = 1.05
      utterance.pitch = 1

      if (index === 0) {
        utterance.onstart = () => {
          isSpeaking.value = true
        }
      }

      utterance.onend = () => {
        index++
        speakNext()
      }

      utterance.onerror = () => {
        isSpeaking.value = false
      }

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
