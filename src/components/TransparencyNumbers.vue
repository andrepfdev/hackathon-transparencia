<script setup lang="ts">
// Dados mockados — serão substituídos por chamadas reais à API do portal
const expensesMonth = {
  period: 'Out/2023',
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
  description: 'Profissionais trabalhando pelo estado, com folha de pagamento atualizada.',
  breakdown: [
    { label: 'Estatutários', percent: 62 },
    { label: 'Comissionados', percent: 28 },
    { label: 'Temporários', percent: 10 },
  ],
}

// Coordenadas do gráfico de pizza (SVG simples)
function getPieSegments() {
  const data = expensesMonth.breakdown
  const total = data.reduce((s, d) => s + d.value, 0)
  const cx = 50; const cy = 50; const r = 40
  let angle = -90
  return data.map((d) => {
    const sweep = (d.value / total) * 360
    const startRad = (angle * Math.PI) / 180
    const endRad = ((angle + sweep) * Math.PI) / 180
    const x1 = cx + r * Math.cos(startRad)
    const y1 = cy + r * Math.sin(startRad)
    const x2 = cx + r * Math.cos(endRad)
    const y2 = cy + r * Math.sin(endRad)
    const largeArc = sweep > 180 ? 1 : 0
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    angle += sweep
    return { ...d, path }
  })
}
</script>

<template>
  <section class="py-10 px-4 bg-white border-t border-gray-100" aria-labelledby="numbers-heading">
    <div class="container">
      <h2 id="numbers-heading" class="text-2xl font-bold text-center text-[#1a3a6e] mb-8">
        Transparência em Números
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Despesas do Mês -->
        <div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-1">Despesas do Mês</h3>
          <p class="text-xs text-gray-400 mb-4">Onde o dinheiro foi investido em {{ expensesMonth.period }}</p>

          <div class="flex items-center justify-center mb-4">
            <div class="relative">
              <svg viewBox="0 0 100 100" class="w-32 h-32" role="img" aria-label="Gráfico de despesas por área">
                <g v-for="seg in getPieSegments()" :key="seg.label">
                  <path :d="seg.path" :fill="seg.color" />
                </g>
                <circle cx="50" cy="50" r="22" fill="white" />
                <text x="50" y="48" text-anchor="middle" class="text-xs font-bold" fill="#1a3a6e" font-size="8" font-weight="bold">
                  {{ expensesMonth.period }}
                </text>
              </svg>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <div v-for="item in expensesMonth.breakdown" :key="item.label" class="flex items-center gap-1 text-xs text-gray-500">
              <span class="inline-block w-2 h-2 rounded-full" :style="{ backgroundColor: item.color }" />
              {{ item.label }}
            </div>
          </div>

          <p class="text-2xl font-bold text-[#1a3a6e]">{{ expensesMonth.total }}</p>
          <a href="#despesas" class="text-blue-600 text-xs hover:underline mt-1 inline-flex items-center gap-1">
            Ver detalhes <i class="pi pi-chevron-right text-xs" />
          </a>
        </div>

        <!-- Áreas de Investimento -->
        <div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-1">Áreas de Investimento</h3>
          <p class="text-xs text-gray-400 mb-6">Principais destinações de recursos</p>

          <div class="flex flex-col gap-4">
            <div v-for="area in investmentAreas" :key="area.label">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-gray-600">{{ area.label }}</span>
                <span class="text-sm font-semibold text-gray-800">{{ area.percent }}%</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden" role="progressbar" :aria-valuenow="area.percent" aria-valuemin="0" aria-valuemax="100" :aria-label="`${area.label}: ${area.percent}%`">
                <div :class="['h-full rounded-full', area.color]" :style="{ width: `${area.percent}%` }" />
              </div>
            </div>
          </div>

          <a href="#areas" class="text-blue-600 text-xs hover:underline mt-6 inline-flex items-center gap-1">
            Explorar todas as áreas <i class="pi pi-chevron-right text-xs" />
          </a>
        </div>

        <!-- Servidores Ativos -->
        <div class="bg-[#1a3a6e] text-white rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div class="absolute top-4 right-4 opacity-20">
            <i class="pi pi-users text-6xl" aria-hidden="true" />
          </div>

          <div class="flex items-start justify-between mb-2">
            <h3 class="font-semibold text-blue-100">Servidores Ativos</h3>
            <i class="pi pi-users text-blue-300 text-lg" aria-hidden="true" />
          </div>

          <p class="text-5xl font-bold my-4">{{ activeServers.total }}</p>
          <p class="text-blue-200 text-xs mb-6">{{ activeServers.description }}</p>

          <div class="flex flex-col gap-2">
            <div v-for="item in activeServers.breakdown" :key="item.label" class="flex items-center justify-between border-t border-blue-700 pt-2">
              <span class="text-sm text-blue-200">{{ item.label }}</span>
              <span class="font-bold text-white">{{ item.percent }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
