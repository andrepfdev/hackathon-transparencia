<script setup lang="ts">
import { ref } from 'vue'

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

const accessibilityLinks = [
  { label: 'Aumentar Fonte', icon: 'pi pi-search-plus' },
  { label: 'Diminuir Fonte', icon: 'pi pi-search-minus' },
  { label: 'Preto e Branco', icon: 'pi pi-eye' },
  { label: 'Inverter Cores', icon: 'pi pi-palette' },
  { label: 'Declarar Libras', icon: 'pi pi-volume-up' },
]
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-100">
    <!-- Barra de acessibilidade -->
    <div class="bg-[#1a3a6e] text-white text-xs">
      <div class="container flex items-center justify-between py-1">
        <nav class="flex gap-4" aria-label="Acessibilidade">
          <button
            v-for="link in accessibilityLinks"
            :key="link.label"
            class="flex items-center gap-1 hover:text-blue-200 transition-colors"
            :aria-label="link.label"
          >
            <i :class="link.icon" class="text-xs" />
            <span class="hidden sm:inline">{{ link.label }}</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Cabeçalho principal -->
    <div class="container flex items-center justify-between py-3">
      <div class="flex items-center gap-3">
        <div class="w-1 h-10 bg-blue-600 rounded-full hidden sm:block" aria-hidden="true" />
        <div>
          <a href="/" class="block">
            <span class="text-xl font-bold text-[#1a3a6e] leading-tight block">Portal da Transparência</span>
            <span class="text-xs text-gray-500">Governo do Estado do Maranhão</span>
          </a>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Redes sociais -->
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

        <!-- Logo MA.GOV.BR -->
        <a href="https://www.ma.gov.br" target="_blank" rel="noopener noreferrer" class="text-right">
          <span class="text-sm font-bold text-[#c0392b] leading-none block">MA.GOV.BR</span>
        </a>
      </div>
    </div>

    <!-- Menu de navegação -->
    <nav class="bg-[#f0f4ff] border-t border-blue-100" aria-label="Menu principal">
      <div class="container">
        <ul class="hidden md:flex items-center gap-1 py-0">
          <li>
            <a href="/" class="flex items-center px-3 py-2 text-[#1a3a6e] hover:bg-blue-50 rounded text-sm font-medium" aria-label="Início">
              <i class="pi pi-home text-sm" />
            </a>
          </li>
          <li v-for="link in navLinks" :key="link.label">
            <a
              :href="link.href"
              class="flex items-center gap-1 px-3 py-2 text-[#1a3a6e] hover:bg-blue-50 rounded text-sm font-medium transition-colors uppercase text-xs tracking-wide"
            >
              <i v-if="link.icon" :class="link.icon" class="text-xs" />
              {{ link.label }}
            </a>
          </li>
        </ul>

        <!-- Mobile menu toggle -->
        <div class="md:hidden flex items-center py-2">
          <button
            class="flex items-center gap-2 text-[#1a3a6e] font-medium text-sm"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" />
            Menu
          </button>
        </div>

        <ul v-if="mobileMenuOpen" id="mobile-menu" class="md:hidden flex flex-col py-2 gap-1">
          <li v-for="link in navLinks" :key="link.label">
            <a :href="link.href" class="block px-3 py-2 text-[#1a3a6e] hover:bg-blue-50 rounded text-sm">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
