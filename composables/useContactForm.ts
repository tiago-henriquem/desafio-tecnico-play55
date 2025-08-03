import { reactive, watchEffect } from 'vue'
import { z } from 'zod'

type ContactFormEmit = (event: 'update:show' | 'sent', ...args: any[]) => void

export function useContactForm(emit: ContactFormEmit) {
  const form = reactive({
    name: '',
    email: '',
    phone: '',
    dob: '',
    message: ''
  })

  const errors = reactive({
    name: '',
    email: '',
    phone: '',
    dob: '',
    message: ''
  })

  const schema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(14, 'Telefone inválido'),
    dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida (dd/mm/aaaa)'),
  })

  // Máscaras
  watchEffect(() => {
    form.phone = form.phone
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15)

    form.dob = form.dob
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
      .slice(0, 10)
  })

  const validateField = (fieldName: keyof typeof form) => {
    const fieldSchema = schema.shape[fieldName]
    const result = fieldSchema.safeParse(form[fieldName])
    errors[fieldName] = result.success ? '' : result.error.issues[0]?.message || ''
  }

  const handleSubmit = async () => {
    const result = schema.safeParse(form)

    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = ''
    })

    if (!result.success) {
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof typeof errors
        errors[field] = err.message
      })
      return
    }

    const grecaptcha = (window as any).grecaptcha
    const token = await grecaptcha.execute('6LfTVC8rAAAAAISI8s59lF0JcXMq_XfgsHsepO5U', { action: 'form_submit' })

    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = ''
    })
  
    emit('sent')
    emit('update:show', false)
  }

  return {
    form,
    errors,
    validateField,
    handleSubmit
  }
}
