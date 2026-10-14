<script setup lang="ts">
withDefaults(defineProps<{ loading?: boolean; disabled?: boolean; type?: 'button' | 'submit' }>(), {
  loading: false,
  disabled: false,
  type: 'button',
})
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    class="cta"
    :class="{ loading }"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    @click="$emit('click')"
  >
    <img v-if="loading" class="spinner" src="/icons/spinner.svg" width="24" height="24" alt="">
    <span class="label" :class="{ 'sr-only': loading }"><slot /></span>
  </button>
</template>

<style scoped>
.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  width: 100%;
  height: var(--size-cta-h);
  padding: 0 var(--space-24);
  border-radius: var(--radius-cta);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 18px;
  line-height: 24px;
  font-weight: 800;
  white-space: nowrap;
}
.cta:disabled { background: var(--color-border); color: var(--color-disabled-text); }
.cta.loading { background: var(--color-accent); color: var(--color-on-accent); opacity: 0.64; }
.cta:not(:disabled):active { opacity: 0.85; }

.spinner { display: block; width: 24px; height: 24px; animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 2.4s; } }
</style>
