// composables/useProductList.ts
import { computed, onMounted, ref } from 'vue'
import { useProductsStore } from '../stores/products'
import { useFavoritesStore } from '../stores/favorites'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types/product'

export function useProductList() {
  const productsStore = useProductsStore()
  const favoritesStore = useFavoritesStore()
  const cartStore = useCartStore()

  const search = ref('')

  onMounted(() => {
    if (!productsStore.products.length) {
      productsStore.fetchProducts()
    }
  })

  const filteredProducts = computed(() => {
    let result = productsStore.products

    if (productsStore.showOnlyFavorites) {
      result = result.filter(p => favoritesStore.isFavorite(p))
    }

    return result.filter(product =>
      product.title.toLowerCase().includes(search.value.toLowerCase())
    )
  })

  const toggleFavorite = (product: Product) => {
    favoritesStore.toggleFavorite(product)
  }

  const isFavorite = (product: Product) => {
    return favoritesStore.isFavorite(product)
  }

  const addToCart = cartStore.addToCart

  return {
    search,
    filteredProducts,
    toggleFavorite,
    isFavorite,
    addToCart
  }
}
