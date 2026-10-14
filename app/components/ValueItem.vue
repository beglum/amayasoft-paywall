<template>
  <li class="value">
    <img class="icon" src="/icons/icon-check.svg" width="24" height="24" alt="" aria-hidden="true">
    <span class="text"><slot /></span>
  </li>
</template>

<style scoped>
.value { display: flex; align-items: flex-start; gap: var(--space-12); list-style: none; }
.icon { display: block; flex: none; width: 24px; height: 24px; }
.text { flex: 1; min-width: 0; font-size: 16px; line-height: 24px; font-weight: 600; color: var(--color-text-primary); }
</style>
