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
  id: 'G-CSNBNESM81',
  router
})
Vue.config.productionTip = false

// Import prism components whatever you like.
const Prism = require('prismjs/components/prism-core');
require('prismjs/plugins/toolbar/prism-toolbar.js');
require('prismjs/plugins/show-language/prism-show-language.js');
require('prismjs/plugins/line-numbers/prism-line-numbers.js');
require('prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js');
require('prismjs/components/prism-clike.js');
require('prismjs/components/prism-c.js');
require('prismjs/components/prism-cpp.js');
require('prismjs/components/prism-ini.js');
require('prismjs/components/prism-bash.js');
require('prismjs/components/prism-python.js');
require('prismjs/components/prism-protobuf.js');
require('prismjs/components/prism-json.js');
require('prismjs/components/prism-javascript.js');

// Extended the VueMarkdownBase
import VueMarkdownBase from 'vue-markdown';
VueMarkdownBase.props.anchorAttributes.default = () => ({ target: '_blank' });

Vue.component('VueMarkdown', {
  extends: VueMarkdownBase,

  watch: {
    source: {
      immediate: true,
      handler() {
        // After the content of markdown is rendered, use Prism to highlight the code blocks.
        this.$nextTick(() => Prism.highlightAllUnder(this.$el));
      },
    },
  },
});


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')