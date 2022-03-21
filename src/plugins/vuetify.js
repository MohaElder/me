import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import Eroducate from '../components/eroducate.vue'
import vueIcon from '../components/vue-icon.vue'

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        values: {
            eroducate: { // name of our custom icon
                component: Eroducate, // our custom component
            },
            vueIcon: { // name of our custom icon
                component: vueIcon, // our custom component
            },
        },
    },
});
