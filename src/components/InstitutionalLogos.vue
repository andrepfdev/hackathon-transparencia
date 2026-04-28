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
  <section class="py-8 px-4 bg-gray-50 border-t border-gray-100" aria-labelledby="logos-heading">
    <div class="container">
      <h2
        id="logos-heading"
        class="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6"
      >
        Rede Transparência — Órgãos Participantes
      </h2>

      <div
        class="flex items-center justify-start sm:justify-center gap-8 sm:gap-10 overflow-x-auto scrollbar-none pb-2 sm:pb-0 sm:flex-wrap"
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
            class="h-10 sm:h-12 w-auto object-contain opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  </section>
</template>
