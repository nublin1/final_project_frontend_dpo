import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router';

import VTooltip from 'v-tooltip'

Vue.config.productionTip = false
Vue.use(VTooltip)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
