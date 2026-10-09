import './styles/global.css'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { messages } from './utils/messages'

const i18n = createI18n({
    locale: 'en',
    allowComposition: true, // you need to specify that!
    messages
})

createApp(App).use(router).use(i18n).mount('#app')
