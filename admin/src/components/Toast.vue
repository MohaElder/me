<template>
  <transition name="toast">
    <div v-if="show" class="toast" :class="type">
      <span class="toast-message">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, defineOptions } from 'vue'

defineOptions({
  name: 'Toast'
})

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}>()

const show = ref(false)
let timeout: number

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    show.value = true
    clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      show.value = false
    }, props.duration || 3000)
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  max-width: 400px;
}

.toast.success {
  background: #28a745;
  color: #fff;
}

.toast.error {
  background: #dc3545;
  color: #fff;
}

.toast.info {
  background: #FFD738;
  color: #0a0a0a;
}

.toast-message {
  display: block;
}

/* Toast animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

