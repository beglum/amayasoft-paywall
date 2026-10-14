<template>
  <div class="banner" role="status">
    <img class="icon" src="/icons/icon-info.svg" width="16" height="16" alt="" aria-hidden="true">
    <p class="text"><slot /></p>
  </div>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-8) var(--space-12);
  border-radius: var(--radius-banner);
  background: var(--color-info-bg);
}
.icon { display: block; flex: none; width: 16px; height: 16px; }
.text { flex: 1; min-width: 0; font-size: 14px; line-height: 20px; font-weight: 600; color: var(--color-text-primary); }
</style>
