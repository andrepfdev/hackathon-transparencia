<script setup lang="ts">
const footerLinks = {
  principal: [
    { label: 'Servidores', href: '#' },
    { label: 'Receitas', href: '#' },
    { label: 'Despesas', href: '#' },
  ],
  sobre: [
    { label: 'O que é o Portal?', href: '#' },
    { label: 'Perguntas Frequentes', href: '#' },
    { label: 'Glossário', href: '#' },
  ],
  comunicacao: [
    { label: 'Canais de Manifestação', href: '#' },
    { label: 'Contato dos Órgãos e Entidades da Administração', href: '#' },
    { label: 'Pedidos de Acesso à Informação', href: '#' },
  ],
}

const socialLinks = [
  { icon: 'pi pi-facebook', href: '#', label: 'Facebook' },
  { icon: 'pi pi-twitter', href: '#', label: 'Twitter' },
  { icon: 'pi pi-instagram', href: '#', label: 'Instagram' },
  { icon: 'pi pi-linkedin', href: '#', label: 'LinkedIn' },
  { icon: 'pi pi-youtube', href: '#', label: 'YouTube' },
]

const quickLinks = [
  { label: 'DADOS ABERTOS', sublabel: 'MA.GOV.BR', icon: 'pi pi-database', href: '#' },
  { label: 'Diário Oficial', sublabel: '', icon: 'pi pi-book', href: '#' },
  { label: 'FALA', sublabel: 'MA.GOV.BR', icon: 'pi pi-comments', href: '#' },
]
</script>

<template>
  <footer>
    <!-- Rede de Transparência -->
    <div class="bg-gray-100 py-8 px-4">
      <div class="container flex flex-col items-center gap-6">
        <div class="bg-white border border-gray-200 rounded-xl px-8 py-4 flex items-center gap-3 shadow-sm">
          <i class="pi pi-link text-blue-600 text-2xl" aria-hidden="true" />
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-widest font-medium">REDE DE</p>
            <p class="font-bold text-[#1a3a6e] text-lg leading-tight">TRANSPARÊNCIA</p>
            <p class="text-xs text-gray-400">GOVERNO DO ESTADO DO MARANHÃO</p>
          </div>
        </div>

        <!-- Links rápidos -->
        <div class="flex flex-wrap justify-center gap-8">
          <a
            v-for="link in quickLinks"
            :key="link.label"
            :href="link.href"
            class="flex items-center gap-3 group hover:text-blue-700 transition-colors"
          >
            <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
              <i :class="link.icon" class="text-white text-sm" aria-hidden="true" />
            </div>
            <div>
              <p class="font-bold text-gray-800 text-sm leading-tight group-hover:text-blue-700">{{ link.label }}</p>
              <p v-if="link.sublabel" class="text-xs text-[#c0392b] font-semibold">{{ link.sublabel }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Footer principal -->
    <div class="bg-[#1a3a6e] text-white py-10 px-4">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Principal</h3>
            <ul class="flex flex-col gap-2">
              <li v-for="link in footerLinks.principal" :key="link.label">
                <a :href="link.href" class="text-sm text-blue-100 hover:text-white hover:underline transition-colors">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Sobre o Portal</h3>
            <ul class="flex flex-col gap-2">
              <li v-for="link in footerLinks.sobre" :key="link.label">
                <a :href="link.href" class="text-sm text-blue-100 hover:text-white hover:underline transition-colors">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Canais de Comunicação</h3>
            <ul class="flex flex-col gap-2">
              <li v-for="link in footerLinks.comunicacao" :key="link.label">
                <a :href="link.href" class="text-sm text-blue-100 hover:text-white hover:underline transition-colors">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-blue-800 pt-6">
          <p class="font-bold text-sm mb-2">SECRETARIA DE ESTADO DE TRANSPARÊNCIA E CONTROLE</p>
          <p class="text-xs text-blue-300 mb-1">
            Edifício Clodomir Millet, 5º andar · Av. Jerônimo de Albuquerque, s/n · Calhau · CEP 65074-220 · São Luís/MA
          </p>
          <p class="text-xs text-blue-300 mb-4">
            Horário de Atendimento ao Público: das 8h às 12h · de segunda a sexta-feira (exceto feriados).
          </p>
          <p class="text-xs text-blue-400 mb-2">
            Este portal segue o <strong class="text-white">eMAG 3.1</strong> e <strong class="text-white">WCAG 2.1</strong>
            e é compatível com leitores de tela como NVDA e JAWS, garantindo o acesso às informações por pessoas com deficiência visual.
          </p>
          <p class="text-xs text-blue-400 mb-4">
            Todos os direitos reservados · Licença Creative Commons 4.0
          </p>

          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-2">
              <div class="bg-[#c0392b] text-white text-xs font-bold px-2 py-1 rounded">
                GOVERNO DO<br>MARANHÃO
              </div>
            </div>

            <nav class="flex gap-3" aria-label="Redes sociais">
              <a
                v-for="social in socialLinks"
                :key="social.label"
                :href="social.href"
                :aria-label="social.label"
                class="text-blue-300 hover:text-white transition-colors"
              >
                <i :class="social.icon" class="text-lg" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
