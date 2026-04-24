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
    { label: 'Contato dos Órgãos', href: '#' },
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
    <!-- Rede de Transparência + links rápidos -->
    <div class="bg-gray-100 py-8 px-4">
      <div class="container flex flex-col items-center gap-6">
        <!-- Selo -->
        <div class="bg-white border border-gray-200 rounded-xl px-6 py-3 flex items-center gap-3 shadow-sm">
          <i class="pi pi-link text-blue-600 text-2xl" aria-hidden="true" />
          <div>
            <p class="text-[10px] text-gray-400 uppercase tracking-widest font-medium leading-none">REDE DE</p>
            <p class="font-bold text-[#1a3a6e] text-base sm:text-lg leading-tight">TRANSPARÊNCIA</p>
            <p class="text-[10px] text-gray-400 leading-none">GOVERNO DO ESTADO DO MARANHÃO</p>
          </div>
        </div>

        <!-- Links rápidos: 1 por linha no mobile, lado a lado no sm+ -->
        <div class="flex flex-col sm:flex-row items-center sm:justify-center gap-4 sm:gap-8 w-full sm:w-auto">
          <a
            v-for="link in quickLinks"
            :key="link.label"
            :href="link.href"
            class="flex items-center gap-3 group hover:text-blue-700 transition-colors w-full sm:w-auto justify-start sm:justify-center"
          >
            <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
              <i :class="link.icon" class="text-white text-sm" aria-hidden="true" />
            </div>
            <div>
              <p class="font-bold text-gray-800 text-sm leading-tight group-hover:text-blue-700">{{ link.label }}</p>
              <p v-if="link.sublabel" class="text-xs text-[#c0392b] font-semibold leading-none">{{ link.sublabel }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Rodapé principal -->
    <div class="bg-[#1a3a6e] text-white py-8 px-4 sm:py-10">
      <div class="container">
        <!--
          Mobile:  1 coluna (seções empilhadas)
          md+:     3 colunas
        -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-blue-300 mb-3">Principal</h3>
            <ul class="flex flex-col gap-2">
              <li v-for="link in footerLinks.principal" :key="link.label">
                <a :href="link.href" class="text-sm text-blue-100 hover:text-white hover:underline transition-colors py-0.5 block">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-blue-300 mb-3">Sobre o Portal</h3>
            <ul class="flex flex-col gap-2">
              <li v-for="link in footerLinks.sobre" :key="link.label">
                <a :href="link.href" class="text-sm text-blue-100 hover:text-white hover:underline transition-colors py-0.5 block">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <div class="sm:col-span-2 md:col-span-1">
            <h3 class="text-xs font-bold uppercase tracking-widest text-blue-300 mb-3">Canais de Comunicação</h3>
            <ul class="flex flex-col gap-2">
              <li v-for="link in footerLinks.comunicacao" :key="link.label">
                <a :href="link.href" class="text-sm text-blue-100 hover:text-white hover:underline transition-colors py-0.5 block">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-blue-800 pt-6">
          <p class="font-bold text-sm mb-2">SECRETARIA DE ESTADO DE TRANSPARÊNCIA E CONTROLE</p>
          <address class="not-italic text-xs text-blue-300 mb-1 leading-relaxed">
            Edifício Clodomir Millet, 5º andar · Av. Jerônimo de Albuquerque, s/n<br>
            Calhau · CEP 65074-220 · São Luís/MA<br>
            Atendimento: seg a sex, 8h–12h (exceto feriados)
          </address>
          <p class="text-xs text-blue-400 mt-3 mb-4 leading-relaxed">
            Este portal segue o <strong class="text-white">eMAG 3.1</strong> e <strong class="text-white">WCAG 2.1</strong>
            e é compatível com leitores de tela como NVDA e JAWS.<br>
            Todos os direitos reservados · Licença Creative Commons 4.0
          </p>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="bg-[#c0392b] text-white text-xs font-bold px-3 py-1.5 rounded inline-block w-fit">
              GOVERNO DO MARANHÃO
            </div>

            <nav class="flex gap-4" aria-label="Redes sociais">
              <a
                v-for="social in socialLinks"
                :key="social.label"
                :href="social.href"
                :aria-label="social.label"
                class="text-blue-300 hover:text-white transition-colors p-1"
              >
                <i :class="social.icon" class="text-xl" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
