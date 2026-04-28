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
  <header class="bg-white shadow-md">
    <AccessibilityBar />

    <!-- Barra superior: logo + social + ma.gov.br -->
    <div class="container flex items-center justify-between py-3 px-4">
      <RouterLink to="/" aria-label="Portal da Transparência - Governo do Estado do Maranhão - Página inicial">
        <img
          src="/img/logo-oficial.png"
          alt="Portal da Transparência — Governo do Estado do Maranhão"
          class="h-14 w-auto object-contain"
        />
      </RouterLink>

      <div class="flex items-center gap-4">
        <nav class="hidden lg:flex items-center gap-2" aria-label="Redes sociais">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#c0392b] hover:bg-red-50 transition-all"
          >
            <i :class="social.icon" class="text-base" />
          </a>
        </nav>

        <a
          href="https://www.ma.gov.br"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Portal do Governo do Maranhão (abre em nova aba)"
          class="text-xs font-bold text-white bg-[#c0392b] hover:bg-[#a93226] px-3 py-1.5 rounded-lg transition-colors tracking-wide"
        >
          MA.GOV.BR
        </a>
      </div>
    </div>

    <!-- Nav principal: fundo navy -->
    <nav class="bg-[#1a3a6e]" aria-label="Menu principal">
      <div class="container px-4">
        <!-- Desktop -->
        <ul class="hidden md:flex items-center">
          <li>
            <RouterLink
              to="/"
              class="flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 text-sm transition-colors"
              aria-label="Início"
            >
              <i class="pi pi-home text-sm" aria-hidden="true" />
            </RouterLink>
          </li>
          <li v-for="link in navLinks" :key="link.label">
            <a
              :href="link.href"
              class="flex items-center gap-1.5 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 text-xs font-medium uppercase tracking-wide transition-colors"
            >
              <i v-if="link.icon" :class="link.icon" class="text-xs" aria-hidden="true" />
              {{ link.label }}
            </a>
          </li>
        </ul>

        <!-- Mobile -->
        <div class="md:hidden flex items-center justify-between py-2">
          <RouterLink to="/" class="flex items-center gap-2 text-white text-sm font-medium">
            <i class="pi pi-home" aria-hidden="true" />
            <span>Início</span>
          </RouterLink>
          <button
            class="flex items-center gap-1.5 text-white px-2 py-1.5 rounded hover:bg-white/10 transition-colors min-h-[44px] text-sm font-medium"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" aria-hidden="true" />
            <span>{{ mobileMenuOpen ? 'Fechar' : 'Menu' }}</span>
          </button>
        </div>

        <ul v-if="mobileMenuOpen" id="mobile-menu" class="md:hidden flex flex-col border-t border-white/10 py-2 gap-0.5">
          <li v-for="link in navLinks" :key="link.label">
            <a
              :href="link.href"
              class="flex items-center gap-2 px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm transition-colors min-h-[44px]"
              @click="mobileMenuOpen = false"
            >
              <i v-if="link.icon" :class="link.icon" class="text-sm" aria-hidden="true" />
              {{ link.label }}
            </a>
          </li>
          <li class="px-3 pt-3 pb-1 border-t border-white/10 mt-1">
            <nav class="flex gap-3" aria-label="Redes sociais">
              <a
                v-for="social in socialLinks"
                :key="social.label"
                :href="social.href"
                :aria-label="social.label"
                class="text-white/60 hover:text-white transition-colors p-1"
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
