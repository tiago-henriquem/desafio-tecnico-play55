import { fileURLToPath, URL } from 'url'

export default defineNuxtConfig({
  css: ['@/assets/css/main.css'],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
      }
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  compatibilityDate: '2025-07-15',
  ssr: false,
  typescript: { strict: true }
})