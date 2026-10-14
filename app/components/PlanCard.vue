<script setup lang="ts">
import type { Offer } from '#shared/types'
import { formatPrice } from '#shared/offers'

defineProps<{ offer: Offer; selected: boolean; disabled?: boolean; name: string }>()
defineEmits<{ select: [] }>()
</script>

<template>
  <label class="card" :class="{ selected, disabled }">
    <input
      class="sr-only"
      type="radio"
      :name="name"
      :value="offer.id"
      :checked="selected"
      :disabled="disabled"
      @change="$emit('select')"
    >
    <span class="radio" aria-hidden="true">
      <img src="/icons/radio-on.svg" width="24" height="24" alt="" :hidden="!selected">
      <img src="/icons/radio-off.svg" width="24" height="24" alt="" :hidden="selected">
    </span>
    <span class="info">
      <span class="title-row">
        <span class="name">{{ offer.title }}</span>
        <span v-if="offer.badge" class="badge">{{ offer.badge }}</span>
      </span>
      <span v-if="offer.note" class="caption">{{ offer.note }}</span>
    </span>
    <span class="price">{{ formatPrice(offer.price) }}</span>
  </label>
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
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}
/* Толщина рамки не меняется: вторая линия — inset-тень, чтобы содержимое не сдвигалось при выборе. */
.card.selected {
  background: var(--color-accent-tint);
  border-color: var(--color-accent);
  box-shadow: inset 0 0 0 calc(var(--size-border-selected) - var(--size-border)) var(--color-accent);
}
.card.disabled { cursor: default; }
.card:has(:focus-visible) { outline: 2px solid var(--color-accent); outline-offset: 2px; }

.radio { display: block; flex: none; width: 24px; height: 24px; }
.radio img { display: block; }
.radio img[hidden] { display: none; }

.info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.title-row { display: flex; align-items: center; gap: var(--space-8); }
.name { font-size: 18px; line-height: 24px; font-weight: 700; color: var(--color-text-primary); }
.badge {
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-badge);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 12px;
  line-height: 16px;
  font-weight: 800;
  white-space: nowrap;
}
.caption { font-size: 14px; line-height: 20px; font-weight: 600; color: var(--color-text-secondary); }
.price { flex: none; font-size: 20px; line-height: 28px; font-weight: 800; color: var(--color-text-primary); white-space: nowrap; }
</style>
