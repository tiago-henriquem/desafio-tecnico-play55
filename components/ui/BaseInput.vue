<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <slot name="icon" />
    </div>

    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
      :class="[
        'w-full text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-full py-2 px-4',
        'focus:outline-none',
        $slots.icon ? 'pl-10' : ''
      ]"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits(['update:modelValue'])
</script>
