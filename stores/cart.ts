// stores/cart.ts
import { defineStore } from 'pinia'
import type { Product } from '../types/product'
import { ref } from 'vue'

export interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const addToCart = (product: Product) => {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ product, quantity: 1 })
    }
  }

  const increment = (productId: number) => {
    const item = items.value.find(i => i.product.id === productId)
    if (item) item.quantity++
  }

  const decrement = (productId: number) => {
    const index = items.value.findIndex(i => i.product.id === productId)
    if (index !== -1) {
      items.value[index].quantity--
      if (items.value[index].quantity <= 0) {
        items.value.splice(index, 1)
      }
    }
  }

  const clearCart = () => items.value = []

  return { items, addToCart, increment, decrement, clearCart }
})
