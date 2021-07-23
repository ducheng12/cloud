import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import axios from 'axios'
import '@/icons' // icon
import Tools from '@/utils/tools'
import '@/permission' // permission control

Vue.prototype.$axios = axios

Vue.use(ElementUI)
Vue.use(Tools)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
