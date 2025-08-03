import { computed, ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

export function useHeaderActions(emit: (event: 'show-favourites') => void) {
  const cart = useCartStore()
  const productsStore = useProductsStore()

  const isActive = ref(false)

  const toggleFavourites = () => {
    isActive.value = !isActive.value
    productsStore.showOnlyFavorites = isActive.value
    emit('show-favourites')
  }

  const totalItems = computed(() =>
    cart.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  return {
    productsStore,
    isActive,
    totalItems,
    toggleFavourites,
  }
}
