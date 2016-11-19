import Vue from 'vue';
import App from './App.vue';
import VueRouter from "vue-router";
import VueResource from 'vue-resource';

import picker from './component/picker.vue';

Vue.component(picker.name, picker);

Vue.use(VueRouter);
Vue.use(VueResource);

import baseUsage from './component/baseUsage.vue';
import date from './component/date.vue';
import city from './component/city.vue';

const router = new VueRouter({
  routes: [
    {
      path: '/baseUsage',
      component: baseUsage
    },
    {
      path: '/date',
      component: date
    },
    {
      path: '/city',
      component: city
    }
  ]
})

const app = new Vue({
  router: router,
  render: render => render(App)
}).$mount('#app')
