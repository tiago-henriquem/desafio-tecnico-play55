<template>
  <div class="flex items-center gap-6 justify-end">
    <button @click="toggleFavourites" class="relative" aria-label="Favoritos">
      <HeartIcon :class="isActive ? 'text-red-500' : 'text-white'" />
    </button>

    <button @click="$emit('open-cart')" class="relative" aria-label="Carrinho">
      <CartIcon />
      <span
        v-if="totalItems"
        class="absolute -top-2 text-xs bg-indigo-600 text-white rounded-full px-1"
      >
        {{ totalItems }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import CartIcon from './ui/icons/CartIcon.vue'
import HeartIcon from './ui/icons/HeartIcon.vue'
import { useHeaderActions } from '../composables/useHeaderActions'

const emit = defineEmits<{
  (e: 'open-cart'): void
  (e: 'open-contact'): void
  (e: 'show-favourites'): void
}>()

const {
  isActive,
  totalItems,
  toggleFavourites
} = useHeaderActions(emit)
</script>
