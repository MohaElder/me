import { ref } from 'vue'
import { messages } from './utils/messages'

export const locale = ref<keyof typeof messages>('en')

// Looks up a dotted key such as 'message.nav_hi' in the current locale. Reading
// `locale` here makes templates and computeds re-render when it changes.
export const t = (key: string): string => {
  const value = key.split('.').reduce<any>((node, part) => node?.[part], messages[locale.value])
  return typeof value === 'string' ? value : key
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: typeof t
  }
}
