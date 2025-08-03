<template>
  <div class="rounded-lg w-full max-w-md relative">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-for="field in fields" :key="field.key">
        <input
          v-model="form[field.key]"
          @blur="validateField(field.key)"
          :type="field.type"
          :placeholder="field.label"
          class="input-field bg-gray-700 border-gray-700"
        />
        <p v-if="errors[field.key]" class="text-red-500 text-sm">{{ errors[field.key] }}</p>
      </div>
      <div>
        <textarea
          v-model="form.message"
          @blur="validateField('message')"
          placeholder="Digite sua mensagem"
          rows="4"
          class="input-field bg-gray-700 border-gray-700 resize-none"
        ></textarea>
        <p v-if="errors.message" class="text-red-500 text-sm">{{ errors.message }}</p>
      </div>

      <Button type="submit" class="w-full font-bold">Enviar Mensagem</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useContactForm } from '../../composables/useContactForm'
import Button from '../ui/BaseButton.vue'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['update:show', 'sent'])

const { form, errors, validateField, handleSubmit } = useContactForm(emit)

const fields = [
  { key: 'name', label: 'Nome', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Telefone', type: 'text' },
  { key: 'dob', label: 'Data de Nascimento', type: 'text' }
] as const
</script>

<style scoped>

</style>
