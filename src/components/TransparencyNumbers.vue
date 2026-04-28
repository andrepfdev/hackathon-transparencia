<script setup lang="ts">
const metrics = [
  {
    title: 'Despesas em 2025',
    value: 'R$ 14,4 bi',
    sub: 'Total empenhado no exercício',
    change: '+8,2% vs 2024',
    positive: false,
    icon: 'pi pi-chart-bar',
    color: 'from-blue-600 to-blue-800',
    breakdown: [
      { label: 'Saúde', percent: 35, color: 'bg-blue-300' },
      { label: 'Educação', percent: 28, color: 'bg-blue-400' },
      { label: 'Segurança', percent: 20, color: 'bg-blue-500' },
      { label: 'Outros', percent: 17, color: 'bg-blue-200' },
    ],
  },
  {
    title: 'Folha de Pagamento',
    value: 'R$ 620 mi',
    sub: 'Mensal — Abril/2025',
    change: '84,5 mil servidores',
    positive: true,
    icon: 'pi pi-users',
    color: 'from-[#1a3a6e] to-[#0f2447]',
    breakdown: [
      { label: 'Estatutários', percent: 62, color: 'bg-indigo-300' },
      { label: 'Comissionados', percent: 28, color: 'bg-indigo-400' },
      { label: 'Temporários', percent: 10, color: 'bg-indigo-200' },
    ],
  },
  {
    title: 'Receita Arrecadada',
    value: 'R$ 12,1 bi',
    sub: 'Acumulado 2025',
    change: '84% da meta anual',
    positive: true,
    icon: 'pi pi-money-bill',
    color: 'from-emerald-600 to-emerald-800',
    breakdown: [
      { label: 'Transferências', percent: 58, color: 'bg-emerald-300' },
      { label: 'ICMS / Tributos', percent: 30, color: 'bg-emerald-400' },
      { label: 'Outros', percent: 12, color: 'bg-emerald-200' },
    ],
  },
]
</script>

<template>
  <section class="py-10 px-4 bg-white border-t border-gray-100" aria-labelledby="numbers-heading">
    <div class="container">
      <div class="flex items-end justify-between mb-7">
        <div>
          <h2 id="numbers-heading" class="text-xl font-bold text-[#1a3a6e]">Transparência em Números</h2>
          <p class="text-sm text-gray-400 mt-0.5">Dados atualizados até Abril/2025</p>
        </div>
        <a href="#" class="text-xs text-blue-600 hover:underline font-medium hidden sm:flex items-center gap-1">
          Ver relatório completo <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          v-for="m in metrics"
          :key="m.title"
          class="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <!-- Cabeçalho com gradiente -->
          <div class="bg-gradient-to-br p-5 text-white" :class="m.color">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">{{ m.title }}</p>
                <p class="text-3xl font-bold leading-none tabular-nums">{{ m.value }}</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <i :class="m.icon" class="text-xl text-white" aria-hidden="true" />
              </div>
            </div>
            <p class="text-xs text-white/70">{{ m.sub }}</p>
          </div>

          <!-- Corpo: barras + rodapé -->
          <div class="bg-white p-4">
            <div class="flex flex-col gap-2.5 mb-4">
              <div v-for="item in m.breakdown" :key="item.label">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs text-gray-600">{{ item.label }}</span>
                  <span class="text-xs font-bold text-gray-800 tabular-nums">{{ item.percent }}%</span>
                </div>
                <div
                  class="h-1.5 bg-gray-100 rounded-full overflow-hidden"
                  role="progressbar"
                  :aria-valuenow="item.percent"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-label="`${item.label}: ${item.percent}%`"
                >
                  <div
                    :class="['h-full rounded-full', item.color]"
                    :style="{ width: `${item.percent}%` }"
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <span
                class="text-xs font-medium px-2 py-0.5 rounded-full"
                :class="m.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
              >
                {{ m.change }}
              </span>
              <a href="#" class="text-xs text-blue-600 hover:underline flex items-center gap-1">
                Detalhar <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
