import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from './router';

Vue.component('App', App);
Vue.use(BootstrapVue);

new Vue({
  router,
  template: '<App/>',
  components: {
    App
  },
  render: h => h(Ap p)
}).$mount('#app');;