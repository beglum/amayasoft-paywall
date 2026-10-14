<template>
  <div class="card" aria-hidden="true">
    <span class="bone radio" />
    <span class="info">
      <span class="bone name" />
      <span class="bone caption" />
    </span>
    <span class="bone price" />
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  height: 76px;
  padding: 0 var(--space-16);
  background: var(--color-surface);
  border: var(--size-border) solid var(--color-border);
  border-radius: var(--radius-card);
}
.bone { display: block; flex: none; background: var(--color-skeleton); border-radius: 8px; animation: pulse 1.2s ease-in-out infinite; }
.radio { width: 24px; height: 24px; border-radius: 50%; }
.info { display: flex; flex-direction: column; gap: var(--space-8); flex: 1; min-width: 0; }
.name { width: 96px; height: 16px; }
.caption { width: 144px; height: 12px; }
.price { width: 72px; height: 20px; }

@keyframes pulse { 50% { opacity: 0.55; } }
@media (prefers-reduced-motion: reduce) { .bone { animation: none; } }
</style>
