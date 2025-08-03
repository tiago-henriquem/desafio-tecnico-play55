<template>
<h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Nossos Produtos</h2>
<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-20">
    <ProductCard
      v-for="product in productsStore.filteredProducts"
      :key="product.id"
      :product="product"
    >
      <template #favorite>
        <button
          @click="toggleFavorite(product)"
          class="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
        >
        <HeartIcon :customClass="isFavorite(product) ? 'text-red-500' : 'text-white'" />
      </button>
      </template>
    
      <template #actions>
        <Button class="w-full" @click="addToCart(product)">
          Adicionar ao carrinho
        </Button>
      </template>
    </ProductCard>  
  </div>
</template>

<script setup lang="ts">
import ProductCard from '../cart/ProductCard.vue'
import { useProductList } from '../../composables/useProductList'
import HeartIcon from '../ui/icons/HeartIcon.vue'
import { useProductsStore } from '../../stores/products'
import Button from '../ui/BaseButton.vue'

const productsStore = useProductsStore()

const {
  toggleFavorite,
  isFavorite,
  addToCart
} = useProductList()
</script>
