<script setup lang="ts">
const expensesMonth = {
  period: 'Abr/2025',
  total: 'R$ 1,2B',
  breakdown: [
    { label: 'Saúde', value: 35, color: '#3b82f6' },
    { label: 'Educação', value: 28, color: '#10b981' },
    { label: 'Segurança', value: 20, color: '#f59e0b' },
    { label: 'Outros', value: 17, color: '#e5e7eb' },
  ],
}

const investmentAreas = [
  { label: 'Saúde', percent: 35, color: 'bg-blue-500' },
  { label: 'Educação', percent: 28, color: 'bg-green-500' },
  { label: 'Segurança', percent: 20, color: 'bg-yellow-500' },
  { label: 'Infraestrutura', percent: 17, color: 'bg-gray-400' },
]

const activeServers = {
  total: '84,5k',
  description: 'Profissionais trabalhando pelo estado com folha de pagamento atualizada.',
  breakdown: [
    { label: 'Concursados', percent: 62 },
    { label: 'Cargo de confiança', percent: 28 },
    { label: 'Temporários', percent: 10 },
  ],
}

function getPieSegments() {
  const data = expensesMonth.breakdown
  const total = data.reduce((s, d) => s + d.value, 0)
  const cx = 50; const cy = 50; const r = 40
  let angle = -90
  return data.map((d) => {
    const sweep = (d.value / total) * 360
    const s = (angle * Math.PI) / 180
    const e = ((angle + sweep) * Math.PI) / 180
    const x1 = cx + r * Math.cos(s); const y1 = cy + r * Math.sin(s)
    const x2 = cx + r * Math.cos(e); const y2 = cy + r * Math.sin(e)
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x2} ${y2} Z`
    angle += sweep
    return { ...d, path }
  })
}
</script>

<template>
  <section class="py-8 px-4 md:py-10 bg-white border-t border-gray-100" aria-labelledby="numbers-heading">
    <div class="container">
      <h2 id="numbers-heading" class="text-xl sm:text-2xl font-bold text-center text-[#1a3a6e] mb-6 sm:mb-8">
        Transparência em Números
      </h2>

      <!--
        Mobile: stack vertical (1 col)
        md+:    3 colunas lado a lado
      -->
      <div class="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">

        <!-- Despesas do Mês -->
        <div class="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-0.5">Despesas do Mês</h3>
          <p class="text-xs text-gray-400 mb-4">Onde o dinheiro foi investido em {{ expensesMonth.period }}</p>

          <!-- Layout horizontal no mobile: gráfico + legenda lado a lado -->
          <div class="flex items-center gap-4 mb-4">
            <svg
              viewBox="0 0 100 100"
              class="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0"
              role="img"
              :aria-label="`Gráfico de pizza: despesas de ${expensesMonth.period}`"
            >
              <title>Despesas por área — {{ expensesMonth.period }}</title>
              <g v-for="seg in getPieSegments()" :key="seg.label">
                <path :d="seg.path" :fill="seg.color" />
              </g>
              <circle cx="50" cy="50" r="22" fill="white" />
              <text x="50" y="46" text-anchor="middle" fill="#1a3a6e" font-size="7" font-weight="bold">
                {{ expensesMonth.period.split('/')[0] }}
              </text>
              <text x="50" y="55" text-anchor="middle" fill="#1a3a6e" font-size="7" font-weight="bold">
                {{ expensesMonth.period.split('/')[1] }}
              </text>
            </svg>

            <div class="flex flex-col gap-1.5">
              <div
                v-for="item in expensesMonth.breakdown"
                :key="item.label"
                class="flex items-center gap-1.5 text-xs text-gray-600"
              >
                <span class="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0" :style="{ backgroundColor: item.color }" aria-hidden="true" />
                <span>{{ item.label }}</span>
                <span class="font-semibold ml-auto">{{ item.value }}%</span>
              </div>
            </div>
          </div>

          <p class="text-2xl font-bold text-[#1a3a6e]">{{ expensesMonth.total }}</p>
          <a href="#despesas" class="text-blue-600 text-xs hover:underline mt-1 inline-flex items-center gap-1">
            Ver detalhes <i class="pi pi-chevron-right text-xs" aria-hidden="true" />
          </a>
        </div>

        <!-- Áreas de Investimento -->
        <div class="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-0.5">Áreas de Investimento</h3>
          <p class="text-xs text-gray-400 mb-5">Principais destinações de recursos</p>

          <div class="flex flex-col gap-4">
            <div v-for="area in investmentAreas" :key="area.label">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-gray-600">{{ area.label }}</span>
                <span class="text-sm font-semibold text-gray-800">{{ area.percent }}%</span>
              </div>
              <div
                class="h-2 bg-gray-100 rounded-full overflow-hidden"
                role="progressbar"
                :aria-valuenow="area.percent"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-label="`${area.label}: ${area.percent}%`"
              >
                <div :class="['h-full rounded-full transition-all', area.color]" :style="{ width: `${area.percent}%` }" />
              </div>
            </div>
          </div>

          <a href="#areas" class="text-blue-600 text-xs hover:underline mt-5 inline-flex items-center gap-1">
            Explorar todas as áreas <i class="pi pi-chevron-right text-xs" aria-hidden="true" />
          </a>
        </div>

        <!-- Servidores Ativos -->
        <div class="bg-[#1a3a6e] text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div class="absolute top-3 right-3 opacity-10" aria-hidden="true">
            <i class="pi pi-users text-7xl" />
          </div>

          <div class="flex items-start justify-between mb-1">
            <h3 class="font-semibold text-blue-100">Servidores Ativos</h3>
            <i class="pi pi-users text-blue-300 text-lg" aria-hidden="true" />
          </div>

          <p class="text-4xl sm:text-5xl font-bold my-4" aria-label="{{ activeServers.total }} servidores ativos">
            {{ activeServers.total }}
          </p>
          <p class="text-blue-200 text-xs mb-5 leading-relaxed">{{ activeServers.description }}</p>

          <div class="flex flex-col gap-0">
            <div
              v-for="item in activeServers.breakdown"
              :key="item.label"
              class="flex items-center justify-between border-t border-blue-700/50 py-2"
            >
              <span class="text-sm text-blue-200">{{ item.label }}</span>
              <span class="font-bold text-white tabular-nums">{{ item.percent }}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
