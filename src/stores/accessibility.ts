import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type FilterMode = 'none' | 'grayscale' | 'invert' | 'high-contrast'

const FONT_SIZES = [14, 16, 18, 20, 22] // px — index 1 é o padrão
const DEFAULT_FONT_INDEX = 1
const STORAGE_KEY = 'portal-a11y'

function applyToHtml(fontIndex: number, filter: FilterMode, vlibrasActive: boolean) {
  const html = document.documentElement

  // Fonte
  html.style.fontSize = `${FONT_SIZES[fontIndex]}px`

  // Filtros visuais — aplicados como classes para respeitar prefer-color-scheme
  html.classList.remove('a11y-grayscale', 'a11y-invert', 'a11y-high-contrast')
  if (filter !== 'none') html.classList.add(`a11y-${filter}`)

  // VLibras widget visibility
  const widget = document.querySelector<HTMLElement>('[vw]')
  if (widget) widget.style.display = vlibrasActive ? 'block' : 'none'
}

export const useAccessibilityStore = defineStore('accessibility', () => {
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    } catch {
      return {}
    }
  })()

  const fontIndex = ref<number>(saved.fontIndex ?? DEFAULT_FONT_INDEX)
  const filter = ref<FilterMode>(saved.filter ?? 'none')
  const vlibrasActive = ref<boolean>(saved.vlibrasActive ?? false)

  function increaseFontSize() {
    if (fontIndex.value < FONT_SIZES.length - 1) fontIndex.value++
  }

  function decreaseFontSize() {
    if (fontIndex.value > 0) fontIndex.value--
  }

  function setFilter(mode: FilterMode) {
    filter.value = filter.value === mode ? 'none' : mode
  }

  function toggleVlibras() {
    vlibrasActive.value = !vlibrasActive.value
  }

  function reset() {
    fontIndex.value = DEFAULT_FONT_INDEX
    filter.value = 'none'
    vlibrasActive.value = false
  }

  // Persiste e aplica sempre que qualquer estado mudar
  watch(
    [fontIndex, filter, vlibrasActive],
    ([fi, f, vl]) => {
      applyToHtml(fi, f, vl)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontIndex: fi, filter: f, vlibrasActive: vl }))
    },
  )

  // Aplica estado restaurado na inicialização
  function init() {
    applyToHtml(fontIndex.value, filter.value, vlibrasActive.value)
  }

  return { fontIndex, filter, vlibrasActive, increaseFontSize, decreaseFontSize, setFilter, toggleVlibras, reset, init }
})
