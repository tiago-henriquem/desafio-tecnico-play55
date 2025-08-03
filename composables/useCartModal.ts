import { computed } from 'vue'
import { useCartStore } from '../stores/cart'

type CartModalEmit = (event: 'update:show', ...args: any[]) => void

export function useCartModal(emit: CartModalEmit) {
  const cart = useCartStore()

  const items = computed(() => cart.items)

  const total = computed(() =>
    cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  )

  const increment = (id: number) => cart.increment(id)
  const decrement = (id: number) => cart.decrement(id)

  const close = () => emit('update:show', false)

  const confirmPurchase = () => {
    console.log('Compra confirmada:', cart.items)
    cart.clearCart()
    close()
  }

  return {
    items,
    total,
    increment,
    decrement,
    confirmPurchase,
    close
  }
}
