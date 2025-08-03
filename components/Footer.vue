<template>
  <footer class="bg-gray-800 pt-[66px] text-gray-400 text-sm">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-20">
      <div class="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-8 pb-8 border-b border-gray-700">
        <div>
          <h3 class="text-white font-semibold text-lg mb-2">MinhaLoja</h3>
          <p>
            Sua loja online de confiança para encontrar os melhores produtos com os melhores preços.
            Qualidade e segurança em cada compra.
          </p>
        </div>
        <div>
          <h3 class="text-white font-semibold text-lg mb-2">Links</h3>
          <ul class="space-y-1">
            <li><a href="#" class="hover:text-white transition">Início</a></li>
            <li><a href="#" class="hover:text-white transition">Produtos</a></li>
            <li><a href="#" class="hover:text-white transition">Sobre Nós</a></li>
            <li><a href="#" class="hover:text-white transition">Política de Privacidade</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-white font-semibold text-lg mb-2">Fale Conosco</h3>
          <ContactForm />
        </div>
      </div>

      <div class="text-center text-xs text-gray-500 mt-6 py-4">
        © {{ new Date().getFullYear() }} MinhaLoja. Todos os direitos reservados.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import ContactForm from './forms/ContactForm.vue';

</script>
