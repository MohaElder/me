/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import { createI18n } from 'vue-i18n'
import { messages } from './utils/messages'
import VueLazyLoad from 'vue3-lazyload'

const i18n = createI18n({
    locale: 'en',
    allowComposition: true, // you need to specify that!
    messages
})

const app = createApp(App)
registerPlugins(app)
app.use(i18n)
app.use(VueLazyLoad, {})
app.mount('#app')
