export default defineNuxtPlugin(() => {
  if (typeof window !== 'undefined' && !document.getElementById('recaptcha-script')) {
    const script = document.createElement('script')
    script.id = 'recaptcha-script'
    script.src = 'https://www.google.com/recaptcha/api.js?render=6LfTVC8rAAAAAISI8s59lF0JcXMq_XfgsHsepO5U'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }
})
