import './styles/global.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { t } from './i18n'

const app = createApp(App)
app.config.globalProperties.$t = t
// Wait for the first page's code so the prerendered HTML is swapped straight for
// the live page, without a blank frame in between.
app.use(router)
router.isReady().then(() => app.mount('#app'))
