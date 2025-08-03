<template>
  <button
    class="bg-indigo-600 text-white h-10 rounded-lg transition hover:bg-indigo-700"
    :type="type"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ type?: 'button' | 'submit' }>()
</script>
