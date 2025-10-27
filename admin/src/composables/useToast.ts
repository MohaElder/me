import { ref } from 'vue'

interface ToastMessage {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')
const toastDuration = ref(3000)

export function useToast() {
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
    toastMessage.value = message
    toastType.value = type
    toastDuration.value = duration
  }

  const success = (message: string, duration = 3000) => {
    showToast(message, 'success', duration)
  }

  const error = (message: string, duration = 3000) => {
    showToast(message, 'error', duration)
  }

  const info = (message: string, duration = 3000) => {
    showToast(message, 'info', duration)
  }

  return {
    toastMessage,
    toastType,
    toastDuration,
    showToast,
    success,
    error,
    info
  }
}

