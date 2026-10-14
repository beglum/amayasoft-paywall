<template>
  <header class="header">
    <Mascot />
    <h1 class="title"><slot /></h1>
  </header>
</template>

<style scoped>
.header { display: flex; flex-direction: column; align-items: center; gap: var(--space-16); }
.title { align-self: stretch; font-size: 28px; line-height: 36px; font-weight: 800; text-align: center; color: var(--color-text-primary); }
</style>
