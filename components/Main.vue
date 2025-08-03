<template>
  <div class="main">
    <Nuxt />
    <ProductList />
  </div>
</template>

<script setup>
import ProductList from './products/ProductList.vue';
</script>
<style scoped>
.main {
  margin-top: 60px;
}
</style>
