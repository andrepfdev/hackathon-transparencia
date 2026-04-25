<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccessibilityStore } from '@/stores/accessibility'

const a11y = useAccessibilityStore()
onMounted(() => a11y.init())
</script>

<template>
  <!-- Skip link: primeiro elemento focável, pula direto para o conteúdo -->
  <a href="#main-content" class="skip-link">Ir para o conteúdo principal</a>

  <RouterView />
</template>
