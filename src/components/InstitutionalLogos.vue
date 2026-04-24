<script setup lang="ts">
interface Logo {
  src: string
  alt: string
}

const logos: Logo[] = [
  { src: '/logos/TJ-MA_logo-removebg-preview.png', alt: 'Tribunal de Justiça do Estado do Maranhão' },
  { src: '/logos/BOTAO_GOVERNOFEDERAL-removebg-preview.png', alt: 'Governo Federal' },
  { src: '/logos/imagemgovernodomaranhao2.png', alt: 'Governo do Maranhão' },
  { src: '/logos/MinisterioPublico_logo-removebg-preview.png', alt: 'Ministério Público do Maranhão' },
  { src: '/logos/Defensoria_logo-removebg-preview.png', alt: 'Defensoria Pública do Estado do Maranhão' },
  { src: '/logos/TCE_logo-removebg-preview.png', alt: 'Tribunal de Contas do Estado do Maranhão' },
  { src: '/logos/sema2.png', alt: 'SEMA — Secretaria de Estado do Meio Ambiente do Maranhão' },
  { src: '/logos/Assembleia_logo-removebg-preview.png', alt: 'Assembleia Legislativa do Maranhão' },
  { src: '/logos/transparencia_prefeitura.png', alt: 'Portal de Transparência da Prefeitura' },
]
</script>

<template>
  <section class="py-8 px-4 bg-white border-t border-gray-100" aria-labelledby="logos-heading">
    <div class="container">
      <h2
        id="logos-heading"
        class="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6"
      >
        Rede Transparência — Órgãos participantes
      </h2>

      <!-- overflow-x-auto para mobile quando não cabe em linha -->
      <div
        class="flex items-center justify-start sm:justify-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none pb-2 sm:pb-0 sm:flex-wrap"
        role="list"
      >
        <div
          v-for="logo in logos"
          :key="logo.alt"
          role="listitem"
          class="flex-shrink-0"
        >
          <img
            :src="logo.src"
            :alt="logo.alt"
            loading="lazy"
            class="h-10 sm:h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0"
          />
        </div>
      </div>
    </div>
  </section>
</template>
