<script setup lang="ts">
import { ref } from 'vue'
import AccessibilityBar from '@/components/AccessibilityBar.vue'

const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Sobre o Portal', href: '#' },
  { label: 'Legislação', href: '#' },
  { label: 'Canais de Comunicação', href: '#' },
  { label: 'Acesso à Informação', href: '#' },
  { label: 'Avalie o Portal', href: '#', icon: 'pi pi-star' },
]

const socialLinks = [
  { icon: 'pi pi-facebook', href: '#', label: 'Facebook' },
  { icon: 'pi pi-twitter', href: '#', label: 'Twitter' },
  { icon: 'pi pi-instagram', href: '#', label: 'Instagram' },
  { icon: 'pi pi-linkedin', href: '#', label: 'LinkedIn' },
  { icon: 'pi pi-youtube', href: '#', label: 'YouTube' },
]
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-100">
    <AccessibilityBar />

    <div class="container flex items-center justify-between py-3">
      <div class="flex items-center gap-2 sm:gap-3">
        <img src="/img/brasao_ma.png" alt="Brasão do Estado do Maranhão" class="h-12  w-auto">
        <div class="w-1 h-10 bg-blue-600 rounded-full hidden sm:block" aria-hidden="true" />
        <a href="/" aria-label="Portal da Transparência - Governo do Estado do Maranhão">
          <span class="text-base sm:text-xl font-bold text-[#1a3a6e] leading-tight block">Portal da Transparência</span>
          <span class="text-xs text-gray-500">Governo do Estado do Maranhão</span>
        </a>
      </div>

      <div class="flex items-center gap-3">
        <nav class="hidden md:flex items-center gap-2" aria-label="Redes sociais">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            class="text-[#c0392b] hover:text-[#922b21] transition-colors"
          >
            <i :class="social.icon" class="text-lg" />
          </a>
        </nav>
        <a
          href="https://www.ma.gov.br"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Portal do Governo do Maranhão (abre em nova aba)"
          class="text-sm font-bold text-[#c0392b] leading-none"
        >
          MA.GOV.BR
        </a>
      </div>
    </div>

    <nav class="bg-[#f0f4ff] border-t border-blue-100" aria-label="Menu principal">
      <div class="container">
        <ul class="hidden md:flex items-center gap-0.5 py-0.5">
          <li>
            <a href="/" class="flex items-center px-3 py-2 text-[#1a3a6e] hover:bg-blue-50 rounded text-sm transition-colors" aria-label="Início">
              <i class="pi pi-home text-sm" aria-hidden="true" />
            </a>
          </li>
          <li v-for="link in navLinks" :key="link.label">
            <a
              :href="link.href"
              class="flex items-center gap-1 px-3 py-2 text-[#1a3a6e] hover:bg-blue-50 rounded text-xs font-semibold uppercase tracking-wide transition-colors"
            >
              <i v-if="link.icon" :class="link.icon" class="text-xs" aria-hidden="true" />
              {{ link.label }}
            </a>
          </li>
        </ul>

        <div class="md:hidden flex items-center justify-between py-1.5">
          <a href="/" class="flex items-center gap-1 text-[#1a3a6e] text-sm font-medium">
            <i class="pi pi-home text-sm" aria-hidden="true" />
            <span>Início</span>
          </a>
          <button
            class="flex items-center gap-1.5 text-[#1a3a6e] font-semibold text-sm px-2 py-1.5 rounded hover:bg-blue-50 transition-colors min-h-[44px]"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" aria-hidden="true" />
            <span>{{ mobileMenuOpen ? 'Fechar' : 'Menu' }}</span>
          </button>
        </div>

        <ul v-if="mobileMenuOpen" id="mobile-menu" class="md:hidden flex flex-col border-t border-blue-100 py-2 gap-0.5">
          <li v-for="link in navLinks" :key="link.label">
            <a
              :href="link.href"
              class="flex items-center gap-2 px-3 py-3 text-[#1a3a6e] hover:bg-blue-50 rounded text-sm font-medium transition-colors min-h-[44px]"
              @click="mobileMenuOpen = false"
            >
              <i v-if="link.icon" :class="link.icon" class="text-sm" aria-hidden="true" />
              {{ link.label }}
            </a>
          </li>
          <li class="px-3 pt-3 pb-1 border-t border-blue-100 mt-1">
            <nav class="flex gap-4" aria-label="Redes sociais">
              <a
                v-for="social in socialLinks"
                :key="social.label"
                :href="social.href"
                :aria-label="social.label"
                class="text-[#c0392b] hover:text-[#922b21] transition-colors p-1"
              >
                <i :class="social.icon" class="text-xl" />
              </a>
            </nav>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
