<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header @open-cart="onOpenCart" @open-contact="onOpenContact" />

    <main class="flex-1 pt-16 px-2 pb-8">
      <Main />
      <NuxtPage />
    </main>

    <Footer />
    <CartModal v-model:show="showCart" @sent="onContactSent"/>

  </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue'
import Main from '../components/Main.vue'
import ContactForm from '../components/forms/ContactForm.vue'
import Footer from '../components/Footer.vue'
import CartModal from '../components/cart/CartModal.vue'
import { ref } from 'vue'

const showCart = ref(false)
const showContactModal = ref(false)

const onOpenCart = () => {
  showCart.value = true
}

const onOpenContact = () => {
  showContactModal.value = true
}

const onContactSent = () => {
  console.log('Formulário enviado com sucesso!')
}

useHead({
  script: [
    {
      src: 'https://www.google.com/recaptcha/api.js?render=6LfTVC8rAAAAAISI8s59lF0JcXMq_XfgsHsepO5U',
      async: true,
      defer: true
    }
  ]
})
</script>
