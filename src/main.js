// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
// import 'reset-css'
Vue.use(VueResource);
import Popper from 'popper.js'
import '@/assets/css/bootstrap.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import bootstap from 'bootstrap'
import '@/assets/css/Site.css'
// import '@/assets/scripts/notify.js'


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
