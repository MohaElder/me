import '../styles/global.css'
import { createApp } from 'vue'
import AdminApp from './AdminApp.vue'
import { load } from './store'

load().then(() => createApp(AdminApp).mount('#admin'))
