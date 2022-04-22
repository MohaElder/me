import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueResource from "vue-resource";
import VueSocialSharing from 'vue-social-sharing';
import VueAnalytics from 'vue-analytics';



Vue.use(VueSocialSharing);
Vue.use(VueResource);

Vue.use(VueAnalytics, {
  id: 'G-G1LKCMNE1V',
  router
})  
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')