<template>
  <header class="fixed top-0 w-full z-50 bg-white shadow px-6 py-4">
    <div class="grid grid-cols-[auto_1fr_auto] items-center max-w-7xl mx-auto w-full gap-4">
      <h1 class="text-xl font-bold text-gray-900">MinhaLoja</h1>
      <div class="flex justify-center">
        <BaseInput
          v-model="productsStore.search"
          name="search"
          type="text"
          placeholder="Procurar produtos..."
          class="w-full max-w-md"
        >
          <template #icon>
            <MagnifyingGlassIcon />
          </template>
        </BaseInput>
      </div>
      <HeaderActions
        @open-cart="$emit('open-cart')"
        @open-contact="$emit('open-contact')"
      />
    </div>
  </header>
  <div class="pt-[56px]">
    <MainBanner />
  </div>
</template>

<script setup lang="ts">
import MainBanner from '../components/MainBanner.vue'
import HeaderActions from './HeaderActions.vue'
import { useProductsStore } from '../stores/products'
import BaseInput from './ui/BaseInput.vue'
import MagnifyingGlassIcon from './ui/icons/MagnifyingGlassIcon.vue'


defineEmits(['open-cart', 'open-contact'])

const productsStore = useProductsStore()
</script>
