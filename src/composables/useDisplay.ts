import { ref } from 'vue'

// Shared viewport state. "mobile" keeps Vuetify's old breakpoint (narrower than
// 1280px) so pages lay out the same as before.
const query = window.matchMedia('(max-width: 1279.98px)')
const mobile = ref(query.matches)
const width = ref(window.innerWidth)

query.addEventListener('change', e => (mobile.value = e.matches))
window.addEventListener('resize', () => (width.value = window.innerWidth), { passive: true })

export const useDisplay = () => ({ mobile, width })
