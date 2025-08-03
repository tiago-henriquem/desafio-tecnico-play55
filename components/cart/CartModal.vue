<template>
  <BaseModal :show="show" @close="close">
    <h2 class="text-2xl font-bold mb-4 border-b pb-4">Meu carrinho</h2>

    <div v-if="items.length === 0" class="text-gray-500">Carrinho vazio</div>

    <div v-else class="space-y-4 divide-y">
      <div
        v-for="item in items"
        :key="item.product.id"
        class="flex items-center justify-between pt-4"
      >
        <div class="flex items-center gap-4">
          <div>
            <img
              :src="item.product.image"
              alt="Product Image"
              class="w-16 h-16 object-cover rounded mr-4"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ item.product.title }}</p>
            <p class="text-sm font-bold text-indigo-600">R$ {{ item.product.price.toFixed(2) }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="decrement(item.product.id)"
            class="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
          >−</button>
          <span class="w-4 text-center">{{ item.quantity }}</span>
          <button
            @click="increment(item.product.id)"
            class="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
          >+</button>
        </div>
      </div>
    </div>

    <div class="mt-6 pt-4 border-t">
      <div class="flex justify-between items-center text-lg font-semibold mb-4">
        <span>Total:</span>
        <span class="text-indigo-600">R$ {{ total.toFixed(2) }}</span>
      </div>

      <Button class="w-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition" @click="confirmPurchase">
        Finalizar Compra
      </Button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useCartModal } from '../../composables/useCartModal'
import Button from '../ui/BaseButton.vue'
import BaseModal from '../ui/BaseModal.vue'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const {
  items,
  total,
  increment,
  decrement,
  confirmPurchase,
  close
} = useCartModal(emit)
</script>
