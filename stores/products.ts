import { defineStore } from 'pinia'
import type { Product } from '../types/product'
import { ref, computed } from 'vue'
import { useFavoritesStore } from './favorites'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const search = ref('')
  const showOnlyFavorites = ref(false)

  const fetchProducts = async () => {
    loading.value = true
    try {
      const response = await fetch('https://fakestoreapi.com/products')
      products.value = await response.json()
    } finally {
      loading.value = false
    }
  }

  const filteredProducts = computed(() => {
    const favoritesStore = useFavoritesStore()

    let result = products.value

    if (showOnlyFavorites.value) {
      result = result.filter(p => favoritesStore.isFavorite(p))
    }

    return result.filter(p =>
      p.title.toLowerCase().includes(search.value.toLowerCase())
    )
  })

  return {
    products,
    loading,
    fetchProducts,
    search,
    showOnlyFavorites,
    filteredProducts
  }
})