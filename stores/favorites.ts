// stores/favorites.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '../types/product'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Set<Product>>(new Set())

  const toggleFavorite = (product: Product) => {
    if (favorites.value.has(product)) {
      favorites.value.delete(product)
    } else {
      favorites.value.add(product)
    }
  }

  const isFavorite = (product: Product) => favorites.value.has(product)

  return { favorites, toggleFavorite, isFavorite }
})
