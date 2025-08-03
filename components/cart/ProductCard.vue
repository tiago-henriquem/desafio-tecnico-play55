<template>
  <div class="bg-white rounded-lg shadow relative overflow-hidden border border-gray-200 p-4 flex flex-col h-full">
    <div class="relative h-40 bg-gray-100 flex justify-center items-center mb-4 rounded">
      <img :src="product.image" :alt="product.title" class="h-full object-contain" />
      <div class="absolute top-2 right-2 z-10">
        <slot name="favorite" />
      </div>
    </div>
    <div class="flex flex-col flex-1">
      <h2 class="font-semibold text-base text-gray-900 mb-1 line-clamp-2">{{ product.title }}</h2>
      <p class="text-sm text-gray-400 mb-1">{{ product.category }}</p>
      <p class="text-black font-bolder mb-3">R$ {{ product.price.toFixed(2) }}</p>

      <div class="mt-auto">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../../types/product'
defineProps<{ product: Product }>()
</script>
