<script setup lang="ts">
defineProps<{ busy?: boolean }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error" role="alert">
    <p class="title">Не удалось загрузить тарифы</p>
    <p class="subtitle">Проверьте интернет и попробуйте снова</p>
    <button class="retry" type="button" :disabled="busy" @click="$emit('retry')">Повторить</button>
  </div>
</template>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-12);
  height: 164px;
  padding: var(--space-16) var(--space-24);
  background: var(--color-surface);
  border: var(--size-border) solid var(--color-border);
  border-radius: var(--radius-card);
  text-align: center;
}
.title { align-self: stretch; font-size: 18px; line-height: 24px; font-weight: 700; color: var(--color-text-primary); }
.subtitle { align-self: stretch; font-size: 14px; line-height: 20px; font-weight: 600; color: var(--color-text-secondary); }
.retry {
  display: flex;
  align-items: center;
  height: var(--size-touch-min);
  padding: 0 var(--space-24);
  background: var(--color-surface);
  border: var(--size-border-selected) solid var(--color-accent);
  border-radius: var(--radius-cta);
  color: var(--color-accent);
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
}
.retry:active { opacity: 0.7; }
.retry:disabled { opacity: 0.64; }
</style>
